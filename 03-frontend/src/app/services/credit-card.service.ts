import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {

  private countriesUrl = "http://localhost:8080/api/countries";
  private statesUrl = "http://localhost:8080/api/states";

  constructor(private httpClient : HttpClient) { }

  getCountries() : Observable<Country[]>{
    return this.httpClient.get<getResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(stateCode: String) : Observable<State[]>{

    // search url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${stateCode}` ;

    return this.httpClient.get<getResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

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


interface getResponseCountries{
  _embedded: {
    countries : Country[];
  }
}

interface getResponseStates{
  _embedded: {
    states : State[];
  }
}
 

