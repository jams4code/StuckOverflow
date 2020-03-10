import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatTable, MatSnackBar } from '@angular/material';
import { Tag } from '../models/tag';
import { TagService } from '../services/tag.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { PostService } from '../services/post.service';
import { UserDialogBoxComponent } from '../user-dialog-box/user-dialog-box.component';
 
@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {

  displayedColumns: string[] = ['id', 'name', 'action'];
  displayedColumnsUsers: string[] = ['id', 'pseudo', 'email', 'lastname', 'firstname', 'birthdate', 'reputation', 'role','action'];
  tags : Tag[];
  users : User[];
 
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
 
  constructor(private _snackBar: MatSnackBar, public dialog: MatDialog, private tagService : TagService, private userService : UserService, private PostService : PostService) {
    this.tagService.getAll().subscribe(tags => {
      this.tags = tags;
     
    });
    this.userService.getAll().subscribe(users => {
      this.users = users;
      console.log(users);
    })
  }
  openSnackBar(isDbSuccess : boolean) {
    var message;
    var action = "X";
    if(isDbSuccess){
      message = "Database updated successfully";
    } else {
      message = "Database error - Row not updated";
    }
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data:obj
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.addRowData(result.data);
      }else if(result.event == 'Update'){
        this.updateRowData(result.data);
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
    });
  }
  openDialogUser(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(UserDialogBoxComponent, {
      width: '350px',
      data:obj
    });
 
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result.event == 'Add'){
        this.addRowUser(result.data);
      }else if(result.event == 'Update'){
        this.updateRowUser(result.data);
      }else if(result.event == 'Delete'){
        this.deleteRowUser(result.data);
      }
    });
  }
 
  addRowData(row_obj){
    var tag = row_obj;
    this.tagService.createNewTag(tag).subscribe(tagPost => {
      tag = tagPost;
      console.log(tag);
      console.log(tagPost);
      this.openSnackBar(tagPost != null);
      if(tagPost){
        console.log(tag.value);
        console.log(tag.value.name);
        this.tags.push({
          id:tag.value.id,
          name:tag.value.name
        });
        this.table.renderRows();
      }
    });
    
    
  }
  updateRowData(row_obj){
    var tag = row_obj;
    this.tagService.updateTag(tag.id, tag).subscribe(tagPost => {
      tag = tagPost;
      this.openSnackBar(tagPost != null);
      if(tagPost != null){
        this.tags = this.tags.filter((value,key)=>{
          if(value.id === tag.value.id){
            value.name = tag.value.name;
          }
          return true;
        });
      }
    });
    
  }
  deleteRowData(row_obj){
    var tag = row_obj;
    this.tagService.deleteTag(tag.id).subscribe(tagPost => {
      this.openSnackBar(tagPost != null);
      if(tagPost){
        this.tags = this.tags.filter((value,key)=>{
          return value.id != row_obj.id;
        });
      }
    });
    
  }
  deleteRowUser(row_obj){
    var user = row_obj;
    this.userService.deleteuser(user.id).subscribe(user => {
      this.openSnackBar(user != null);
      if(user){
        this.users = this.users.filter((value,key)=>{
          return value.id != row_obj.id;
        });
      }
    });
    
  }
  updateRowUser(row_obj){
    var user = row_obj;
    this.userService.updateuser(user.id, user).subscribe(userPost => {
      user = userPost;
      this.openSnackBar(userPost != null);
      if(userPost != null){
        this.users = this.users.filter((value,key)=>{
          if(value.id === user.value.id){
            value.pseudo = user.value.pseudo;
            value.email = user.value.email;
            value.lastName = user.value.lastName;
            value.firstName = user.value.firstName;
            value.birthDate = user.value.birthDate;
            value.reputation = user.value.reputation;
            value.role = user.value.role;
          }
          return true;
        });
      }
    });
    
  }
  addRowUser(row_obj){
    var user = row_obj;
    this.userService.createNewuser(user).subscribe(userPost => {
      user = userPost;
      console.log(user);
      console.log(userPost);
      this.openSnackBar(userPost != null);
      if(userPost){
        user = userPost;
        this.users.push(user);
        this.table.renderRows();
      }
      this.table.renderRows();
    });
    
    
  }
 
}