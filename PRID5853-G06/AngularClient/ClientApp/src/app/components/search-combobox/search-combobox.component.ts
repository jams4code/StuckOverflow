import { Component, OnInit, Input, ViewChild, EventEmitter, Output, HostListener } from '@angular/core';
import { Tag } from '../models/tag';
import { TagService } from '../services/tag.service';
import { read } from 'fs';

@Component({
  selector: 'app-search-combobox',
  templateUrl: './search-combobox.component.html',
  styleUrls: ['./search-combobox.component.css']
})
export class SearchComboboxComponent implements OnInit {
  @Input() label:string;
  @Input('icon') leftIcon;
  @Input() prependNotFoundMessage:string;
  @Input() allowOtherValueIfNotFound:boolean=false;
  @Input() appendNotFoundMessage:string;
  @ViewChild('comboContainer', {static : false}) comboContainer; 
  @Input() selectedItem:Tag;
  @Input() otherValue:string;
  @ViewChild('comboList', {static : false}) comboList; 
  @Input() appendButton:boolean=false;
  @Input() appendButtonIcon;
  @Input() appendButtonClass="btn btn-primary";
  @Output() buttonClick = new EventEmitter<object>();
  @Input() placeHolder="";
  displayList=false;
  temporarySelection=1;
  itemsList:Tag[]=[];
    constructor(private tagService:TagService) { }
  
    ngOnInit() { 
       this.tagService.getAll().subscribe(data=>{
        this.itemsList = data;
      });
    }
  
    /**
   * Choose the skill we want
   * @param value The Skill choosed by click 
   */
  chooseItem(value) {
    this.setSelection(value);
       this.temporarySelection = -1;
     }
   
     rightButtonClick()
     {
      this.buttonClick.emit(this.selectedItem);
     }
     /**
      * Change the selection of the skill or validate the selection and close the skill sugg
      * @param event The key pressed
      */
     inputKeyDown(event) {
       this.displayList=true;
       if (this.itemsList) {
         if (event.key === "ArrowDown") {
         
           if (this.temporarySelection < this.itemsList.length - 1) {
             this.temporarySelection++;
             var containerHeight=this.comboContainer.nativeElement.offsetHeight;
        
             var selectedElement=this.comboList.nativeElement.getElementsByClassName("optionItemActive");
         
              if(selectedElement.length>0)
              {
               var elementHeight=selectedElement[0].offsetHeight;
               if(this.getOffset( selectedElement[0]).top>=containerHeight-elementHeight-10)
               this.comboContainer.nativeElement.scrollTop+=elementHeight;            
              }
              else
              this.comboContainer.nativeElement.scrollTop=0;
           }
         } else if (event.key === "ArrowUp") {
           if (this.temporarySelection > 0) {
             this.temporarySelection--;
         
            
             if(this.comboList.nativeElement.getElementsByClassName("optionItemActive").length>0)
             {
               var selectedElement=this.comboList.nativeElement.getElementsByClassName("optionItemActive");
            
        if(selectedElement.length>0)
        {
         var elementHeight=selectedElement[0].offsetHeight;
        //  if(this.getOffset(selectedElement[0]).top>=containerHeight-elementHeight)
         this.comboContainer.nativeElement.scrollTop-=elementHeight;           
        }
        }           
           else
           this.comboContainer.nativeElement.scrollTop=0;
           }
         } else if (event.key === "Enter") {
          this.setSelection();
        if(event.keyCode==13)
        {
          if(this.isValid())
          {
            this.buttonClick.emit(this.selectedItem);
            this.temporarySelection=-1;
            this.itemsList=[];
            return;
          }
        
        }
          }
         }
         event.stopPropagation();
         
       }
        getOffset( el ) {
         var _x = 0;
         var _y = 0;
         if( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
             _x += el.offsetLeft - el.scrollLeft;
             _y += el.offsetTop - el.scrollTop;
         }
         return { top: _y, left: _x };
     }
    
     
     setSelection(selectedItem:Tag=null)
     {
       
       if(selectedItem)
       {
         if(!selectedItem.id)
       {
        this.setValueToSelectedItem();    
        this.itemsList=[];    
      }
       else
       {
         this.setValueToSelectedItem(selectedItem);
       }
       }
       else
       if (this.temporarySelection >= 0 && this.temporarySelection <= this.itemsList.length - 1) {
         if(!this.itemsList[this.temporarySelection].id)
          {
              this.setValueToSelectedItem();
              this.itemsList=[];
          }
           else   
           {                       
              this.setValueToSelectedItem(this.itemsList[this.temporarySelection]);
           }
     
       }
       
       this.displayList=false;
     }
     setValueToSelectedItem(item=null)
     {
       if(!item || !item.id)
       {
    
      this.selectedItem.id=null;
      if(this.allowOtherValueIfNotFound==true)
      this.selectedItem.name=this.otherValue;
      else
      this.selectedItem.name="";
    }
    else
    {
      this.selectedItem.id=item.id;
      this.selectedItem.name=item.name;

    }
     }
     isValid()
     {       
       return this.selectedItem.id || (this.allowOtherValueIfNotFound&&this.selectedItem.name);

     }
   /**
   * Ajax search for skill
   * @param event If a key up event occurs 
   */
  search(event) {
    event.stopPropagation();
    if (event.key != "ArrowDown" && event.key != "ArrowUp" && event.key != "Enter") {
      if (event.target.value == "") {
        this.itemsList = [];
       
      } else {
     

        this.tagService.getAll().subscribe(data => {

          this.itemsList = data;
       
          this.temporarySelection = -1; 
          if(this.itemsList.length==0)
          {            
            if(this.allowOtherValueIfNotFound==true)  
            {
              this.otherValue=event.target.value;            
           
           }  
            this.itemsList.push(new Tag());
          }
     
        });
      }
    }
  }
  inputFocused=false;
  onFocus()
  {
    this.displayList=true;
    this.inputFocused=true;
  }
  onFocusOut()
  {
    this.inputFocused=false;
  }
  /**
   * Close all option when the click occurs outside
   * @param event The click event to close the burger
   */
  @HostListener('document:click', ['$event']) clickout(event) {
    if(!this.inputFocused)
    this.displayList=false;
    this.temporarySelection = -1;
  }
}


