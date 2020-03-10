import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  post : Post;
  postId : number = 0;
  askedDate : string;
  activeDate : string;
  constructor(private route: Router, private router: ActivatedRoute, private postService: PostService) { 

  }

  ngOnInit() {
    this.router.params.subscribe(params => {
      
      this.postId = params['id'];


      this.postService.getPostById(this.postId).subscribe(
        (data : Post) => {
          if(data){
            this.post = data;
            this.postInfoDate();
          }
          
        }
      );
    });
    
  }

  postInfoDate(){
    if(this.post){
        var datePost = this.post.timestamp;
        this.askedDate = moment(datePost).fromNow();
        var dateActivity = this.post.lastActivityTimeStamp;
        this.activeDate = moment(dateActivity).fromNow();
    }
  }

  

}
