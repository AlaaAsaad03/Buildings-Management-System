import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ComplexService } from '../complex.service';
import { LayoutComponent } from '../../shared/layout/layout.component';

@Component({
  selector: 'app-complex-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    LayoutComponent
  ],
  templateUrl: './complex-create.component.html',
  styleUrls: ['./complex-create.component.css']
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
  };

  errorMessage = '';
  showCredentials = false;
  createdAdminEmail = '';
  createdAdminPassword = '';

  constructor(
    private complexService: ComplexService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.errorMessage = '';

    this.complexService.createComplex(this.complex).subscribe({
      next: (response) => {
        // Show credentials modal
        this.createdAdminEmail = response.admin_email;
        this.createdAdminPassword = response.admin_password;
        this.showCredentials = true;
      },
      error: (error) => {
        this.errorMessage = error.error.error || 'Failed to create complex';
      }
    });
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }

  goToComplexes(): void {
    this.router.navigate(['/complexes']);
  }
}