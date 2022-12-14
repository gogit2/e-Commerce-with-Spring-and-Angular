import { Injectable } from '@angular/core';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0); 
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0); 


  constructor() { }

  addToCart(theCartItem: CartItem){

    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined;

    if(this.cartItems.length > 0){
      // find the item in the cart based on item id 
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart){
      if (existingCartItem != undefined)
        // incrememt the quantity
        existingCartItem.quantity++;
    } else{
      // add it to Cart Items
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    
    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribes will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart ..');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.unitPrice * tempCartItem.quantity;
      console.log(`Product name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, 
      price: ${tempCartItem.unitPrice}, subTotalPrice: ${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue}, totalQuantityValue: ${totalQuantityValue}`);
    console.log(`***********`);
  }


  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity-- ;

    if(theCartItem.quantity == 0){
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem){
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id == theCartItem.id);

    // if found, remove the item from the array at the given index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

}
