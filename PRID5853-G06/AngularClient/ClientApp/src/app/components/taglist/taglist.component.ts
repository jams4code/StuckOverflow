import { Component, OnInit } from '@angular/core';
import { Tag } from '../models/tag';
import { TagService } from '../services/tag.service';

@Component({
  selector: 'app-taglist',
  templateUrl: './taglist.component.html',
  styleUrls: ['./taglist.component.css']
})
export class TagListComponent implements OnInit {
  tags: Tag[] = [];
  constructor(private tagService: TagService) {
      tagService.getAll().subscribe(tags => {
        this.tags = tags;
      })
   }

  ngOnInit() {
  }

}
