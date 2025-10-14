import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ComplexService } from '../complex.service';


@Component({
  selector: 'app-complex-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './complex-list.component.html',
  styleUrl: './complex-list.component.css'
})

export class ComplexListComponent {
  complexes: any[] = [];


  constructor(
    private complexService: ComplexService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadComplexes();
  }

  loadComplexes(): void {
    this.complexService.getComplexes().subscribe({
      next: (response) => {
        this.complexes = response;
      },
      error: (error) => {
        console.error('Error fetching complexes:', error);
      }
    })
  }
  goToCreate(): void {
    this.router.navigate(['/complexes/create']);
  }
  goBack(): void {
    this.router.navigate(['/admins']);
  }
}
