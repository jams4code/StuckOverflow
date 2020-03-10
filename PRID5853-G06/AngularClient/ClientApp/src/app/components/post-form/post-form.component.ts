import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PostService } from '../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../models/post';
import { AuthenticationService } from '../services/authentication.service';
import { faBookmark, faAlignLeft, faSave, faTimes} from '@fortawesome/free-solid-svg-icons';
import { Author } from '../models/Author';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  postId: number;
  post: Post;
  faBookmark = faBookmark;
  faAlignLeft = faAlignLeft;
  faSave = faSave;
  faTimes = faTimes;
  saveButton = "Save";


  constructor(private _snackBar : MatSnackBar ,private formBuilder: FormBuilder, private postService : PostService, private router: ActivatedRoute, private route: Router, private authService : AuthenticationService) { }

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.postId = params['id'];
      if(this.postId && this.postId != 0){
        this.post = this.postService.getPostById(this.postId);
      }
      else 
      {
    

        this.post = new Post();
        this.postService.post = new Post();
      }
    });
  }
  
  cancel() {
    this.route.navigate(['/']);
  }

  

  readonly savingText="Saving..."
  save() {
    if(this.saveButton==this.savingText)
    return;

    if (this.postId != 0) {
      this.postService.updatePost(this.postId, this.postService.post).subscribe(
        (post:Post) => {

          if (post) {        
            console.log("update successfully:", this.postService.post);
            this.saveButton = "Saved";
            this.resetButtonText();
          }
        });
    } else {
      this.postService.post.author = this.authService.currentUser;
      this.postService.createNewPost(this.postService.post, 0).subscribe(
        (post: Post) => {
          if (post) {
            this.postId = post.id;  
            console.log("created successfully:", this.postService.post);
            this.saveButton = "Saved";
            this.resetButtonText();
          }
        }
      );
    }
  }

  resetButtonText() {
    setTimeout(() => {

      this.saveButton = "Save";

    }, 6000)
  }

}
