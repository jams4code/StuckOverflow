import { Component, OnInit } from '@angular/core';
import { PostService } from '../components/services/post.service';
import { searchQuery, filterEnum } from '../components/models/searchQuery';
import { Post } from '../components/models/post';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-list-tag',
  templateUrl: './post-list-tag.component.html',
  styleUrls: ['./post-list-tag.component.css']
})
export class PostListTagComponent implements OnInit {
  questions: Post[] = [];
  askedMoment : string;
  tagId : number
  constructor(private router: ActivatedRoute, private questionService: PostService) { 
    
  }
  ngOnInit() {
    this.router.params.subscribe(params => {
      
      this.tagId = params['id'];


      this.questionService.getPostByTag(this.tagId).subscribe(questions => {
          this.questions = questions
          
        }
      );
    });
    
  }
  

}
