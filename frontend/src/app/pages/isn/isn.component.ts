import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Requirement } from '../../services/api.service';

@Component({
  selector: 'app-isn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './isn.component.html',
  styleUrl: './isn.component.css'
})
export class IsnComponent implements OnInit {
  requirements: Requirement[] = [];
  selectedRequirement: Requirement | null = null;
  submissions: any[] = [];

  isValidating = false;
  activeTab = 'details'; // 'details' | 'submissions'

  // Mock Contractors for selection
  contractorsList = [
    { id: 1, name: 'Alpha Builders Inc' },
    { id: 2, name: 'Beta Constructors' },
    { id: 3, name: 'Gamma Electrical' }
  ];
  selectedContractors: number[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadRequirements();
  }

  loadRequirements() {
    this.apiService.getRequirements().subscribe(data => {
      this.requirements = data;
      if (this.requirements.length > 0 && !this.selectedRequirement) {
        this.selectRequirement(this.requirements[0]);
      }
    });
  }

  selectRequirement(req: Requirement) {
    this.selectedRequirement = req;
    this.activeTab = 'details';
    this.selectedContractors = [];
    this.loadSubmissions(req.id!);
  }

  loadSubmissions(id: number) {
    this.apiService.getSubmissions(id).subscribe(data => {
      this.submissions = data;
    });
  }

  validateRequirement() {
    if (!this.selectedRequirement?.id) return;

    this.isValidating = true;
    this.apiService.validateRequirementAi(this.selectedRequirement.id).subscribe({
      next: (req) => {
        this.selectedRequirement = req;
        // Update list
        const idx = this.requirements.findIndex(r => r.id === req.id);
        if (idx !== -1) {
          this.requirements[idx] = req;
        }
        this.isValidating = false;
      },
      error: (err) => {
        console.error(err);
        this.isValidating = false;
      }
    });
  }

  toggleContractorSelection(id: number) {
    const index = this.selectedContractors.indexOf(id);
    if (index === -1) {
      this.selectedContractors.push(id);
    } else {
      this.selectedContractors.splice(index, 1);
    }
  }

  forwardToContractors() {
    if (this.selectedContractors.length === 0) return;
    alert(`Requirement forwarded to ${this.selectedContractors.length} contractors!`);
  }
}
