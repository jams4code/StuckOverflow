import { Component, OnInit } from '@angular/core';
import { PostService } from './components/services/post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  loading :boolean = true;
  loadingMessage = "Loading . . ."
  title = 'JWebApp Q&A';
  constructor(private postService: PostService){

  }
  ngOnInit(){
    //Request
    this.postService.getQuestions().subscribe(m=>{
      if(m){
        setTimeout(() => {
          this.loading = false;
          this.loadingMessage="";
        },1500);
      }
    });
    
  }
}
