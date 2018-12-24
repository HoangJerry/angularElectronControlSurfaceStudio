import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { SwitchManagerComponent } from './components/switch-manager/switch-manager.component';
import { ScriptManagerComponent } from './components/script-manager/script-manager.component';
import { ScriptMappingTypeComponent } from './components/script-mapping-type/script-mapping-type.component';
import { ControllerManagerComponent } from './components/controller-manager/controller-manager.component';
import { ControllerMappingTypeComponent } from './components/controller-mapping-type/controller-mapping-type.component';
import { ControllerSliderComponent } from './components/controller-mapping-type/controller-slider/controller-slider.component';
import { ControllerKnobComponent } from './components/controller-mapping-type/controller-knob/controller-knob.component';
import { ControllerButtonComponent } from './components/controller-mapping-type/controller-button/controller-button.component'
import { ControllerPadsComponent } from './components/controller-mapping-type/controller-pads/controller-pads.component';
import { ControllerKeysComponent } from './components/controller-mapping-type/controller-keys/controller-keys.component';
import { MidiKeysComponent } from './components/midi-controller/midi-keys/midi-keys.component';
import { ControllerContainerComponent } from './components/controller-mapping-type/controller-container/controller-container.component';
import { ControllerCrossfaderComponent } from './components/controller-mapping-type/controller-crossfader/controller-crossfader.component';
import { ScriptImportComponent } from './components/script-import/script-import.component';
import { ControllerImportComponent } from './components/controller-import/controller-import.component';
import { ScriptSessionBoxComponent } from './components/script-mapping-type/script-session-box/script-session-box.component';
import { ScriptParameterBankComponent } from './components/script-mapping-type/script-parameter-bank/script-parameter-bank.component';
import { ScriptParameterComponent } from './components/script-mapping-type/script-parameter/script-parameter.component';
import { ScriptModeSelectorComponent } from './components/script-mapping-type/script-mode-selector/script-mode-selector.component';
import { ScriptDrumrackComponent } from './components/script-mapping-type/script-drumrack/script-drumrack.component';
import { ScriptReactionComponent } from './components/script-mapping-type/script-reaction/script-reaction.component';

import { MidiControllerComponent } from './components/midi-controller/midi-controller.component';
import { ControllerMappingsComponent } from './components/controller-mappings/controller-mappings.component';
import { MidiMonitorComponent } from './components/midi-monitor/midi-monitor.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ErrorLogComponent } from './components/error-log/error-log.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { KeysPipe, IconColor, notUndefined, pads, toArray, minMax, toClassCss }   from './pipes/pipes';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
import { jqxKnobComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxknob';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    HeaderComponent,
    SwitchManagerComponent,
    ScriptManagerComponent,
    ScriptMappingTypeComponent,
    ControllerManagerComponent,
    MidiControllerComponent,
    ControllerMappingsComponent,
    MidiMonitorComponent,
    SettingsComponent,
    ErrorLogComponent,
    NotificationsComponent,
    UserComponent,
    KeysPipe, IconColor, pads, notUndefined, toArray, minMax, toClassCss,
    LoginComponent,
    ControllerMappingTypeComponent,
    ControllerSliderComponent,
    ControllerKnobComponent,
    jqxKnobComponent,
    ControllerButtonComponent,
    ControllerPadsComponent,
    ControllerKeysComponent,
    MidiKeysComponent,
    ControllerContainerComponent,
    ControllerCrossfaderComponent,
    ScriptImportComponent,
    ControllerImportComponent,
    ScriptSessionBoxComponent,
    ScriptParameterBankComponent,
    ScriptParameterComponent,
    ScriptModeSelectorComponent,
    ScriptDrumrackComponent,
    ScriptReactionComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule, 
    ToasterModule.forRoot(),
  ],
  providers: [ElectronService,ScriptImportComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
