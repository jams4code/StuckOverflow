import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { UserListComponent } from './components/userlist/userlist.component';

import { RestrictedComponent } from './components/restricted/restricted.component';
import { UnknownComponent } from './components/unknown/unknown.component';
import { AuthGuard } from './components/services/auth.guard';
import { Role } from './components/models/user';
import { SignupComponent } from './components/signup/signup.component';
import { TagListComponent } from './components/taglist/taglist.component';
import { PostListComponent } from './components/postlist/postlist.component';
import { LoginComponent } from './components/login/login.component';
import { PostComponent } from './components/post/post.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { PostListTagComponent } from './post-list-tag/post-list-tag.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
  { path: 'admin', component: AdminPanelComponent},
  { path: 'login', component: LoginComponent},
  { path: 'tags', component: TagListComponent},
  { path: 'posts', component: PostListComponent},
  { path: 'questions/ask/:id', component: PostFormComponent},
  { path: 'posts/:id', component: PostComponent},
  { path: 'tags/posts/tag/:id', component: PostListTagComponent},
  { path: 'signup', component: SignupComponent },
  { path: 'restricted', component: RestrictedComponent },
  { path: '**', component: UnknownComponent },
  

  
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
