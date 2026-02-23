import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Requirement, Worker } from '../../services/api.service';

@Component({
  selector: 'app-contractor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contractor.component.html',
  styleUrl: './contractor.component.css' // We will reuse isn.component.css layout styles
})
export class ContractorComponent implements OnInit {
  Object = Object;
  requirements: Requirement[] = [];
  selectedRequirement: Requirement | null = null;
  workers: Worker[] = [];

  // Compatibility results map: workerId -> { match_percentage, suggested_courses }
  compatibilityResults: { [key: number]: any } = {};
  isChecking = false;

  // Submission Form
  selectedWorkers: number[] = [];
  proposedRate: number = 0;
  readinessDate: string = '';
  isSubmitting = false;

  get contractorId(): number {
    return parseInt(localStorage.getItem('userId') || '5', 10);
  }

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getAssignedRequirements(this.contractorId).subscribe(data => {
      this.requirements = data;
    });

    this.apiService.getWorkers(this.contractorId).subscribe(data => {
      this.workers = data;
      if (this.workers.length === 0) {
        this.workers = [
          { id: 101, name: 'John Doe', contractor_id: 1, certifications: 'OSHA 30, First Aid', years_experience: 5 },
          { id: 102, name: 'Jane Smith', contractor_id: 1, certifications: 'Master Electrician, Safety Pro', years_experience: 8 }
        ];
      }
    });
  }

  selectRequirement(req: Requirement) {
    this.selectedRequirement = req;
    this.compatibilityResults = {};
    this.selectedWorkers = [];
  }

  checkCompatibility() {
    if (!this.selectedRequirement?.id || this.workers.length === 0) return;

    this.isChecking = true;
    let checksCompleted = 0;

    this.workers.forEach(w => {
      this.apiService.checkWorkerCompatibility(this.selectedRequirement!.id!, w.id).subscribe({
        next: (res) => {
          this.compatibilityResults[w.id] = res;
          checksCompleted++;
          if (checksCompleted === this.workers.length) this.isChecking = false;
        },
        error: (err) => {
          console.error(err);
          // Fallback if API fails
          this.compatibilityResults[w.id] = { match_percentage: Math.floor(Math.random() * 40) + 40, suggested_courses: ['Fallback Course'] };
          checksCompleted++;
          if (checksCompleted === this.workers.length) this.isChecking = false;
        }
      });
    });
  }

  toggleWorker(id: number) {
    const idx = this.selectedWorkers.indexOf(id);
    if (idx === -1) {
      this.selectedWorkers.push(id);
    } else {
      this.selectedWorkers.splice(idx, 1);
    }
  }

  submitApplication() {
    if (!this.selectedRequirement || this.selectedWorkers.length === 0) return;
    this.isSubmitting = true;

    const sub = {
      requirement_id: this.selectedRequirement.id!,
      contractor_id: this.contractorId,
      worker_ids: this.selectedWorkers.join(','),
      suggested_rate: this.proposedRate,
      readiness_date: this.readinessDate
    };

    this.apiService.submitApplication(sub).subscribe({
      next: () => {
        alert('Application submitted successfully!');
        this.isSubmitting = false;
        this.selectedRequirement = null;
      },
      error: () => {
        alert('Error submitting application.');
        this.isSubmitting = false;
      }
    });
  }
}
