import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { ApiUrl } from 'src/app/common/ApiUrl';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }
  
  getAll() {
    return this.http.get<User[]>(ApiUrl.getUrl(`users`))
      .pipe(map(res => res.map(m => new User(m.id, m.pseudo, m.password, m.email, m.firstName, m.lastName, m.birthDate, m.reputation, m.role, m.token))));
  }
  createNewuser(user){
    return Observable.create(observer => {
      this.http.post(ApiUrl.getUrl('users/'), user).subscribe((data: any) => {
        observer.next(data)
        observer.complete()
      });
    });
  }

  updateuser(userId, user){
    return Observable.create(observer => {
      this.http.put(ApiUrl.getUrl('users/' + userId), user).subscribe((data : any) => {
        observer.next(data)
        observer.complete()
      });
    });
  }

  deleteuser(userId){
    return Observable.create(observer => {
      this.http.delete(ApiUrl.getUrl('users/' + userId)).subscribe((data : any) => {
        observer.next({user: data})
        observer.complete()
      });
    });
  }
  
}