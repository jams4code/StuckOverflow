import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComboboxComponent } from './search-combobox.component';

describe('SearchComboboxComponent', () => {
  let component: SearchComboboxComponent;
  let fixture: ComponentFixture<SearchComboboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComboboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
