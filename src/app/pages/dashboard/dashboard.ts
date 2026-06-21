import { Component, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  report = signal<any>(null);
  spaces = signal<any[]>([]);
  loading = signal(true);

  constructor(protected auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    this.api.getShiftReport().subscribe({
      next: (res) => this.report.set(res.report),
      error: () => this.report.set(null),
    });

    this.api.getSpaces().subscribe({
      next: (res) => {
        this.spaces.set(res.spaces);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  get occupiedCount(): number {
    return this.spaces().filter(s => s.status === 'ocupado').length;
  }

  get freeCount(): number {
    return this.spaces().filter(s => s.status === 'libre').length;
  }

  get occupancyPercent(): number {
    const total = this.spaces().length;
    if (total === 0) return 0;
    return Math.round((this.occupiedCount / total) * 100);
  }

  logout() {
    this.auth.logout();
  }
}
