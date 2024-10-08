import { Component, Input } from '@angular/core';
import { PickleToast } from '../../interfaces/toaster.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faClose, faSkull, faWarning, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-toast-list',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './toast-list.component.html',
  styleUrl: './toast-list.component.scss'
})
export class ToastListComponent {
  @Input({ required: true }) toasts: PickleToast[] = [];

  constructor(private toaster: ToasterService) { }

  public icons: { [key: string]: IconDefinition } = {
    close: faClose,
    success: faCircle,
    error: faSkull,
    warning: faWarning
  };

  public dismiss(id?: number): void {
    if (id) {
      this.toaster.dismiss(id);
    }
  }

  public getIcon(severity: PickleToast['severity']): IconDefinition {
    const key = severity as string;
    return this.icons[key];
  }
}
