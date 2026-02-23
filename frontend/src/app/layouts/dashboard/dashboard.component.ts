import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  role: string = 'hc';

  constructor(private router: Router) {
    this.role = localStorage.getItem('userRole') || 'hc';
  }

  logout() {
    localStorage.removeItem('userRole');
    this.router.navigate(['/']);
  }
}
