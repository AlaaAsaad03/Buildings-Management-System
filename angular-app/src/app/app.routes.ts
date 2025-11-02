import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AdminListComponent } from './admins/admin-list/admin-list.component';
import { AdminCreateComponent } from './admins/admin-create/admin-create.component';
import { ComplexListComponent } from './complexes/complex-list/complex-list.component';
import { ComplexCreateComponent } from './complexes/complex-create/complex-create.component';
import { BuildingListComponent } from './buildings/building-list/building-list.component';
import { BuildingCreateComponent } from './buildings/building-create/building-create.component';
import { authGuard, superAdminGuard } from './auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ComplexDetailComponent } from './complexes/complex-detail/complex-detail.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admins',
        component: AdminListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admins/create',
        component: AdminCreateComponent,
        canActivate: [authGuard, superAdminGuard]
    },
    {
        path: 'complexes',
        component: ComplexListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'complexes/create',
        component: ComplexCreateComponent,
        canActivate: [authGuard]
    },
    {
        path: 'complexes/:id',
        component: ComplexDetailComponent,
        canActivate: [authGuard]

    },
    {
        path: 'buildings',
        component: BuildingListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'buildings/create',
        component: BuildingCreateComponent,
        canActivate: [authGuard]
    }

];
