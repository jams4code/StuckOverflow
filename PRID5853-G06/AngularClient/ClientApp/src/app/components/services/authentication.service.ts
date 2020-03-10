import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, flatMap } from 'rxjs/operators';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { ApiUrl } from 'src/app/common/ApiUrl';
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  // l'utilisateur couramment connecté (undefined sinon)
  public currentUser: User;
  constructor(private http: HttpClient) {
    // au départ on récupère un éventuel utilisateur stocké dans le sessionStorage
    const data = JSON.parse(sessionStorage.getItem('currentUser'));
    this.currentUser = data ? new User(data.id, data.pseudo,  data.password, data.email, data.firstName, data.lastName, data.birthDate, data.reputation, data.role, data.token) : null;
  }
  login(pseudo: string, password: string) {
    return this.http.post<User>(ApiUrl.getUrl(`users/authenticate`), { pseudo, password })
      .pipe(map(user => {
        user = new User(user.id, user.pseudo, user.password, user.email, user.firstName, user.lastName, user.birthDate, user.reputation, user.role, user.token);
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUser = user;
        }
        return user;
      }));
  }
  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('currentUser');
    this.currentUser = null;
    }

    public isPseudoAvailable(pseudo: string): Observable<boolean> {
        return this.http.get<boolean>(ApiUrl.getUrl(`users/available/pseudo/${pseudo}`));
    }

    public isEmailAvailable(email: string): Observable<boolean> {
        return this.http.get<boolean>(ApiUrl.getUrl(`users/available/email/${email}`));
    }
    public signup(user: User): Observable<User> {
        return this.http.post<User>(ApiUrl.getUrl(`users/signup`), user).pipe(
            flatMap(res => this.login(user.pseudo, user.password)),
        );
    }

}
