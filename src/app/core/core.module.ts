import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { StructureModule } from '../structure/structure.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    StructureModule,
    HttpClientModule
  ],
  exports: [
    StructureModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parent: CoreModule) {
    if (parent) {
      throw new Error('Core Module Has Already been Loaded, Import Core Module only in AppModule');
    }
  }
}
