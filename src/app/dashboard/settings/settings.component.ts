import { Component, effect, OnInit } from '@angular/core';
import { DashboardPageComponent } from '../components/dashboard-page/dashboard-page.component';
import { SettingsService } from '../../services/settings.service';
import { LpSetting } from '../../../../api/interfaces/setting';
import { JsonPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToggleComponent } from '../../pickle-ui/forms/toggle/toggle.component';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [DashboardPageComponent, ReactiveFormsModule, ToggleComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  public formGroup: FormGroup = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private settingService: SettingsService,
    private toaster: ToasterService,
  ) {
    effect(() => {
      this.settingService
        .settings()
        .forEach((setting) => this.addControl(setting));
    });
  }

  public get adminSettings(): LpSetting[] {
    return this.settingService.settings().filter((setting) => setting.isAdmin);
  }

  public get userSettings(): LpSetting[] {
    return this.settingService.settings().filter((setting) => !setting.isAdmin);
  }

  public addSetting() {}

  public async save(): Promise<void> {
    const result = await this.settingService.saveSettings(this.formGroup.value);
    if (result.success) {
      this.toaster.add({
        title: 'Success',
        message: 'Settings saved',
        severity: 'success',
      });
    } else {
      this.toaster.add({
        title: 'Error',
        message: result.error?.message || 'Unknown Error',
        severity: 'error',
      });
    }
  }

  private addControl(setting: LpSetting): void {
    switch (setting.dataType) {
      case 'boolean':
        this.addBoolean(setting);
        break;
      case 'string':
        this.addString(setting);
        break;
      case 'number':
        this.addNumber(setting);
    }
  }

  private addBoolean(setting: LpSetting): void {
    const value = setting.value === 'true' ? true : false;

    this.formGroup.addControl(setting.name, this.fb.control(value));
  }

  private addString(setting: LpSetting): void {}

  private addNumber(setting: LpSetting): void {}
}
