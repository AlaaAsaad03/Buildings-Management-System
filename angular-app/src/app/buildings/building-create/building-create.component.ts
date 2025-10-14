import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BuildingService } from '../building.service';
import { ComplexService } from '../../complexes/complex.service';

@Component({
  selector: 'app-building-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './building-create.component.html',
  styleUrl: './building-create.component.css'
})

export class BuildingCreateComponent {
  building = {
    name: '',
    address: '',
    complex_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  }
  complexes: any[] = [];
  errorMessage = '';
  successMessage = '';


  constructor(
    private buildingService: BuildingService,
    private complexService: ComplexService,
    private router: Router) { }

  ngOnInit() {
    this.loadComplexes();
  }

  loadComplexes(): void {
    this.complexService.getComplexes().subscribe({
      next: (response) => {
        this.complexes = response;
      },
      error: (error) => {
        console.error('Error loading complexes:', error);
      }
    })
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    this.buildingService.createBuilding(this.building).subscribe({
      next: (response) => {
        this.successMessage = 'Building and admin created successfully!';
        setTimeout(() => {
          this.router.navigate(['/buildings']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'An error occurred while creating the building.';
      }
    })
  }

  goBack(): void {
    this.router.navigate(['/buildings']);
  }


}
