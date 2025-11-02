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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    LayoutComponent,
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

  // Quick actions array
  quickActions = [
    { title: 'Create Complex', description: 'Add a new residential complex', icon: 'add_business', color: 'blue', route: '/complexes/create', permission: 'create_complex' },
    { title: 'Create Building', description: 'Add a building to a complex', icon: 'add_home', color: 'green', route: '/buildings/create', permission: 'create_building' },
    { title: 'Create Admin', description: 'Add a new administrator', icon: 'person_add', color: 'purple', route: '/admins/create', permission: 'create_admin' },
    { title: 'View Buildings', description: 'See all buildings you manage', icon: 'visibility', color: 'green', route: '/buildings' }
  ];

  constructor(
    public authService: AuthService,
    private adminService: AdminService,
    private complexService: ComplexService,
    private buildingService: BuildingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isSuperAdmin = this.authService.hasRole('Super Admin');
    this.loadStats();
  }

  loadStats(): void {
    // Load admin count
    this.adminService.getAdmins('', 1, 100).subscribe({
      next: (response) => {
        this.adminCount = response.total;
      }
    });

    // Load complex count
    this.complexService.getComplexes().subscribe({
      next: (response) => {
        this.complexCount = response.length;
        this.hasComplexes = response.length > 0;
      }
    });

    // Load building count
    this.buildingService.getBuildings().subscribe({
      next: (response) => {
        this.buildingCount = response.length;
        this.hasBuildings = response.length > 0;
      }
    });
  }

  get completionPercentage(): number {
    let completed = 1; // Account is always created
    let total = 3; // Account + Complex + Buildings

    if (this.hasComplexes) completed++;
    if (this.hasBuildings) completed++;

    return Math.round((completed / total) * 100);
  }

  get isFullySetup(): boolean {
    // System is fully setup when we have complexes and buildings
    return this.hasComplexes && this.hasBuildings;
  }
}
