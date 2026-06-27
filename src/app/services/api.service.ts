import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Spaces
  getSpaces() {
    return this.http.get<{ spaces: any[] }>(`${this.api}/spaces`);
  }

  // Vehicles
  getVehicles() {
    return this.http.get<{ vehicles: any[] }>(`${this.api}/vehicles`);
  }

  createVehicle(plate: string, type: string) {
    return this.http.post<{ vehicle: any }>(`${this.api}/vehicles`, { plate, type });
  }

  // Parking
  parkingEntry(vehicle_id: number, space_id?: number) {
    const body: any = { vehicle_id };
    if (space_id) body.space_id = space_id;
    return this.http.post<{ entry: any }>(`${this.api}/parking/entry`, body);
  }

  parkingExit(vehicle_id: number) {
    return this.http.post<{ exit: any; monthly_pass: boolean; message: string }>(`${this.api}/parking/exit`, { vehicle_id });
  }

  // History
  getHistory(filters?: { from?: string; to?: string; vehicle_type?: string; plate?: string }) {
    let params = new HttpParams();
    if (filters?.from) params = params.set('from', filters.from);
    if (filters?.to) params = params.set('to', filters.to);
    if (filters?.vehicle_type) params = params.set('vehicle_type', filters.vehicle_type);
    if (filters?.plate) params = params.set('plate', filters.plate);
    return this.http.get<{ history: any[]; count: number }>(`${this.api}/history`, { params });
  }

  // Reports
  getShiftReport(from?: string, to?: string) {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<{ report: any }>(`${this.api}/reports/shift`, { params });
  }

  // Tariffs
  getTariffs() {
    return this.http.get<{ tariffs: any[] }>(`${this.api}/tariffs`);
  }

  // Passes
  getPasses() {
    return this.http.get<{ passes: any[] }>(`${this.api}/passes`);
  }

  createPass(vehicle_id: number, start_date: string, end_date: string, amount: number) {
    return this.http.post<{ pass: any }>(`${this.api}/passes`, { vehicle_id, start_date, end_date, amount });
  }

  deletePass(id: number) {
    return this.http.delete<{ message: string }>(`${this.api}/passes/${id}`);
  }

  updateVehiclePlate(id: number, plate: string) {
    return this.http.patch<{ vehicle: any }>(`${this.api}/vehicles/${id}`, { plate });
  }

  // Settings
  getSettings() {
    return this.http.get<{ settings: any }>(`${this.api}/settings`);
  }
}
