import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit{

  allProducts:any=[]
  constructor(private api:ApiService,private toaster:ToastrService){}

  ngOnInit(): void {
    this.getWishlist()
  }
  getWishlist(){
    this.api.getwishlistApi().subscribe((res:any)=>{
      this.allProducts=res   
      this.api.getwishlistCount()   
    })
  }

  removewishlist(id:any){
    this.api.removeWishlistApi(id).subscribe((res:any)=>{
      this.getWishlist()
    })
  }

  addToCart(product:any){
    if(sessionStorage.getItem("token")){
      product.quantity=1
      this.api.addtocartApi(product).subscribe({
        next:(result:any)=>{
          this.toaster.success(result)
          this.api.getcartCount()
          this.removewishlist(product._id)
        },
        error:(reason:any)=>{
          this.toaster.warning(reason.error)
        }
      })
    }
    else{
      this.toaster.warning("Please Login")
    }
  }
}
