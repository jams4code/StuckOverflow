import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from '../models/tag';
import {faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tag-item',
  templateUrl: './tag-item.component.html',
  styleUrls: ['./tag-item.component.css']
})
export class TagItemComponent implements OnInit {

  @Input() tag: Tag;
  @Output()
  deletedTag = new EventEmitter<number>();
  faTimes=faTimes;
  @Input() index:number;
  constructor() {  
  }

  ngOnInit() { 
  }

  /**
   * Send the event to delete the strength
   */
  deleteTag() {
    this.deletedTag.emit(this.index);
  }

}
