import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ProfileService } from './profile.service';
import { AuthService } from '../auth/auth.service';
import { LayoutComponent } from '../shared/layout/layout.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    LayoutComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: any = {
    civility: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: '',
    status: '',
    profile_picture: '',
    created_at: ''
  };

  passwordForm = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  };

  errorMessage = '';
  successMessage = '';
  passwordError = '';
  passwordSuccess = '';
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (response) => {
        this.profile = response;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.errorMessage = 'Failed to load profile';
      }
    });
  }

  onUpdateProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const updateData = {
      civility: this.profile.civility,
      first_name: this.profile.first_name,
      last_name: this.profile.last_name,
      phone: this.profile.phone
    };

    this.profileService.updateProfile(updateData).subscribe({
      next: (response) => {
        this.successMessage = 'Profile updated successfully!';
        this.profile = response;

        // Update stored user in localStorage
        const currentUser = this.authService.getCurrentUser();
        const updatedUser = { ...currentUser, ...response };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to update profile';
      }
    });
  }

  onChangePassword(): void {
    this.passwordError = '';
    this.passwordSuccess = '';

    // Validate passwords match
    if (this.passwordForm.new_password !== this.passwordForm.confirm_password) {
      this.passwordError = 'New passwords do not match';
      return;
    }

    // Validate password length
    if (this.passwordForm.new_password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      return;
    }

    this.profileService.changePassword(
      this.passwordForm.current_password,
      this.passwordForm.new_password
    ).subscribe({
      next: (response) => {
        this.passwordSuccess = 'Password changed successfully!';
        this.passwordForm = {
          current_password: '',
          new_password: '',
          confirm_password: ''
        };
        setTimeout(() => this.passwordSuccess = '', 3000);
      },
      error: (error) => {
        this.passwordError = error.error?.error || 'Failed to change password';
      }
    });
  }

  onProfilePictureChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Invalid file type. Please upload PNG, JPG, JPEG, GIF, or WEBP';
        setTimeout(() => this.errorMessage = '', 3000);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File too large. Maximum size is 5MB';
        setTimeout(() => this.errorMessage = '', 3000);
        return;
      }

      // Show loading indicator (optional)
      this.successMessage = 'Uploading...';

      // Upload to server
      this.profileService.uploadProfilePicture(file).subscribe({
        next: (response) => {
          this.profile.profile_picture = response.profile_picture;
          this.successMessage = 'Profile picture updated successfully!';

          // Update stored user in localStorage
          const updatedUser = { ...this.authService.getCurrentUser(), profile_picture: response.profile_picture };
          this.authService.setCurrentUser(updatedUser);

          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Failed to upload profile picture';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  getInitials(): string {
    return `${this.profile.first_name?.charAt(0) || ''}${this.profile.last_name?.charAt(0) || ''}`;
  }

  onImageError(event: any): void {
    // If image fails to load, hide it and show initials
    event.target.style.display = 'none';
    this.profile.profile_picture = '';
  }
}