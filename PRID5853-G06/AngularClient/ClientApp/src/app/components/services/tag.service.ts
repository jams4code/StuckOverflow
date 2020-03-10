import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Tag } from '../models/tag';
import { map } from 'rxjs/operators';
import { ApiUrl } from 'src/app/common/ApiUrl';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TagService {
  constructor(private http: HttpClient) { }
  
  getAll() {
    return this.http.get<Tag[]>(ApiUrl.getUrl('tags'))
      .pipe(map(res => res.map(m => new Tag(m.id, m.name))));
  }
  
  createNewTag(Tag){
    return Observable.create(observer => {
      this.http.post(ApiUrl.getUrl('Tags/'), Tag).subscribe((data: any) => {
        observer.next(data)
        observer.complete()
      });
    });
  }

  updateTag(TagId, Tag){
    return Observable.create(observer => {
      this.http.put(ApiUrl.getUrl('Tags/' + TagId), Tag).subscribe((data : any) => {
        observer.next(data)
        observer.complete()
      });
    });
  }

  deleteTag(TagId){
    return Observable.create(observer => {
      this.http.delete(ApiUrl.getUrl('Tags/' + TagId)).subscribe((data : any) => {
        observer.next({Tag: data})
        observer.complete()
      });
    });
  }
}