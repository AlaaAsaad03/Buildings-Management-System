import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-session-warning-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-icon">
        <mat-icon>schedule</mat-icon>
      </div>
      <h2 mat-dialog-title>Session Expiring Soon</h2>
      <mat-dialog-content>
        <p>Your session will expire in <strong>{{ timeRemaining }}</strong>.</p>
        <p>Click "Stay Logged In" to extend your session, or you'll be logged out automatically.</p>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-stroked-button (click)="onLogout()">
          Logout Now
        </button>
        <button mat-raised-button color="primary" (click)="onStayLoggedIn()">
          Stay Logged In
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      text-align: center;
    }

    .dialog-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
      background: #fef3c7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dialog-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #d97706;
    }

    h2 {
      margin-bottom: 16px;
    }

    mat-dialog-content p {
      margin-bottom: 12px;
      color: #64748b;
    }

    mat-dialog-content strong {
      color: #0f172a;
    }

    mat-dialog-actions {
      justify-content: center;
      gap: 12px;
    }
  `]
})
export class SessionWarningDialogComponent {
  timeRemaining: string = '2 minutes';

  constructor(
    public dialogRef: MatDialogRef<SessionWarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data?.timeRemaining) {
      this.timeRemaining = data.timeRemaining;
    }
  }

  onStayLoggedIn(): void {
    this.dialogRef.close('stay');
  }

  onLogout(): void {
    this.dialogRef.close('logout');
  }
}