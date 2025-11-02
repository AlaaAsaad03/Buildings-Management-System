
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ComplexService } from '../complex.service';
import { BuildingService } from '../../buildings/building.service';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-complex-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    LayoutComponent,
    MatMenuModule
  ],
  templateUrl: './complex-detail.component.html',
  styleUrls: ['./complex-detail.component.css']
})

export class ComplexDetailComponent implements OnInit {
  complex: any = null;
  buildings: any[] = [];
  complexId!: number;
  canCreateBuilding: boolean = false;
  canDeleteBuilding: boolean = false;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private complexService: ComplexService,
    private buildingService: BuildingService
  ) { }

  ngOnInit(): void {
    this.complexId = Number(this.route.snapshot.paramMap.get('id'));
    this.canCreateBuilding = this.authService.can('create:building');
    this.canDeleteBuilding = this.authService.can('delete:building');
    this.loadComplex();
    this.loadBuildings();
  }

  loadComplex(): void {
    this.complexService.getComplexes().subscribe({
      next: (response) => {
        this.complex = response.find((c: any) => c.id === this.complexId);
      }
    });
  }

  loadBuildings(): void {
    this.buildingService.getBuildings(this.complexId).subscribe({
      next: (response) => {
        this.buildings = response;
      }
    });
  }

  deleteBuilding(buildingId: number): void {
    if (confirm('Are you sure you want to delete this building?')) {
      this.buildingService.deleteBuilding(buildingId).subscribe({
        next: () => {
          this.loadBuildings();
        },
        error: (error) => {
          alert('Error deleting building');
        }
      });
    }
  }
}