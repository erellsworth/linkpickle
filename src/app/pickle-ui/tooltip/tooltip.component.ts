import { Component, Input } from '@angular/core';
import { Position, Severity } from '../../interfaces/misc.types';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {

  @Input({ required: true }) message!: string;
  @Input() visible = false;
  @Input() severity: Severity = 'info';
  @Input() position: Position = 'top-right';
}
