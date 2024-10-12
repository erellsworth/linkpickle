import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingMakerComponent } from './setting-maker.component';

describe('SettingMakerComponent', () => {
  let component: SettingMakerComponent;
  let fixture: ComponentFixture<SettingMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingMakerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
