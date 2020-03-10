import { Component, OnInit, Input } from '@angular/core';
import { faAlignLeft} from '@fortawesome/free-solid-svg-icons';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Post } from '../models/post';
@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {
  faAlignLeft = faAlignLeft;
  @Input() parentId: number;
  saveButton = "Save";
  body : string;
  constructor(private postService : PostService, private route : Router, private authService : AuthenticationService) { }

  ngOnInit() {
  }


  cancel() {
    this.route.navigate(['/']);
  }
  readonly savingText="Saving..."
  save() {
      if(this.saveButton==this.savingText)
      return;
      if(this.authService.currentUser && this.body.trim().length != 0){
        this.postService.post = new Post();
        this.postService.post.author = this.authService.currentUser;
        this.postService.post.parentId = this.parentId;
        this.postService.post.body = this.body;
        this.postService.createNewPost(this.postService.post, this.parentId).subscribe(
          (post: Post) => {
            if (post) {
              this.postService.post = post;  
              console.log("created successfully:", this.postService.post);
              this.saveButton = "Saved";
              this.resetButtonText();
            }
          }
        )
        }
    }
    resetButtonText() {
      setTimeout(() => {
  
        this.saveButton = "Save";
  
      }, 1000)
    }
}
