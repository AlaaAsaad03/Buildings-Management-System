import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css'
})

export class AdminListComponent implements OnInit {

  admins: any[] = [];
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  perPage = 10;
  isSuperAdmin = false;


  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) { }

  // once when the component is initialized then load the admins
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
        console.error('Error fetching admins:', error);
      }
    })
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

  goToCreate(): void {
    this.router.navigate(['/admins/create']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


}
