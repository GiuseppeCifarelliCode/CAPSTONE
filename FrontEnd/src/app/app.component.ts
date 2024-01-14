import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'EvenMT';
  isNavbarFixed = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isNavbarFixed = offset > 25; // Puoi regolare questo valore in base a quando vuoi che la navbar diventi fissa
  }
}
