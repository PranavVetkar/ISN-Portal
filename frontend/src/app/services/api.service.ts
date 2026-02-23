import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Requirement {
    id?: number;
    name: string;
    description: string;
    workers_required: number;
    start_date: string;
    ai_validated_description?: string;
}

export interface Worker {
    id: number;
    name: string;
    contractor_id: number;
    certifications: string;
    years_experience: number;
}

export interface Submission {
    id?: number;
    requirement_id: number;
    contractor_id?: number;
    worker_ids: string;
    suggested_rate: number;
    readiness_date: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = 'http://127.0.0.1:8000'; // FastAPI default port

    constructor(private http: HttpClient) { }

    // --- Auth ---
    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/api/login`, { email, password });
    }

    // --- Hiring Client ---
    createRequirement(req: Requirement, hcId: number): Observable<Requirement> {
        // Send hc_id merged into the requirement object
        const payload = { ...req, hc_id: hcId };
        return this.http.post<Requirement>(`${this.baseUrl}/hc/requirements/`, payload);
    }

    getRequirements(hcId: number): Observable<Requirement[]> {
        return this.http.get<Requirement[]>(`${this.baseUrl}/hc/requirements/${hcId}`);
    }

    // --- Safeworks ---
    getAllRequirements(): Observable<Requirement[]> {
        return this.http.get<Requirement[]>(`${this.baseUrl}/safeworks/requirements/`);
    }

    validateRequirementAi(reqId: number): Observable<Requirement> {
        return this.http.post<Requirement>(`${this.baseUrl}/safeworks/requirements/${reqId}/validate`, {});
    }

    forwardRequirement(reqId: number, contractorIds: number[]): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/safeworks/requirements/${reqId}/forward`, { contractor_ids: contractorIds });
    }

    getSubmissions(reqId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/safeworks/submissions/${reqId}`);
    }

    // --- Contractor ---
    getAssignedRequirements(contractorId: number): Observable<Requirement[]> {
        return this.http.get<Requirement[]>(`${this.baseUrl}/contractor/requirements/${contractorId}`);
    }

    getWorkers(contractorId: number): Observable<Worker[]> {
        return this.http.get<Worker[]>(`${this.baseUrl}/contractor/workers/${contractorId}`);
    }

    checkWorkerCompatibility(reqId: number, workerId: number): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/contractor/workers/compatibility?req_id=${reqId}&worker_id=${workerId}`, {});
    }

    submitApplication(sub: Submission): Observable<Submission> {
        return this.http.post<Submission>(`${this.baseUrl}/contractor/submissions`, sub);
    }
}
