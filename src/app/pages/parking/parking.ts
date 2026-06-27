import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-parking',
  imports: [DatePipe, FormsModule, Navbar],
  templateUrl: './parking.html',
  styleUrl: './parking.css',
})
export class Parking implements OnInit {
  spaces = signal<any[]>([]);
  vehicles = signal<any[]>([]);
  parkedVehicles = signal<any[]>([]);
  loading = signal(true);

  // Entry form
  entryVehicleId = signal<number | null>(null);
  entrySpaceId = signal<number | null>(null);
  entryError = signal('');
  entrySuccess = signal('');

  // Exit form
  exitVehicleId = signal<number | null>(null);
  exitError = signal('');
  exitSuccess = signal('');

  constructor(protected auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    this.api.getSpaces().subscribe({
      next: (res) => this.spaces.set(res.spaces),
    });

    this.api.getVehicles().subscribe({
      next: (res) => this.vehicles.set(res.vehicles),
    });

    this.api.getHistory({ from: '2000-01-01' }).subscribe({
      next: (res) => {
        this.parkedVehicles.set(res.history.filter((h: any) => !h.exit_time));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  get freeSpaces() {
    return this.spaces().filter(s => s.status === 'libre');
  }

  registerEntry() {
    this.entryError.set('');
    this.entrySuccess.set('');

    if (!this.entryVehicleId()) {
      this.entryError.set('Seleccioná un vehículo');
      return;
    }

    this.api.parkingEntry(this.entryVehicleId()!, this.entrySpaceId() ?? undefined).subscribe({
      next: (res) => {
        this.entrySuccess.set(`Entrada registrada — Espacio ${res.entry.space.number}`);
        this.entryVehicleId.set(null);
        this.entrySpaceId.set(null);
        this.loadData();
      },
      error: (err) => {
        this.entryError.set(err.error?.error || 'Error al registrar entrada');
      },
    });
  }

  registerExit() {
    this.exitError.set('');
    this.exitSuccess.set('');

    if (!this.exitVehicleId()) {
      this.exitError.set('Seleccioná un vehículo');
      return;
    }

    this.api.parkingExit(this.exitVehicleId()!).subscribe({
      next: (res) => {
        this.exitSuccess.set(res.message);
        this.exitVehicleId.set(null);
        this.loadData();
      },
      error: (err) => {
        this.exitError.set(err.error?.error || 'Error al registrar salida');
      },
    });
  }

}
