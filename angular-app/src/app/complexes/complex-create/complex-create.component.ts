import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'
import { ComplexService } from '../complex.service';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-complex-create',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    LayoutComponent,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './complex-create.component.html',
  styleUrl: './complex-create.component.css'
})
export class ComplexCreateComponent {
  complex = {
    identity: '',
    address: '',
    campaign_start: '',
    campaign_end: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  }
  errorMessage = '';
  successMessage = '';

  constructor(
    private complexService: ComplexService,
    private router: Router) { }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    this.complexService.createComplex(this.complex).subscribe({
      next: (response) => {
        this.successMessage = 'Complex and admin created successfully!';
        setTimeout(() => {
          this.router.navigate(['/complexes']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'An error occurred while creating the complex.';
      }
    })
  }

  goBack(): void {
    this.router.navigate(['/complexes']);
  }
}
