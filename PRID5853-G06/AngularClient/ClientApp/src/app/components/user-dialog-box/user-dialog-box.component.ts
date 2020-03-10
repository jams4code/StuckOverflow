import { Component, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../models/user';

@Component({
  selector: 'app-user-dialog-box',
  templateUrl: './user-dialog-box.component.html',
  styleUrls: ['./user-dialog-box.component.css']
})
export class UserDialogBoxComponent {

  action:string;
  local_data:any;
 
  constructor(
    public dialogRef: MatDialogRef<UserDialogBoxComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: User) 
  {
    this.local_data = {...data};
    this.action = this.local_data.action;
  }
 
  doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data});
  }
 
  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}
