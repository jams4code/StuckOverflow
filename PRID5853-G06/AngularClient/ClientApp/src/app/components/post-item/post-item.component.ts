import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../models/post';
import { VoteService } from '../services/vote.service';
import { PostService } from '../services/post.service';
import { AuthenticationService } from '../services/authentication.service';
import { Vote } from '../models/Vote';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Comment } from '../models/comment';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { Role } from '../models/user';
import { Router } from '@angular/router';
import { Author } from '../models/Author';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit{

  @Input('init')
  post: Post;
  @Input('parentPost')
  parentPost : Post;
  
  comment : Comment;
  userVoteUp : boolean;
  userVoteDown : boolean;
  isOwnerPost : boolean = false;
  canDeletePost: boolean = false;
  isOwnerComment : boolean = false;;
  constructor(private _snackBar : MatSnackBar, private voteService : VoteService, private authService : AuthenticationService, public dialog: MatDialog, private postService : PostService, private route: Router){}

  ngOnInit(){
    this.checkVote();
    this.checkIsOwner(this.post);
  }
  deletePost(post : Post){
    if(this.authService.currentUser){
      if(post.author.id == this.authService.currentUser.id || this.authService.currentUser.role == Role.Admin){
        this.postService.deletePost(post.id).subscribe((post:Post) => {
          if(post){
            this.openSnackBar("post deleted"); //Add popup message
            this.route.navigate(['/']);
          }

        });
      }
    }
  }
  deleteComment(comment : Comment, index : number){
    if(this.authService.currentUser){
      if(comment.author.id == this.authService.currentUser.id || this.authService.currentUser.role == Role.Admin){
        this.postService.deleteComment(comment.id).subscribe((comment:Comment) => {
          if(comment){
            this.post.comments.splice(index);
            this.openSnackBar("comment deleted");
            // this.post.comments.splice(index);
          }

        });
      }
    }
  }
  editComment(comment : Comment){
    this.openDialog(comment);
  }
  checkIsOwner(post : Post){
    if(this.authService.currentUser && post){
      if(post.author.id == this.authService.currentUser.id || this.authService.currentUser.role == Role.Admin){
        this.isOwnerPost = true;
        if( this.authService.currentUser.role == Role.Admin || post.parentId != 0){
          this.canDeletePost = true;
        } else {
          this.canDeletePost = false;
        }
      } else {
        this.isOwnerPost = false;
      }
    }
    
  }
  checkIsOwnerCom(comment : Comment) : boolean{
    if(this.authService.currentUser && comment){
      if(comment.authorId == this.authService.currentUser.id || this.authService.currentUser.role == Role.Admin){
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
  openDialog(commentAddEdit : any): void {
    if(this.authService.currentUser){
      if(commentAddEdit == null ||commentAddEdit.id == 0){
        commentAddEdit = new Comment();
        commentAddEdit.author = this.authService.currentUser;
        commentAddEdit.authorId = this.authService.currentUser.id;
        commentAddEdit.id = 0;
        
      }
      if(commentAddEdit.author.id == this.authService.currentUser.id || this.authService.currentUser.role == Role.Admin){
        const dialogRef = this.dialog.open(AddCommentComponent, {
          width: '1000px',
          data: {pseudo: commentAddEdit.author.pseudo, body: commentAddEdit.body}
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            commentAddEdit.body = result;
            if(commentAddEdit.id === 0){
              commentAddEdit.authorId = this.authService.currentUser.id;
              commentAddEdit.postId = this.post.id;
              commentAddEdit.author = null;
              commentAddEdit.id = 0;
                this.postService.createNewComment(commentAddEdit, this.post.id).subscribe(
                (comment : Comment) => {
                  if(comment){
                    if(this.post.comments == null){
                      this.post.comments = [];
                    }
                    this.post.comments.push(comment);
                    this.comment = new Comment(); //To erase data
                  }
                }
              );
            } else {
              var commentUpd = new Comment(commentAddEdit.id, commentAddEdit.body, null, null, commentAddEdit.postId, commentAddEdit.authorId, null);
              this.postService.updateComment(commentAddEdit.postId, commentUpd).subscribe(
                (comment : Comment) => {
                  if(comment){
                    this.comment = comment;
                  }
                }
              ) ;
              
            }
          }
          
  
        });
      } else {
        this.openSnackBar("Not owner");
      }
      
    } else {
      this.openSnackBarLogin("You must be logged in");
    }
    
  }
  
  voteUp(){
    if(this.post.id && this.authService.currentUser){
      if(this.authService.currentUser.reputation < 15){
        this.openSnackBar("You must have at least 15 reputation points to vote up.");
      } else {
        this.voteService.VoteUp(this.post.id, this.authService.currentUser).subscribe((post:Post) => {
          if(post){
            this.post = post;
            
          }
          this.checkVote();
        });
      }
    } else {
      this.openSnackBarLogin("You must be logged in");
    }
  }
  voteDown(){
    if(this.post.id && this.authService.currentUser){
      if(this.authService.currentUser.reputation < 15){
        this.openSnackBar("You must have at least 30 reputation points to vote up.");
      } else {
        this.voteService.VoteDown(this.post.id, this.authService.currentUser).subscribe((post:Post) => {
          if(post){
            this.post = post;
            
          }
        this.checkVote();
        });
      }
    } else {
      this.openSnackBarLogin("You must be logged in");
    }
    
  }


  checkVote(){
    if(this.post.id && this.authService.currentUser){
      this.voteService.CheckVote(this.post.id, this.authService.currentUser).subscribe((vote:Vote) => {
        if(vote){
          if(vote.upDown == 1){
            this.userVoteUp = true;
            this.userVoteDown = false;
            
          } else
          if(vote.upDown == (-1)){
            this.userVoteUp = false;
            this.userVoteDown = true;
  
          } else {
            this.userVoteUp = false;
            this.userVoteDown = false;
          }
          
        }
      });
    }
  }
  canAcceptAnswer(){
    if(this.post.id && this.authService.currentUser && this.parentPost){
      if(this.parentPost.author.id == this.authService.currentUser.id){
        if(this.parentPost.id != this.post.id){
          return true;
        }
      }
    }
    return false;
  }
  isAcceptedAnswer(){
    if(this.parentPost && this.post.id && this.parentPost.acceptedAnswerId){
      if(this.parentPost.acceptedAnswerId == this.post.id){
        return true;
      }
    }
    return false;
  }
  acceptAnswer(){
    if(this.post.id && this.authService.currentUser && this.parentPost){
      if(this.parentPost.acceptedAnswerId == this.post.id){
        this.parentPost.acceptedAnswerId = null;
      } else {
        this.parentPost.acceptedAnswerId = this.post.id;
      }
      this.postService.updatePost(this.parentPost.id, this.parentPost).subscribe((post:Post) => {
        if(post){
          this.parentPost = post;
        }
      });
    } else {
      this.openSnackBarLogin("You must be logged in");
    }
  }

  openSnackBar(msg : string) {
    var message = msg;
    var action = "x";

    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }
  openSnackBarLogin(msg : string) {
    var message = msg;
    var action = "LogIn";

    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    }).onAction().subscribe(() => 
      this.route.navigate(['/login'])
    );
  }
  
}
