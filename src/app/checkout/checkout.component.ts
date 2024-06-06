import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {IPayPalConfig,ICreateOrderRequest } from 'ngx-paypal';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{

  public payPalConfig ? : IPayPalConfig;
  checkoutStatus:boolean=false
  totalAmount:string=""

  checkoutForm = this.fb.group({
    username:['',[Validators.required,Validators.pattern('[a-zA-Z]*')]],
    address:['',[Validators.required,Validators.pattern('[a-zA-Z0-9,]*')]],
    pincode:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]]
  })

  constructor(private fb:FormBuilder,private toaster:ToastrService,private api:ApiService,private router:Router){}

  ngOnInit(): void {
    this.initConfig();
}

  proceedToBuy(){
    if(this.checkoutForm.valid){
      this.checkoutStatus=true
      if(sessionStorage.getItem("cartTotal")){
        this.totalAmount= sessionStorage.getItem("cartTotal")||""
      }
    }
    else{
      this.toaster.info("Invalid Form!!!")
    }
  }

  cancel(){
    this.checkoutForm.reset()
  }

  private initConfig(): void {
    this.payPalConfig = {
        currency: 'USD',
        clientId: 'sb',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: this.totalAmount,
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: this.totalAmount
                        }
                    }
                }
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then((details:any) => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            // steps to follow
            this.api.emptyCartApi().subscribe((res:any)=>{
              this.api.getcartCount()
              this.toaster.success("Successfully completed the payment....Thank you")
              this.checkoutStatus=false
              this.checkoutForm.reset()
              this.router.navigateByUrl("/")
            })
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            this.toaster.warning("Transaction has been cancelled!!!")
            this.checkoutStatus=false

        },
        onError: err => {
            console.log('OnError', err);
            this.toaster.warning("Transaction Failed")
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
        }
    };
  }

}
