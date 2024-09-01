import { Component, Input } from '@angular/core';
import { LpLink } from '../../../../../api/interfaces/link';
import { faJar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-link-card',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, RouterLinkActive],
  templateUrl: './link-card.component.html',
  styleUrl: './link-card.component.scss',
})
export class LinkCardComponent {
  @Input({ required: true }) link!: LpLink;

  public icons = {
    jar: faJar,
  };
}
