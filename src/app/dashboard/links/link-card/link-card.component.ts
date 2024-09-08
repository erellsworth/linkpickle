import { Component, Input } from '@angular/core';
import { LpLink } from '../../../../../api/interfaces/link';
import {
  faEdit,
  faJar,
  faThumbTack,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipComponent } from '../../../pickle-ui/tooltip/tooltip.component';
import { ModalService } from '../../../services/modal.service';
import { LinkSearchComponent } from '../../components/link-search/link-search.component';
import { LinkPicklerComponent } from '../../components/link-pickler/link-pickler.component';

@Component({
  selector: 'app-link-card',
  standalone: true,
  imports: [
    FontAwesomeModule,
    LinkPicklerComponent,
    TooltipComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './link-card.component.html',
  styleUrl: './link-card.component.scss',
})
export class LinkCardComponent {
  @Input({ required: true }) link!: LpLink;

  public icons = {
    delete: faTrash,
    edit: faEdit,
    jar: faJar,
    pinned: faThumbTack,
  };

  constructor(private modalService: ModalService) {}

  public showEditor(): void {
    this.modalService.show({
      componant: LinkPicklerComponent,
      width: '75vw',
      inputs: {
        link: this.link,
      },
    });
  }
}
