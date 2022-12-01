import { FormControl, ValidationErrors } from "@angular/forms";

export class IuShopValidators {

    // white space validation
    static notOnlyWhiteSpace(control: FormControl) : ValidationErrors{
        if((control.value != null) && (control.value.trim().length === 0)){
            
            // invalid, retyrn error object
            return {'notOnlyWhitespace' : true};    
        } else {
            // valid, return null
            return null;
        }
    }

}
