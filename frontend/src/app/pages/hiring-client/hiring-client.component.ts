import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Requirement } from '../../services/api.service';

@Component({
  selector: 'app-hiring-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hiring-client.component.html',
  styleUrl: './hiring-client.component.css'
})
export class HiringClientComponent {
  newRequirement: Requirement = {
    name: '',
    description: '',
    workers_required: 1,
    start_date: ''
  };

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private apiService: ApiService) { }

  onSubmit() {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.apiService.createRequirement(this.newRequirement).subscribe({
      next: (res) => {
        this.successMessage = 'Requirement published successfully!';
        this.isSubmitting = false;
        // Reset form
        this.newRequirement = { name: '', description: '', workers_required: 1, start_date: '' };
      },
      error: (err) => {
        this.errorMessage = 'Failed to publish requirement. Please try again.';
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }
}
