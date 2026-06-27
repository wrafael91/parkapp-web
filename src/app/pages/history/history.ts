import { Component, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-history',
  imports: [DatePipe, DecimalPipe, FormsModule, Navbar],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History implements OnInit {
  records = signal<any[]>([]);
  count = signal(0);
  loading = signal(true);

  from = signal('');
  to = signal('');
  vehicle_type = signal('');
  plate = signal('');

  constructor(protected auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    const filters: any = {};
    if (this.from()) filters.from = this.from();
    if (this.to()) filters.to = this.to();
    if (this.vehicle_type()) filters.vehicle_type = this.vehicle_type();
    if (this.plate()) filters.plate = this.plate();

    this.api.getHistory(filters).subscribe({
      next: (res) => {
        this.records.set(res.history);
        this.count.set(res.count);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  clearFilters() {
    this.from.set('');
    this.to.set('');
    this.vehicle_type.set('');
    this.plate.set('');
    this.load();
  }

}
