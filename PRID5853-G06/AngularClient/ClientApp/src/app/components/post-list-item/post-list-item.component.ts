import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../models/post';
import * as moment from 'moment';

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.css']
})
export class PostListItemComponent implements OnInit {
  @Input() question : Post;
  
  askedMoment : string;
  constructor() { }

  ngOnInit() {
    this.askedMoment = moment(this.question.timestamp).fromNow();
  }

}
