import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostListTagComponent } from './post-list-tag.component';

describe('PostListTagComponent', () => {
  let component: PostListTagComponent;
  let fixture: ComponentFixture<PostListTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostListTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostListTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
