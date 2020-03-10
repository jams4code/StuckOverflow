import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post } from '../models/post';
import { map } from 'rxjs/operators';
import { ApiUrl } from 'src/app/common/ApiUrl';
import { Observable } from 'rxjs';
import { Vote } from '../models/Vote';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class VoteService {
  post : Post;
  constructor(private http: HttpClient) { }

  VoteUp(postId : number, currentUser : User){
    return Observable.create(observer => {
      this.http.post(ApiUrl.getUrl('Votes/up/' + postId), currentUser).subscribe((data: Post) => {
        observer.next(data)
        observer.complete()
      });
    }); 
  }
  VoteDown(postId : number, currentUser : User){
    return Observable.create(observer => {
      this.http.post(ApiUrl.getUrl('Votes/down/' + postId), currentUser).subscribe((data: Post) => {
        observer.next(data)
        observer.complete()
      });
    }); 
  }

  CheckVote(postId : number, currentUser : User){
    return Observable.create(observer => {
      this.http.post(ApiUrl.getUrl('Votes/check/' + postId), currentUser).subscribe((data: Vote) => {
        observer.next(data)
        observer.complete()
      });
    }); 
  }
}