import { Component } from '@angular/core';
import { NameValuePair } from '../../../interfaces/misc.types';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToggleComponent } from '../../../pickle-ui/forms/toggle/toggle.component';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-setting-maker',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, ToggleComponent],
  templateUrl: './setting-maker.component.html',
  styleUrl: './setting-maker.component.scss',
})
export class SettingMakerComponent {
  public formGroup = this.fb.group({
    name: ['', Validators.required],
    label: ['', Validators.required],
    isAdmin: [false],
    dataType: ['string'],
  });
  public icons = {
    add: faPlus,
  };
  public dataTypes: NameValuePair[] = [
    {
      name: 'Text',
      value: 'string',
    },
    {
      name: 'True/False',
      value: 'boolean',
    },
    {
      name: 'Number',
      value: 'number',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
  ) {}

  public addSetting() {
    console.log('add', this.formGroup);
  }
}
