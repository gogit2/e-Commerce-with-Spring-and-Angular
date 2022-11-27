import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CreditCardService } from 'src/app/services/credit-card.service';

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


    /*
    bausel on vid 18
    start with 19
    almost done
    */

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
