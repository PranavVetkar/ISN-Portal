import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  selectedRole: string = 'hc';
  roles = [
    { id: 'hc', name: 'Hiring Client' },
    { id: 'isn', name: 'ISN' },
    { id: 'contractor', name: 'Contractor' }
  ];

  constructor(private router: Router) { }

  onLogin() {
    // In a real app we'd authenticate. Here we simulate and store role.
    localStorage.setItem('userRole', this.selectedRole);
    this.router.navigate(['/dashboard', this.selectedRole]);
  }
}
