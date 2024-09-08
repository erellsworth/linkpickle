import { JsonPipe, NgComponentOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { LinkSearchComponent } from '../../dashboard/components/link-search/link-search.component';
import { PickleModalStyles } from '../../interfaces/modal.interface';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgComponentOutlet, LinkSearchComponent, JsonPipe],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
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
}
