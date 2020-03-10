import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { UserListComponent } from './components/userlist/userlist.component';
import { UnknownComponent } from './components/unknown/unknown.component';
import { RestrictedComponent } from './components/restricted/restricted.component';
import { SharedModule } from './common/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupComponent } from './components/signup/signup.component';
import { SetFocusDirective } from './components/directives/setfocus.directive';
import { TagListComponent } from './components/taglist/taglist.component';
import { PostListComponent } from './components/postlist/postlist.component';
import { LoaderComponent } from './components/loader/loader.component';
import { FooterComponent } from './components/footer/footer.component';
import { PostComponent } from './components/post/post.component';
import { PostItemComponent } from './components/post-item/post-item.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { TagContainerComponent } from './components/tag-container/tag-container.component';
import { TagItemComponent } from './components/tag-item/tag-item.component';
import { SearchComboboxComponent } from './components/search-combobox/search-combobox.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NbThousandSuffixesPipe } from './thousand-suffixes-pipes/nb-thousand-suffixes.pipe';
import { PostListItemComponent } from './components/post-list-item/post-list-item.component';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { ReplyComponent } from './components/reply/reply.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
import { UserDialogBoxComponent } from './components/user-dialog-box/user-dialog-box.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { SearchPipe } from './search.pipe';
import { PostListTagComponent } from './post-list-tag/post-list-tag.component';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent,
    SetFocusDirective,
    UserListComponent,
    UnknownComponent,
    RestrictedComponent,
    SignupComponent,
    TagListComponent,
    PostListComponent,
    LoaderComponent,
    FooterComponent,
    PostComponent,
    PostItemComponent,
    PostFormComponent,
    TagContainerComponent,
    TagItemComponent,
    SearchComboboxComponent,
    NbThousandSuffixesPipe,
    PostListItemComponent,
    AddCommentComponent,
    ReplyComponent,
    AdminPanelComponent,
    DialogBoxComponent,
    UserDialogBoxComponent,
    UserEditComponent,
    SearchPipe,
    PostListTagComponent,

    
    
  ],
  entryComponents: [PostListComponent, PostItemComponent,AddCommentComponent, DialogBoxComponent, UserDialogBoxComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutes,
    BrowserAnimationsModule,
    SharedModule,
    FontAwesomeModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
