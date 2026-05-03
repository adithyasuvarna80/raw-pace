import { Component, signal } from '@angular/core';
import { RouterOutlet ,RouterModule} from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('raw-pace');
}
