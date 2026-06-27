import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, RouterLink],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  totalSpaces = signal(0);
  newTotalSpaces = signal('');
  spacesError = signal('');
  spacesSuccess = signal('');
  savingSpaces = signal(false);

  tariffs = signal<any[]>([]);
  editingTariffId = signal<number | null>(null);
  editRate = signal('');
  editMinutes = signal('');
  tariffError = signal('');
  savingTariff = signal(false);

  loading = signal(true);

  constructor(protected auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.api.getSettings().subscribe({
      next: (res) => {
        this.totalSpaces.set(res.settings.total_spaces);
        this.newTotalSpaces.set(String(res.settings.total_spaces));
      },
    });

    this.api.getTariffs().subscribe({
      next: (res) => {
        this.tariffs.set(res.tariffs);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  saveSpaces() {
    const val = parseInt(this.newTotalSpaces());
    if (isNaN(val) || val < 1) {
      this.spacesError.set('Debe ser un número entero positivo');
      return;
    }
    this.spacesError.set('');
    this.spacesSuccess.set('');
    this.savingSpaces.set(true);

    this.api.updateSettings(val).subscribe({
      next: (res) => {
        this.totalSpaces.set(res.settings.total_spaces);
        this.spacesSuccess.set('Guardado correctamente');
        this.savingSpaces.set(false);
      },
      error: (err) => {
        this.spacesError.set(err.error?.error ?? 'Error al actualizar');
        this.savingSpaces.set(false);
      },
    });
  }

  startEditTariff(t: any) {
    this.editingTariffId.set(t.id);
    this.editRate.set(String(t.rate_per_block));
    this.editMinutes.set(String(t.block_minutes));
    this.tariffError.set('');
  }

  cancelEditTariff() {
    this.editingTariffId.set(null);
    this.tariffError.set('');
  }

  saveTariff(id: number) {
    const rate = parseFloat(this.editRate());
    const minutes = parseInt(this.editMinutes());

    if (isNaN(rate) || rate <= 0) {
      this.tariffError.set('La tarifa debe ser un número positivo');
      return;
    }
    if (isNaN(minutes) || minutes < 1) {
      this.tariffError.set('Los minutos deben ser un entero positivo');
      return;
    }

    this.savingTariff.set(true);
    this.tariffError.set('');

    this.api.updateTariff(id, rate, minutes).subscribe({
      next: (res) => {
        this.tariffs.update(list => list.map(t => t.id === id ? res.tariff : t));
        this.editingTariffId.set(null);
        this.savingTariff.set(false);
      },
      error: (err) => {
        this.tariffError.set(err.error?.error ?? 'Error al guardar');
        this.savingTariff.set(false);
      },
    });
  }

  logout() {
    this.auth.logout();
  }
}
