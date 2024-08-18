import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkPicklerComponent } from './link-pickler.component';

describe('LinkPicklerComponent', () => {
  let component: LinkPicklerComponent;
  let fixture: ComponentFixture<LinkPicklerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkPicklerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkPicklerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
