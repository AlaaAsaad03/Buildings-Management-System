import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ComplexService } from '../complex.service';
import { BuildingService } from '../../buildings/building.service';
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

  constructor(
    private complexService: ComplexService,
    private buildingService: BuildingService
  ) { }

  ngOnInit(): void {
    this.loadComplexes();
  }

  loadComplexes(): void {
    this.complexService.getComplexes().subscribe({
      next: (response) => {
        this.complexes = response;
        // Load building counts for each complex
        this.complexes.forEach(complex => {
          this.loadBuildingCount(complex.id);
        });
      },
      error: (error) => {
        console.error('Error loading complexes:', error);
      }
    });
  }

  loadBuildingCount(complexId: number): void {
    this.buildingService.getBuildings(complexId).subscribe({
      next: (response) => {
        this.buildingCounts[complexId] = response.length;
      }
    });
  }

  getBuildingCount(complexId: number): number {
    return this.buildingCounts[complexId] || 0;
  }
}