import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-spaces',
  imports: [Navbar],
  templateUrl: './spaces.html',
  styleUrl: './spaces.css',
})
export class Spaces implements OnInit {
  spaces = signal<any[]>([]);
  loading = signal(true);
  selected = signal<any>(null);

  constructor(protected auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.loadSpaces();
  }

  loadSpaces() {
    this.loading.set(true);
    this.api.getSpaces().subscribe({
      next: (res) => {
        this.spaces.set(res.spaces);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  get occupied() {
    return this.spaces().filter(s => s.status === 'ocupado').length;
  }

  get free() {
    return this.spaces().filter(s => s.status === 'libre').length;
  }

  select(space: any) {
    this.selected.set(this.selected()?.id === space.id ? null : space);
  }

}
