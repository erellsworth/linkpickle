import { Component, HostListener, Input } from '@angular/core';
import { Position, Severity } from '../../interfaces/misc.types';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.showOnHover) {
      this.visible = true;
    }
   }

   @HostListener('mouseleave')
   onMouseLeave() {
     if (this.showOnHover) {
       this.visible = false;
     }
   }
  
  @Input({ required: true }) message!: string;
  @Input() visible = false;
  @Input() severity: Severity = 'info';
  @Input() position: Position = 'top-right';
  @Input() showOnHover = false;
}
