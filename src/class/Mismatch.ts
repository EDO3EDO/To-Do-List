
import { AbstractControl, ValidationErrors, Validator } from "@angular/forms";


export let MisMatch = (control:AbstractControl):ValidationErrors | null => {
  let password = control.value.password ;
let rePassword = control.value.rePassword ;


if(password == rePassword && password && rePassword)

return null;
else{
  return {PasswordMisMatch:true};
}
}

