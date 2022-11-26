import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {

  constructor() { }

  getCraditCardMonths(startMonth: number): Observable<number[]>{
    let data: number[] = [];

    // build an array for "Month" dropdown list
    // start with current month untill 12 month

    for(let theMonth: number = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }

    return of(data);
  }

  getCraditCardYears(): Observable<number[]>{
    let data: number[] = [];

    // build an array for "Year" dropdown list
    // start with current year till +10 years

    const currentYear: number = new Date().getFullYear();
    const endYear: number = currentYear + 10;

    for(let theYear = currentYear;  theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);
  }
}
