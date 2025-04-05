
import { Component, OnInit } from '@angular/core';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { KeycloakService } from './services/keycloak.service';
import { RouterOutlet } from '@angular/router';
import { ConfigService } from './services/config.service';
import { HttpService } from './services/http.service';
import { ProfesionalService } from './services/helpers/profesional/profesional.service';
import { ConfigProperties } from './bean/config';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';



@Component({
  selector: 'sacyl-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,ToastModule,ProgressBarModule,ProgressSpinnerModule, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'DISPORTO';

  loading = true;

  error?: string;

  constructor(
    public translate: TranslateService,
    public configService: ConfigService,
    public profesionalService: ProfesionalService,
    private keycloakService: KeycloakService,
    private httpClient: HttpService,
    private config: PrimeNG,) {
    this.init();
  }

  ngOnInit() {
    this.translate.setDefaultLang('es');
    this.translateM('es');
  }

  init() {
    this.loadConfig();
    this.loadKeycloak();
  }

  loadConfig() {
    this.httpClient.get<ConfigProperties>('assets/config/app-config.json')
      .subscribe(data => {
        if (data) this.configService.setConfig(data);
        console.log("LoadConfig: ", data);
      });

  }

  loadKeycloak() {
    this.keycloakService.getToken().then((token) => {
      const result = this.configService.setTokenInfo();
      if (!result) this.error = 'error.credentials.no_role';
      //console.log("loadKeycloak: ", token  + " - " + result);
      this.loading = false;
    });
  }

  translateM(lang: string) {
    this.translate.use(lang);
    this.translate.get('primeng').subscribe(res => this.config.setTranslation(res));
  }
}

