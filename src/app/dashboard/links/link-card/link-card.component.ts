import { Component, Input } from '@angular/core';
import { LpLink } from '../../../../../api/interfaces/link';

@Component({
  selector: 'app-link-card',
  standalone: true,
  imports: [],
  templateUrl: './link-card.component.html',
  styleUrl: './link-card.component.scss'
})
export class LinkCardComponent {
  @Input({ required: true }) link!: LpLink; 
}
