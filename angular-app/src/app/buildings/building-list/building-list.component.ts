import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BuildingService } from '../building.service';
import { ComplexService } from '../../complexes/complex.service';
import { LayoutComponent } from '../../shared/layout/layout.component'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-building-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    LayoutComponent
  ],
  templateUrl: './building-list.component.html',
  styleUrls: ['./building-list.component.css']
})

export class BuildingListComponent {
  buildings: any[] = [];
  complexes: any[] = [];
  selectedComplexId: number | null = null;
  canCreateBuilding: boolean = false;
  canDeleteBuilding: boolean = false;
  isBuildingAdmin: boolean = false;
  showComplexFilter: boolean = true;

  constructor(
    public authService: AuthService,
    private buildingService: BuildingService,
    private complexService: ComplexService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.canCreateBuilding = this.authService.can('create_building');
    this.canDeleteBuilding = this.authService.can('delete_building');
    this.showComplexFilter = !this.isBuildingAdmin;
    this.loadComplexes();
    this.loadBuildings();
  }

  loadComplexes(): void {
    this.complexService.getComplexes().subscribe({
      next: (response) => {
        console.log('Complexes loaded:', response); // debug
        this.complexes = response;
      },
      error: (error) => {
        console.error('Error loading complexes:', error);
      }
    });
  }

  loadBuildings(): void {
    // For Building Admin, don't send complex_id filter (backend will filter automatically)
    const complexFilter = this.isBuildingAdmin ? undefined : (this.selectedComplexId || undefined);

    this.buildingService.getBuildings(complexFilter).subscribe({
      next: (response) => {
        this.buildings = response;
      }
    });
  }

  onFilterChange(): void {
    this.loadBuildings();
  }

  deleteBuilding(id: number): void {
    if (confirm('Are you sure you want to delete this building?')) {
      this.buildingService.deleteBuilding(id).subscribe({
        next: () => {
          this.loadBuildings();
        },
        error: (error) => {
          alert('Error deleting building');
          console.error(error);
        }
      })
    }
  }

  gotToCreate(): void {
    this.router.navigate(['/buildings/create']);
  }

  goBack(): void {
    this.router.navigate(['/admins']);
  }

  getComplexName(complexId: number): string {
    const complex = this.complexes.find(c => c.id === complexId);
    return complex ? complex.identity : 'Unknown';
  }

}
