import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewThreadPageComponent } from './new-thread-page.component';

describe('NewThreadPageComponent', () => {
  let component: NewThreadPageComponent;
  let fixture: ComponentFixture<NewThreadPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewThreadPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewThreadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
