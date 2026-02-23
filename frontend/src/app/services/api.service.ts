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

    // --- Hiring Client ---
    createRequirement(req: Requirement): Observable<Requirement> {
        return this.http.post<Requirement>(`${this.baseUrl}/hc/requirements/`, req);
    }

    getRequirements(): Observable<Requirement[]> {
        return this.http.get<Requirement[]>(`${this.baseUrl}/hc/requirements/`);
    }

    // --- ISN ---
    validateRequirementAi(reqId: number): Observable<Requirement> {
        return this.http.post<Requirement>(`${this.baseUrl}/isn/requirements/${reqId}/validate`, {});
    }

    getSubmissions(reqId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/isn/submissions/${reqId}`);
    }

    // --- Contractor ---
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
