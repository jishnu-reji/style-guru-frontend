import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  allProducts:any=[]
  cartTotalprice:number=0
  couponStatus:boolean=false
  couponClickStatus:boolean=false

  constructor(private api:ApiService,private router:Router){}

  ngOnInit(): void {
    this.getCart()
  }

  getCart(){
    this.api.getcartApi().subscribe((res:any)=>{
      this.allProducts=res
      console.log(this.allProducts);
      this.getCartTotal()
    })
  }

  getCartTotal(){
    this.cartTotalprice = Math.ceil(this.allProducts.map((item:any)=>item.totalPrice).reduce((p1:any,p2:any)=>p1+p2))
  }

  removeCartItem(id:any){
    this.api.removeCartItemApi(id).subscribe({
      next:(result:any)=>{
        this.getCart()
        this.api.getcartCount()
      },
      error:(reason:any)=>{
        console.log(reason.error);
      }
    })
  }

  incrementCart(id:any){
    this.api.incrementCartApi(id).subscribe({
      next:(res:any)=>{
        this.getCart()
        this.api.getcartCount()
      },
      error:(reason:any)=>{
        console.log(reason); 
      }
    })
  }

  decrementCart(id:any){
    this.api.decrementCartApi(id).subscribe({
      next:(res:any)=>{
        this.getCart()
        this.api.getcartCount()
      },
      error:(reason:any)=>{
        console.log(reason); 
      }
    })
  }

  emptyCart(){
    this.api.emptyCartApi().subscribe({
      next:(res:any)=>{
        this.getCart()
        this.api.getcartCount()
      },
      error:(reason:any)=>{
        console.log(reason); 
      }
    })
  }

  getCoupon(){
    this.couponStatus=true
  }

  backToOfferBtn(){
    this.couponStatus=false
  }

  percent5Discount(){
    this.couponClickStatus=true
    let discount = Math.ceil(this.cartTotalprice*.05)
    this.cartTotalprice-=discount
  }

  percent20Discount(){
    this.couponClickStatus=true
    let discount = Math.ceil(this.cartTotalprice*.2)
    this.cartTotalprice-=discount
  }

  percent50Discount(){
    this.couponClickStatus=true
    let discount = Math.ceil(this.cartTotalprice*.5)
    this.cartTotalprice-=discount
  }

  checkout(){
    sessionStorage.setItem("cartTotal",JSON.stringify(this.cartTotalprice))
    this.router.navigateByUrl('/checkout')
  }
}
