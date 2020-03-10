import { Component, OnInit, Input, Output } from '@angular/core';
import { User } from '../models/user';
import { FormGroup, FormControl, FormBuilder, Validators, ValidationErrors, AsyncValidatorFn, Validator } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  @Input() user : User;
  public frm: FormGroup;
    public ctlPseudo: FormControl;
    public ctlEmail: FormControl;
    public ctlFirstName: FormControl;
    public ctlLastName: FormControl;
    public ctlBirthDate: FormControl;
    public ctlReputation: FormControl;
    public ctlRole: FormControl;
    //For DatePicker if time
    maxDate = new Date();
    minDate = new Date();
    constructor(
      public authService: AuthenticationService,
      private fb: FormBuilder
  ) {
      var year = this.maxDate.getFullYear();
      this.minDate.setFullYear(year-100);
      this.maxDate.setFullYear(year-18);
      this.ctlPseudo = this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(10),Validators.pattern("^[a-zA-Z]([a-zA-Z0-9_]+)$")], [this.pseudoIsUsed()]);
      this.ctlEmail = this.fb.control('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')], [this.emailIsUsed()]);
      this.ctlFirstName = this.fb.control('', [Validators.minLength(3), Validators.maxLength(50)]);
      this.ctlLastName = this.fb.control({value : '', disabled : true}, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
      this.ctlBirthDate = this.fb.control('');
      this.ctlReputation = this.fb.control('', [Validators.required, Validators.max(100), Validators.min(-1)]);
      this.ctlRole = this.fb.control('', [Validators.required, Validators.max(3), Validators.min(1)]);
      this.frm = this.fb.group({
          pseudo: this.ctlPseudo,
          email: this.ctlEmail,
          firstName: this.ctlFirstName,
          lastName: this.ctlLastName,
          birthDate: this.ctlBirthDate,
          reputation: this.ctlReputation,
          role: this.ctlRole,
      });
  }
  ngOnInit() {
    this.setLastname();
    if(this.user.id){
      this.ctlPseudo.setValue(this.user.pseudo);
      this.ctlEmail.setValue(this.user.email);
      this.ctlFirstName.setValue(this.user.firstName);
      this.ctlLastName.setValue(this.user.lastName);
      this.ctlBirthDate.setValue(this.user.birthDate);
      this.ctlReputation.setValue(this.user.reputation);
      this.ctlRole.setValue(this.user.role);
    }
    
    
  }
  setLastname(){
    this.ctlFirstName.valueChanges.subscribe(name => {
        if(name.trim().length >= 3){
            this.ctlLastName.enable();
            this.ctlLastName.markAsTouched();
        } else {
            this.ctlLastName.disable();
        }
    })
}

pseudoIsUsed() : AsyncValidatorFn {
  let timeout: NodeJS.Timeout;
  return (ctl: FormControl) => {
      clearTimeout(timeout);
      const pseudo = this.ctlPseudo.value;
      
      return new Promise(resolve => {
          timeout = setTimeout(() => {
            if(pseudo != this.user.pseudo){
              this.authService.isPseudoAvailable(pseudo).subscribe(res => {
                  resolve(res ? null : { pseudoUsed: true });
              });
            } else {;
              resolve({ pseudoUsed : false});
            }
              
          }, 300);
      });
  };
}
emailIsUsed(): AsyncValidatorFn {
  let timeout: NodeJS.Timeout;
  return (ctl: FormControl) => {
      clearTimeout(timeout);
      const email = this.ctlEmail.value;
      return new Promise(resolve => {
        timeout = setTimeout(() => {
          if(email != this.user.email){
            this.authService.isPseudoAvailable(email).subscribe(res => {
                resolve(res ? null : { emailUsed: true });
            });
          } else {
            resolve({ emailUsed : false});
          }
            
        }, 300);
      });
  };
}
}
