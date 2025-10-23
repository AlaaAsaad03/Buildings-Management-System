import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth/auth.service';
import { AdminService } from '../admins/admin.service';
import { ComplexService } from '../complexes/complex.service';
import { BuildingService } from '../buildings/building.service';
import { LayoutComponent } from '../shared/layout/layout.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    LayoutComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  isSuperAdmin = false;

  // Stats
  adminCount = 0;
  complexCount = 0;
  buildingCount = 0;


  // Progress tracking
  hasComplexes = false;
  hasBuildings = false;
  hasMultipleAdmins = false;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private complexService: ComplexService,
    private buildingService: BuildingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('Current user:', this.currentUser);

    this.isSuperAdmin = this.authService.isSuperAdmin();
    console.log('Is super admin:', this.isSuperAdmin);

    this.loadStats();
  }


  loadStats(): void {
    this.adminService.getAdmins('', 1, 100).subscribe({
      next: (response) => {
        this.adminCount = response.total;
        this.hasMultipleAdmins = response.total > 1;
      },
      error: (err) => console.error('Admin load error:', err)
    });

    this.complexService.getComplexes().subscribe({
      next: (response) => {
        this.complexCount = response.length;
        this.hasComplexes = response.length > 0;
      },
      error: (err) => console.error('Complex load error:', err)
    });

    this.buildingService.getBuildings().subscribe({
      next: (response) => {
        this.buildingCount = response.length;
        this.hasBuildings = response.length > 0;
      },
      error: (err) => console.error('Building load error:', err)
    });
  }


  // Completion percentage
  get completionPercentage(): number {
    let completed = 1; // Account is always created
    const totalSteps = 4;

    if (this.hasComplexes) completed++;
    if (this.hasBuildings) completed++;
    if (this.hasMultipleAdmins) completed++;

    return Math.round((completed / totalSteps) * 100);
  }

  // Check if system setup is complete
  get isFullySetup(): boolean {
    return this.hasComplexes && this.hasBuildings && this.hasMultipleAdmins;
  }
}
