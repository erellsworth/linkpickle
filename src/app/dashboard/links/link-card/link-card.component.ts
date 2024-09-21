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
import { LinkService } from '../../../services/link.service';
import { ToasterService } from '../../../services/toaster.service';
import { UserService } from '../../../services/user.service';

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

  constructor(
    private linkService: LinkService,
    private modalService: ModalService,
    private toasterService: ToasterService,
    private userService: UserService
  ) {}

  public get isEditable(): boolean {
    return this.link.UserId === this.userService.user().id;
  }

  public get userName(): string {
    if (!this.link.id) {
      return 'You';
    }
    return this.isEditable ? 'You' : this.link?.User?.userName || 'Unknown';
  }

  public showEditor(): void {
    this.modalService.show({
      componant: LinkPicklerComponent,
      inputs: {
        link: this.link,
      },
    });
  }

  public confirmDelete(): void {
    this.modalService.confirm({
      message: 'Delete this link?',
      onConfirm: () => {
        this.modalService.close();
        this.delete();
      },
    });
  }

  private async delete(): Promise<void> {
    const result = await this.linkService.deleteLink(this.link.id);

    if (result.success) {
      this.toasterService.add({
        severity: 'success',
        title: 'Success!',
        message: 'Link deleted',
      });
    } else {
      this.toasterService.add({
        severity: 'error',
        title: 'Error!',
        message: result.error?.message || 'Something broke',
      });
    }
  }
}
