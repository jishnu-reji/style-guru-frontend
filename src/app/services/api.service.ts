import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  wishlistCount = new BehaviorSubject(0)
  cartCount = new BehaviorSubject(0)

  server_url = "https://styleguru-server.onrender.com"

  constructor(private http:HttpClient) {
    if(sessionStorage.getItem('token')){
      this.getwishlistCount()
      this.getcartCount()
    }
  } 

  getAllProduct(){
    return this.http.get(`${this.server_url}/allproducts`)
  }

  registerApi(user:any){
    return this.http.post(`${this.server_url}/register`,user)
  }

  loginApi(user:any){
    return this.http.post(`${this.server_url}/login`,user)
  }


  appendToken(){
    const token = sessionStorage.getItem('token')
    let headers = new HttpHeaders()
    if(token){
      headers = headers.append("Authorization",`Bearer ${token}`)
    }
    return {headers}
  }
  
  addtoWishlistApi(product:any){
    return this.http.post(`${this.server_url}/user/addtowishlist`,product,this.appendToken())
  }

  getwishlistApi(){
    return this.http.get(`${this.server_url}/getwishlist`,this.appendToken())
  }

  getwishlistCount(){
    this.getwishlistApi().subscribe((result:any)=>{
      this.wishlistCount.next(result.length)
    })
  }

  getAProductApi(id:any){
    return this.http.get(`${this.server_url}/${id}/getaproduct`)
  }

  removeWishlistApi(id:any){
    return this.http.delete(`${this.server_url}/removewishlist/${id}/item`,this.appendToken())
  }

  addtocartApi(product:any){
    return this.http.post(`${this.server_url}/user/addtocart`,product,this.appendToken())
  }

  getcartApi(){
    return this.http.get(`${this.server_url}/getcart`,this.appendToken())
  }

  getcartCount(){
    this.getcartApi().subscribe((result:any)=>{
      this.cartCount.next(result.length)
    })
  }

  removeCartItemApi(id:any){
    return this.http.delete(`${this.server_url}/removecartitem/${id}/item`,this.appendToken())
  }

  incrementCartApi(id:any){
    return this.http.get(`${this.server_url}/${id}/incrementcart`,this.appendToken())
  }

  decrementCartApi(id:any){
    return this.http.get(`${this.server_url}/${id}/decrementcart`,this.appendToken())
  }

  emptyCartApi(){
    return this.http.delete(`${this.server_url}/emptycart`,this.appendToken())
  }
}
