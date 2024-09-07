import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent } from './pickle-ui/toaster/toaster.component';
import { ModalComponent } from './pickle-ui/modal/modal.component';

@Component({
  selector: 'link-pickle',
  standalone: true,
  imports: [ModalComponent, RouterOutlet, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
