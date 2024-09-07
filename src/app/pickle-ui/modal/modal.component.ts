import { NgComponentOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { LinkSearchComponent } from '../../dashboard/components/link-search/link-search.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgComponentOutlet, LinkSearchComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  constructor(private modalService: ModalService) {}

  public get component() {
    return this.modalService.component();
  }
}
