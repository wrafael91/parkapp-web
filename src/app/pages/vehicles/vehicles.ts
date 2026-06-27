import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-vehicles',
  imports: [DatePipe, FormsModule, Navbar],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.css',
})
export class Vehicles implements OnInit {
  vehicles = signal<any[]>([]);
  loading = signal(true);
  showForm = signal(false);

  plate = signal('');
  type = signal('');
  formError = signal('');
  formSuccess = signal('');

  editingId = signal<number | null>(null);
  editPlate = signal('');
  editError = signal('');

  constructor(protected auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.loading.set(true);
    this.api.getVehicles().subscribe({
      next: (res) => {
        this.vehicles.set(res.vehicles);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  toggleForm() {
    this.showForm.update(v => !v);
    this.formError.set('');
    this.formSuccess.set('');
  }

  createVehicle() {
    this.formError.set('');
    this.formSuccess.set('');

    if (!this.plate() || !this.type()) {
      this.formError.set('Placa y tipo son requeridos');
      return;
    }

    this.api.createVehicle(this.plate(), this.type()).subscribe({
      next: (res) => {
        this.formSuccess.set(`Vehículo ${res.vehicle.plate} registrado`);
        this.plate.set('');
        this.type.set('');
        this.loadVehicles();
      },
      error: (err) => {
        this.formError.set(err.error?.error || 'Error al registrar vehículo');
      },
    });
  }

  startEdit(vehicle: any) {
    this.editingId.set(vehicle.id);
    this.editPlate.set(vehicle.plate);
    this.editError.set('');
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editError.set('');
  }

  saveEdit(id: number) {
    const plate = this.editPlate().trim();
    if (!plate) {
      this.editError.set('La placa no puede estar vacía');
      return;
    }
    this.api.updateVehiclePlate(id, plate).subscribe({
      next: (res) => {
        this.vehicles.update(list => list.map(v => v.id === id ? { ...v, plate: res.vehicle.plate } : v));
        this.editingId.set(null);
      },
      error: (err) => this.editError.set(err.error?.error ?? 'Error al actualizar la placa'),
    });
  }

}
