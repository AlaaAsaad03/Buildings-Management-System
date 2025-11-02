import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BuildingService } from '../building.service';
import { ComplexService } from '../../complexes/complex.service';
import { LayoutComponent } from '../../shared/layout/layout.component';

@Component({
  selector: 'app-building-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    LayoutComponent
  ],
  templateUrl: './building-create.component.html',
  styleUrls: ['./building-create.component.css']
})
export class BuildingCreateComponent implements OnInit {
  building = {
    name: '',
    address: '',
    complex_id: 0,
    civility: 'Mr',
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  };

  complexes: any[] = [];
  errorMessage = '';
  showCredentials = false;
  createdAdminEmail = '';
  createdAdminPassword = '';

  constructor(
    private buildingService: BuildingService,
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
        console.error('Error loading complexes:', error);
        this.errorMessage = 'Failed to load complexes. Please refresh the page.';
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    // Validation
    if (this.building.complex_id === 0) {
      this.errorMessage = 'Please select a residential complex';
      return;
    }

    if (!this.building.name.trim()) {
      this.errorMessage = 'Building name is required';
      return;
    }

    if (!this.building.first_name.trim() || !this.building.last_name.trim()) {
      this.errorMessage = 'Admin first name and last name are required';
      return;
    }

    if (!this.building.email.trim()) {
      this.errorMessage = 'Admin email is required';
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.building.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    // Submit
    this.buildingService.createBuilding(this.building).subscribe({
      next: (response) => {
        // Show credentials modal
        this.createdAdminEmail = response.admin_email;
        this.createdAdminPassword = response.admin_password;
        this.showCredentials = true;
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to create building. Please try again.';
      }
    });
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('✓ Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('Failed to copy. Please copy manually.');
    });
  }

  goToBuildings(): void {
    this.router.navigate(['/buildings']);
  }
}