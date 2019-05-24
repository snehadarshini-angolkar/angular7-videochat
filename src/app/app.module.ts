import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpeechRecognitionService } from './speech-recognition.service';
import { MatButtonModule, MatGridListModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatGridListModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  providers: [SpeechRecognitionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
