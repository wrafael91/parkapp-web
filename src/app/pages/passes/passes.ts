import { Component, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-passes',
  imports: [DatePipe, DecimalPipe, FormsModule, Navbar],
  templateUrl: './passes.html',
  styleUrl: './passes.css',
})
export class Passes implements OnInit {
  passes = signal<any[]>([]);
  vehicles = signal<any[]>([]);
  loading = signal(true);
  showForm = signal(false);
  saving = signal(false);
  errorMsg = signal('');

  form = {
    vehicle_id: '',
    start_date: '',
    end_date: '',
    amount: '',
  };

  constructor(protected auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.api.getPasses().subscribe({
      next: (res) => {
        this.passes.set(res.passes);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.api.getVehicles().subscribe({
      next: (res) => this.vehicles.set(res.vehicles),
    });
  }

  isActive(pass: any): boolean {
    return new Date(pass.end_date) >= new Date();
  }

  openForm() {
    this.form = { vehicle_id: '', start_date: '', end_date: '', amount: '' };
    this.errorMsg.set('');
    this.showForm.set(true);
  }

  submit() {
    const { vehicle_id, start_date, end_date, amount } = this.form;
    if (!vehicle_id || !start_date || !end_date || !amount) {
      this.errorMsg.set('Todos los campos son requeridos');
      return;
    }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      this.errorMsg.set('El monto debe ser un número positivo');
      return;
    }

    this.saving.set(true);
    this.errorMsg.set('');
    this.api.createPass(+vehicle_id, start_date, end_date, amountNum).subscribe({
      next: (res) => {
        this.passes.update(list => [res.pass, ...list]);
        this.showForm.set(false);
        this.saving.set(false);
      },
      error: (err) => {
        this.errorMsg.set(err.error?.error ?? 'Error al crear la mensualidad');
        this.saving.set(false);
      },
    });
  }

  deletePass(id: number) {
    if (!confirm('¿Eliminar esta mensualidad?')) return;
    this.api.deletePass(id).subscribe({
      next: () => this.passes.update(list => list.filter(p => p.id !== id)),
    });
  }

}
