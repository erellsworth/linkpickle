import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  @Input() cancelText = 'No';
  @Input() confirmText = 'Yes';
  @Input() message = 'Are you sure you want to do that?';

  @Input() onConfirm = () => {};
  @Input() onCancel = () => {};
}
