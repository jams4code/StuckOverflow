import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { User, Role } from '../models/user';
import { bindCallback } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent{
    public frm: FormGroup;
    public ctlPseudo: FormControl;
    public ctlEmail: FormControl;
    public ctlFirstName: FormControl;
    public ctlLastName: FormControl;
    public ctlBirthDate: FormControl;
    public ctlPassword: FormControl;
    public ctlPasswordConfirm: FormControl;
    public user : User;
    maxDate = new Date();
    minDate = new Date();
    
    
    
    constructor(
        public authService: AuthenticationService,
        public router: Router,
        private fb: FormBuilder
    ) {
        var year = this.maxDate.getFullYear();
        this.minDate.setFullYear(year-100);
        this.maxDate.setFullYear(year-18);
        this.ctlPseudo = this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern("^[a-zA-Z]([a-zA-Z0-9_]+)$")], [this.pseudoIsUsed()]);
        this.ctlEmail = this.fb.control('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')], [this.emailIsUsed()]);
        this.ctlFirstName = this.fb.control('', [Validators.minLength(3), Validators.maxLength(50)]);
        
        this.ctlLastName = this.fb.control({value: '', disabled : true}, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
        
        this.ctlBirthDate = this.fb.control('');
        this.ctlPassword = this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]);
        this.ctlPasswordConfirm = this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]);
        this.frm = this.fb.group({
            pseudo: this.ctlPseudo,
            email: this.ctlEmail,
            firstName: this.ctlFirstName,
            lastName: this.ctlLastName,
            birthDate: this.ctlBirthDate,
            password: this.ctlPassword,
            passwordConfirm: this.ctlPasswordConfirm,
        }, { validator: this.crossValidations });
    }

  ngOnInit() {
    this.setLastname();
  }
    //Filter for date picker
    checkIf18 = (d: Date): boolean => {
        const min = d;
        min.setFullYear(d.getFullYear() + 18);
        return Date.now() < min.getDate();
        
    }
    setLastname(){
        this.ctlFirstName.valueChanges.subscribe(name => {
            if(name.trim().length >= 3){
                this.ctlLastName.enable();
                this.ctlLastName.markAsTouched();
            } else {
                this.ctlLastName.setValue('');
                this.ctlLastName.disable();
            }
        })
    }
    crossValidations(group: FormGroup): ValidationErrors {
        if (!group.value) { return null; }
        return group.value.password === group.value.passwordConfirm ? null : { passwordNotConfirmed: true };
    }
    pseudoIsUsed() : AsyncValidatorFn {
        let timeout: NodeJS.Timeout;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const pseudo = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    this.authService.isPseudoAvailable(pseudo).subscribe(res => {
                        resolve(res ? null : { pseudoUsed: true });
                    });
                }, 300);
            });
        };
    }
    emailIsUsed(): AsyncValidatorFn {
        let timeout: NodeJS.Timeout;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const email = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    this.authService.isEmailAvailable(email).subscribe(res => {
                        resolve(res ? null : { pseudoUsed: true });
                    });
                }, 300);
            });
        };
    }

    signup() {

        this.user = new User(
            0,
            this.ctlPseudo.value,
            this.ctlPassword.value,
            this.ctlEmail.value,
            this.ctlFirstName.value,
            this.ctlLastName.value,
            this.ctlBirthDate.value,
            0,
            Role.Member,
            ""
            );

        this.authService.signup(this.user).subscribe(() => {
            if (this.authService.currentUser) {
                // Redirect the user
                this.router.navigate(['/']);
            }
        });
    }
    // var userJsonFormat = () => {
    //     pseudo : this.ctlPseudo.value;
    //     password : this.ctlPassword.value;
    //     email : this.ctlEmail.value;
    //     firstName : this.ctlFirstName.value;
    //     lastName : this.ctlLastName.value;
    //     birthDate : this.ctlBirthDate.value;
    // }
}
