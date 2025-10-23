import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})

export class LayoutComponent {
  @Input() title: string = 'Dashboard';
  @Input() subtitle?: string;

  currentUser: any;
  isSuperAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.isSuperAdmin = this.authService.isSuperAdmin();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
