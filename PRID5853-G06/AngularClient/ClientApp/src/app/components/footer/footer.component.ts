import { Component, OnInit } from '@angular/core';
import { faTwitter, faFacebookSquare, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { PostService } from '../services/post.service';
import { Post } from '../models/post';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  faTwitter = faTwitter;
  faFacebookSquare = faFacebookSquare;
  faLinkedinIn = faLinkedinIn
  faQuestionCircle = faQuestionCircle;
  questions: Post[] = [];
  constructor(private questionService: PostService) { 
    questionService.getLastQuestion().subscribe(questions => {
      this.questions = questions;
    })
    
  }

  ngOnInit() {
  }

}
