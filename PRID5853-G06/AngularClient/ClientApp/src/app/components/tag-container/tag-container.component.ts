import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Tag } from '../models/tag';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {faFistRaised} from '@fortawesome/free-solid-svg-icons';
import { PostService } from '../services/post.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatDialogRef, MatDialog, MatSnackBar, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { TagService } from '../services/tag.service';
import { AuthenticationService } from '../services/authentication.service';
import { Role } from '../models/user';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { startWith, map } from 'rxjs/operators';
@Component({
  selector: 'app-tag-container',
  templateUrl: './tag-container.component.html',
  styleUrls: ['./tag-container.component.css']
})
export class TagContainerComponent implements OnInit {
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  Chosentags: Tag[] = [];
  allTags: Tag[] = [];
  visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    addEdit = false;

    @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(private tagService: TagService,
    public authenticationService: AuthenticationService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    private cd: ChangeDetectorRef) {
      tagService.getAll().subscribe(tags => {
        this.allTags = tags
      });
      this.filteredTags = this.tagCtrl.valueChanges.pipe(
        startWith(null),
        map((tag: string | null) => tag ? this._filter(tag) : this.allTags.map(u => u.name).slice())
      )
  }
    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
      return this.allTags.filter(tag => tag.name.toLowerCase().indexOf(filterValue) === 0).map(u => u.name);
  }
  add(event: MatChipInputEvent): void {
    // Add tag only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
        const input = event.input;
        const value = event.value;
         ("1 :"+(value || '').trim());
         ("2 :"+input);
       // Add our tag
        if ((value || '').trim()) {
            var tag = this.allTags.find(u => u.name == value);
            if(tag && !this.Chosentags.find(u => u.name == tag.name)){
                this.Chosentags.push(tag);
                this.allTags = this.allTags.filter(u => u.name != tag.name);
            }
            else{
                 ("Deleted -  :" + tag);
            }
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.tagCtrl.setValue(null);
    }
}
selected(event: MatAutocompleteSelectedEvent): void {
    var tag = this.allTags.find(u => u.name == event.option.viewValue)
    if(!this.Chosentags.find(u => u.name == tag.name))
        this.Chosentags.push(tag);
        this.allTags = this.allTags.filter(u => u.name != tag.name);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
}
remove(tag: Tag): void {       
    const index = this.Chosentags.indexOf(tag);
    if (index >= 0) {
        this.Chosentags.splice(index, 1);
    }
    this.allTags.push(tag)
}
  ngOnInit() {
  }
}
