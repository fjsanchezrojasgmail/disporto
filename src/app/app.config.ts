import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { KeycloakService } from './services/keycloak.service';
import { routes } from './app.routes';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MessageService } from 'primeng/api';
import { ProfesionalDaoService } from './services/dao/profesional-dao.service';
import { GlobalFeedbackService } from './services/global-feedback.service';
import { ConfigService } from './services/config.service';

// ✅ PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { providePrimeNG } from 'primeng/config';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Lara from '@primeng/themes/lara';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { provideAnimations } from '@angular/platform-browser/animations';



// 🛠️ Factory para cargar archivos de traducción desde `assets/i18n/`
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// 🛠️ Factory para inicializar Keycloak
export function initializeKeycloak(keycloakService: KeycloakService) {
  return () => keycloakService.setConfiguration('disporto/web');
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      CalendarModule,
      InputNumberModule,
      DropdownModule
    ),
    importProvidersFrom(FontAwesomeModule),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule, // ✅ Importamos `HttpClientModule`
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient] // ✅ `HttpClient` está disponible aquí
        }
      })
    ),
    providePrimeNG({
      theme: {
          preset: Lara
      }
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakService],
      multi: true,
    },
    KeycloakService,
    GlobalFeedbackService,
    ConfigService,
    MessageService,
    ProfesionalDaoService,

    // ✅ Importar módulos de PrimeNG necesarios
    ButtonModule,
    TableModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    DialogModule,
    ProgressBarModule,
    InputTextModule,
    DropdownModule,
  ],


};