import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-create.component.html',
  styleUrl: './admin-create.component.css'
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
  errorMessage = '';
  successMessage = '';



  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.adminService.createAdmin(this.admin).subscribe({
      next: (response) => {
        this.successMessage = 'Admin created successfully!';
        setTimeout(() => {
          this.router.navigate(['/admins']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'An error occurred while creating the admin.';
      }
    })
  }

  goBack(): void {
    this.router.navigate(['/admins']);
  }
}
