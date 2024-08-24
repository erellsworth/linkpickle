import { Component } from '@angular/core';
import { PageComponent } from '../../pickle-ui/page/page.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface RecoverForm {
  email: FormControl<string>;
}

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [PageComponent, ReactiveFormsModule],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.scss'
})
export class RecoverComponent {

  public formGroup!: FormGroup<RecoverForm>;

}
