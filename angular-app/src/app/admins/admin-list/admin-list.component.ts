import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminService } from '../admin.service';
import { AuthService } from '../../auth/auth.service';
import { LayoutComponent } from '../../shared/layout/layout.component';

@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    LayoutComponent
  ],
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css']
})
export class AdminListComponent implements OnInit {
  admins: any[] = [];
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  isSuperAdmin = false;
  displayedColumns: string[] = ['name', 'role', 'status', 'phone'];

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isSuperAdmin = this.authService.isSuperAdmin();
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.adminService.getAdmins(this.searchTerm, this.currentPage).subscribe({
      next: (response) => {
        this.admins = response.admins;
        this.totalPages = response.pages;
      },
      error: (error) => {
        console.error('Error loading admins:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadAdmins();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadAdmins();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadAdmins();
    }
  }

  getRoleBadgeClass(role: string): string {
    if (role === 'Super Admin') return 'super-admin';
    if (role === 'Complex Admin') return 'complex-admin';
    if (role === 'Building Admin') return 'building-admin';
    return '';
  }

  goToCreate(): void {
    this.router.navigate(['/admins/create']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


}
