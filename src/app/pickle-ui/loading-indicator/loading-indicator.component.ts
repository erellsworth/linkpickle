import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faLink, faMoon, faOtter } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './loading-indicator.component.html',
  styleUrl: './loading-indicator.component.scss'
})
export class LoadingIndicatorComponent {

  @Input() icon: IconDefinition = faLink;

}
