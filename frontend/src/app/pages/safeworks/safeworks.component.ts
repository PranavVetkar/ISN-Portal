import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Requirement } from '../../services/api.service';

@Component({
  selector: 'app-safeworks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './safeworks.component.html',
  styleUrl: './safeworks.component.css'
})
export class SafeworksComponent implements OnInit {
  requirements: Requirement[] = [];
  selectedRequirement: Requirement | null = null;
  submissions: any[] = [];

  isValidating = false;
  isForwarding = false;
  activeTab = 'details'; // 'details' | 'submissions'

  // Mock Contractors for selection
  contractors = [
    { id: 5, name: 'Apex Construction' },
    { id: 6, name: 'BuildWell Inc.' },
    { id: 7, name: 'City Scaffolders' }
  ];
  selectedContractors: number[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadRequirements();
  }

  loadRequirements() {
    this.apiService.getAllRequirements().subscribe(data => {
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
    if (!this.selectedRequirement?.id || this.selectedContractors.length === 0) return;
    this.isForwarding = true;

    this.apiService.forwardRequirement(this.selectedRequirement.id, this.selectedContractors).subscribe({
      next: () => {
        alert(`Requirement forwarded successfully to ${this.selectedContractors.length} contractors!`);
        this.isForwarding = false;
        this.selectedContractors = [];
      },
      error: (err) => {
        alert('Failed to forward requirement');
        this.isForwarding = false;
      }
    });
  }
}
