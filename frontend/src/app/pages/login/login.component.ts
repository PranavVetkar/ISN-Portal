import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  selectedRole: string = 'hc'; // 'hc', 'safeworks', 'contractor'
  email = '';
  password = '';
  errorMessage = '';
  isLoggingIn = false;

  roles = [
    { id: 'hc', name: 'Hiring Client' },
    { id: 'safeworks', name: 'Safeworks User' },
    { id: 'contractor', name: 'Contractor' }
  ];

  constructor(private router: Router, private apiService: ApiService) { }

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = "Please enter both email and password.";
      return;
    }

    this.isLoggingIn = true;
    this.errorMessage = '';

    this.apiService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        // Assume backend returns: id, email, role, name
        this.isLoggingIn = false;

        // We override the role with what the DB returns,
        // or ensure it matches the selected role if we want to enforce it.
        // For simplicity, we just use the role from the backend.
        const userRole = res.role;

        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userId', res.id.toString());
        localStorage.setItem('userName', res.name);

        this.router.navigate(['/dashboard', userRole]);
      },
      error: (err) => {
        this.isLoggingIn = false;
        this.errorMessage = err.error?.detail || "Login failed. Check credentials.";
      }
    });

  }
}
