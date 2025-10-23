import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../admin.service';
import { LayoutComponent } from '../../shared/layout/layout.component';

@Component({
  selector: 'app-admin-create',
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
  templateUrl: './admin-create.component.html',
  styleUrls: ['./admin-create.component.css']
})
export class AdminCreateComponent {
  admin = {
    civility: 'Mr',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'Complex Admin',
    password: ''
  };

  hidePassword = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.admin.first_name.trim() || !this.admin.last_name.trim()) {
      this.errorMessage = 'First name and last name are required';
      return;
    }

    if (!this.admin.email.trim()) {
      this.errorMessage = 'Email is required';
      return;
    }

    if (!this.admin.password || this.admin.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.adminService.createAdmin(this.admin).subscribe({
      next: (response) => {
        this.successMessage = 'Admin created successfully!';
        setTimeout(() => {
          this.router.navigate(['/admins']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to create admin';
      }
    });
  }
}