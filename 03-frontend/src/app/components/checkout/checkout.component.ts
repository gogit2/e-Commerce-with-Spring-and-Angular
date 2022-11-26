import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { CreditCardService } from 'src/app/services/credit-card.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalQuantity : number = 0;
  totalPrice : number = 0;
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  constructor(private formBuilder: FormBuilder,
              private creditCardService: CreditCardService, 
              private cartService: CartService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
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

    // subscribe to the cart totalPrce
    this.cartService.totalPrice.subscribe(
      
      data => {
        console.log('totalPrice --------> ' + JSON.stringify(data));
        this.totalPrice = data;
      }
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
    } else{
      this.checkoutFormGroup.controls.billingAddress.reset();
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
    
  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value)
    console.log("==========================================")
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value)
    console.log("==========================================")
    console.log(this.checkoutFormGroup.get('billingAddress')?.value)
  }

  
    
}