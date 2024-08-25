import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqueezeboxComponent } from './squeezebox.component';

describe('SqueezeboxComponent', () => {
  let component: SqueezeboxComponent;
  let fixture: ComponentFixture<SqueezeboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqueezeboxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SqueezeboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
