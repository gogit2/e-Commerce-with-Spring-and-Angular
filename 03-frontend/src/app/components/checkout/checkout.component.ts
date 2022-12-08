import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { O_TRUNC } from 'constants';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CreditCardService } from 'src/app/services/credit-card.service';
import { IuShopValidators } from 'src/app/validators/iu-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalQuantity = 0;
  totalPrice = 0;
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];
  countries: Country[] = [];
  shippingAddressStates : State[] = [];
  billingAddressStates : State[] = [];

  constructor(private formBuilder: FormBuilder,
              private creditCardService: CreditCardService, 
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), IuShopValidators.notOnlyWhiteSpace]),
        lastName:  new FormControl('', [Validators.required, Validators.minLength(2), IuShopValidators.notOnlyWhiteSpace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), IuShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), IuShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), IuShopValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), IuShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), IuShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), IuShopValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), IuShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
      })
    });

    // populate current month
    const startMonth: number = new Date().getMonth() + 1;
    console.log('startMonth ' + startMonth);

    // subscribe to credit card months
    this.creditCardService.getCraditCardMonths(startMonth).subscribe(
      data => {
        console.log('Retrived credit card months ' + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // subscribe to credit card years
    this.creditCardService.getCraditCardYears().subscribe(
      data => {
        console.log('Retrived credit card years ' + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
     
    this.reviewCartDetails(); 

    // subscribe to countries
    this.creditCardService.getCountries().subscribe(
      data => {
        console.log("Retrived countries " + JSON.stringify(data));
        this.countries = data;
      }
    )
  }
  
  reviewCartDetails(){   
    // subscribe to the cart totalPrce
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    ); 
  }

  copyShippingAddressToBillingAddress(event) {
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

        // fix states copy bug
        this.billingAddressStates = this.shippingAddressStates;

    } else{
      this.checkoutFormGroup.controls.billingAddress.reset();

      this.shippingAddressStates = [];
    }
  }
  
  handleMonthsAndYear() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear : number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number ;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    } else{
      startMonth = 1;
    }

    this.creditCardService.getCraditCardMonths(startMonth).subscribe(
      data => {
        console.log('Retrive credit card months ' + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

  }

  get firstName(){ return this.checkoutFormGroup.get('customer.firstName') }
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName') }
  get email(){ return this.checkoutFormGroup.get('customer.email') }
  
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country') }
  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street') }
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city') }
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state') }
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode') }

  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country') }
  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street') }
  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city') }
  get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state') }
  get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode') }

  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType') }
  get creditCardNameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard') }
  get creditCardCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber') }
  get creditCardSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode') }
  get creditCardExpirationMonth(){ return this.checkoutFormGroup.get('creditCard.expirationMonth') }
  get creditCardExpirationYear(){ return this.checkoutFormGroup.get('creditCard.expirationYear') }

  getStates(formGrupName: string){

    const formGroup = this.checkoutFormGroup.get(formGrupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;
     
    console.log(`{formGrupName} country code: ${countryCode}`);

    this.creditCardService.getStates(countryCode).subscribe(
      data => {
        
        if (formGrupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );

  }

  onSubmit(){
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
    
    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems 
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingAddressState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingAddressState.name;
    purchase.shippingAddress.country = shippingAddressCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingAddressState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingAddressState.name;
    purchase.billingAddress.country = billingAddressCountry.name;

    // populate purchase - order and order items
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the checkoutService
    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

        // reset cart 
        this.resetCart();
      }, 
      error: err => {
        alert(`There was an error: ${err.message}`);  
      } 
    });

  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form 
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }
    
}
