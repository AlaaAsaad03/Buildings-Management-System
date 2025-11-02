import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ComplexService } from '../complex.service';
import { BuildingService } from '../../buildings/building.service';
import { AuthService } from '../../auth/auth.service';
import { LayoutComponent } from '../../shared/layout/layout.component';

@Component({
  selector: 'app-complex-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    LayoutComponent
  ],
  templateUrl: './complex-list.component.html',
  styleUrls: ['./complex-list.component.css']
})
export class ComplexListComponent implements OnInit {
  complexes: any[] = [];
  buildingCounts: { [key: number]: number } = {};
  currentUserBuilding: any = null;
  isBuildingAdmin = false;

  constructor(
    private complexService: ComplexService,
    private buildingService: BuildingService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isBuildingAdmin = this.authService.hasRole('Building Admin');
    this.loadComplexes();
  }

  loadComplexes(): void {
    this.complexService.getComplexes().subscribe({
      next: (response) => {
        this.complexes = response;

        if (this.isBuildingAdmin) {
          // For Building Admin: First get their building, THEN set count
          this.loadCurrentUserBuilding();
        } else {
          // For Super Admin & Complex Admin: Load counts for each complex
          this.complexes.forEach(complex => {
            this.loadBuildingCount(complex.id);
          });
        }
      },
      error: (error) => {
        console.error('Error loading complexes:', error);
      }
    });
  }

  loadCurrentUserBuilding(): void {
    // Get the building admin's assigned building
    this.buildingService.getBuildings().subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.currentUserBuilding = response[0];
          // Set count ONLY for the complex that contains their building
          this.buildingCounts[this.currentUserBuilding.complex_id] = 1;
        }
      },
      error: (error) => {
        console.error('Error loading user building:', error);
      }
    });
  }

  loadBuildingCount(complexId: number): void {
    // This is ONLY called for Super Admin and Complex Admin
    this.buildingService.getBuildings(complexId).subscribe({
      next: (response) => {
        this.buildingCounts[complexId] = response.length;
      },
      error: (error) => {
        console.error(`Error loading building count for complex ${complexId}:`, error);
        this.buildingCounts[complexId] = 0;
      }
    });
  }

  getBuildingCount(complexId: number): number {
    return this.buildingCounts[complexId] || 0;
  }

  shouldShowBuildingCount(complexId: number): boolean {
    // Check if we have a count for this complex
    return this.buildingCounts.hasOwnProperty(complexId);
  }

  getComplexName(complexId: number): string {
    const complex = this.complexes.find(c => c.id === complexId);
    return complex ? complex.identity : 'Unknown';
  }
}