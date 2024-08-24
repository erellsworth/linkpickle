import { Component } from '@angular/core';
import { ToasterService } from '../../services/toaster.service';
import { PickleToast } from '../../interfaces/toaster.interface';
import { ToastListComponent } from "../toast-list/toast-list.component";

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [ToastListComponent],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss'
})
export class ToasterComponent {

  constructor(private toaster: ToasterService) { }

  public getToasts(position: PickleToast['position']): PickleToast[] {
    return this.toaster.toasts().filter(toast => toast.position === position);
  }

  public dismissToast(toast: PickleToast): void {
    if (toast.id) {
      this.toaster.dismiss(toast.id);
    }
  }
}
