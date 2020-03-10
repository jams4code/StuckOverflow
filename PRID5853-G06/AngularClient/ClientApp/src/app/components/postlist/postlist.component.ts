import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { searchQuery, filterEnum } from '../models/searchQuery';
import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-postlist',
  templateUrl: './postlist.component.html',
  styleUrls: ['./postlist.component.css']
})
export class PostListComponent {
  questions: Post[] = [];
  askedMoment : string;
  search: searchQuery;
  keywords : string;
  faSearch = faSearch;
  
  constructor(private _snackBar: MatSnackBar, private questionService: PostService, private authService : AuthenticationService, private router : Router) { 
    questionService.getQuestions().subscribe(questions => {
      this.questions = questions; 
    })
    
    this.search = new searchQuery();
    
  }
  searchIt() { 
    console.log("search");
    if(this.keywords){
      this.search.updKeywords(this.keywords);
    } else {
      this.search.updKeywords("");
    }
    
    this.questionService.search(this.search).subscribe(questions => {
      console.log("look");
      this.questions = questions;
    });
  }
  onKey(event: KeyboardEvent) {
    if (event.keyCode == 13) {
        this.searchIt();
    }

  }
  byVotesSearch(){
    this.search.updFilter(filterEnum.ByVotes);
    console.log("By vote search");
    this.searchIt()
  }
  newestSearch(){
    this.search.updFilter(filterEnum.ByTime);
    this.searchIt()
  }
  unansweredSearch(){
    this.search.updFilter(filterEnum.NotAnswered);
    this.searchIt()
  }
  openSnackBar() {
    var message = "You must be logged in to ask a question";
    var action = "Login";

    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    }).onAction().subscribe(() => 
      this.router.navigate(['/login'])
    );
  }
  askQuestion(){
    if(this.isConnected()){
      this.router.navigate(['/questions/ask/0']);
    } else {
      this.openSnackBar();
    }
  }
  isConnected(){
    if(this.authService.currentUser){
      return true;
    } else {
      return false;
    }
  }

}
