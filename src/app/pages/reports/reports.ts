import { Component, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-reports',
  imports: [DatePipe, DecimalPipe, FormsModule, RouterLink],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit {
  report = signal<any>(null);
  loading = signal(true);

  from = signal(this.todayStr());
  to = signal('');

  constructor(protected auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  private todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  load() {
    this.loading.set(true);
    this.api.getShiftReport(this.from() || undefined, this.to() || undefined).subscribe({
      next: (res) => {
        this.report.set(res.report);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  byTypeEntries() {
    const bt = this.report()?.by_type ?? {};
    return Object.entries(bt) as [string, { entries: number; exits: number; revenue: number }][];
  }

  logout() {
    this.auth.logout();
  }
}
