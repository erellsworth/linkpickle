import { JsonPipe, NgComponentOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { LinkSearchComponent } from '../../dashboard/components/link-search/link-search.component';
import { PickleModalStyles } from '../../interfaces/modal.interface';
import { faCircleXmark, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    FontAwesomeModule,
    JsonPipe,
    LinkSearchComponent,
    NgComponentOutlet,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  public closeIcon = faCircleXmark;

  constructor(private modalService: ModalService) {}

  public get component() {
    return this.modalService.modal().componant;
  }

  public get inputs() {
    return this.modalService.modal().inputs || {};
  }

  public get styles() {
    const styles: PickleModalStyles = {};
    const { height, width } = this.modalService.modal();
    if (height) {
      styles.height = height;
    }

    if (width) {
      styles.width = width;
    }
    return styles;
  }

  public close(): void {
    this.modalService.close();
  }
}
