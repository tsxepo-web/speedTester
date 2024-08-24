import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpeedTestComponent } from './components/speed-test/speed-test.component';
import { ClientInfoComponent } from './components/client-info/client-info.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SpeedTestComponent, ClientInfoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'speedTester';
}
