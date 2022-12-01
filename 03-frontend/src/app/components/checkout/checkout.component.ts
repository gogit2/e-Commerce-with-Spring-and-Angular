import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
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
              private cartService: CartService) { }

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
    console.log(this.checkoutFormGroup.get('customer')?.value)
    console.log("==========================================")
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value)
    console.log("==========================================")
    console.log(this.checkoutFormGroup.get('billingAddress')?.value)
  }
    
}
