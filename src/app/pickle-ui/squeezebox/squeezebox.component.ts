import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-squeezebox',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './squeezebox.component.html',
  styleUrl: './squeezebox.component.scss',
})
export class SqueezeboxComponent {
  @Input() collapsed = true;

  public icons = {
    up: faChevronUp,
    down: faChevronDown,
  };

  public get icon(): IconDefinition {
    return this.collapsed ? this.icons.down : this.icons.up;
  }

  public toggle(state?: boolean): void {
    if (typeof state === 'undefined') {
      this.collapsed = !this.collapsed;
    } else {
      this.collapsed = state;
    }
  }
}
