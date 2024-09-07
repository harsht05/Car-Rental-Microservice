import { NgModule, OnInit } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomepageComponent } from './homepage/homepage.component';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './services/auth-config';
import { AuthCallbackComponent } from './services/auth-callback.component';
import { CommonModule } from '@angular/common';
import { UserModule } from './modules/user/user.module';
import { SharedModule } from './modules/shared/shared.module';
import { AdminModule } from './modules/admin/admin.module';
import { Event, NavigationEnd, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SessionStorageService } from './services/session-storage.service';



@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomepageComponent,
    AuthCallbackComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    UserModule,  
    SharedModule,
    AdminModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['http://localhost:8080'], 
        sendAccessToken: true
      }
    })
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent],
})
export class AppModule implements OnInit  {
  constructor(private oauthService: OAuthService, private router: Router) {
    if (typeof window !== 'undefined') {
      this.configureOAuth();
    }
  }

  private configureOAuth(): void {
    this.oauthService.configure(authConfig);
    this.oauthService.setStorage(localStorage); 
    this.oauthService.setupAutomaticSilentRefresh(); 
  }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd:', event.url);
      }
    });
  }
}
