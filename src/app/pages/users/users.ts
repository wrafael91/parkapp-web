import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-users',
  imports: [FormsModule, Navbar],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users = signal<any[]>([]);
  loading = signal(true);

  showForm = signal(false);
  username = signal('');
  password = signal('');
  role = signal('operador');
  formError = signal('');
  saving = signal(false);

  constructor(protected auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.api.getUsers().subscribe({
      next: (res) => { this.users.set(res.users); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openForm() {
    this.username.set('');
    this.password.set('');
    this.role.set('operador');
    this.formError.set('');
    this.showForm.set(true);
  }

  cancelForm() {
    this.showForm.set(false);
    this.formError.set('');
  }

  saveUser() {
    const u = this.username().trim();
    const p = this.password().trim();
    if (!u || !p) { this.formError.set('Username y contraseña son requeridos'); return; }

    this.saving.set(true);
    this.formError.set('');

    this.api.createUser(u, p, this.role()).subscribe({
      next: (res) => {
        this.users.update(list => [...list, res.user]);
        this.showForm.set(false);
        this.saving.set(false);
      },
      error: (err) => {
        this.formError.set(err.error?.error ?? 'Error al crear el usuario');
        this.saving.set(false);
      },
    });
  }

  deleteUser(id: number, username: string) {
    if (!confirm(`¿Eliminar el usuario "${username}"?`)) return;
    this.api.deleteUser(id).subscribe({
      next: () => this.users.update(list => list.filter(u => u.id !== id)),
    });
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
