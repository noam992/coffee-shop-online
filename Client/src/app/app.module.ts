import { HttpInterceptorService } from './services/http-interceptor.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { OnlineShopComponent, popUpUserDialog, popUpEditProductDialog } from './components/online-shop/online-shop.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { RegisterStepTwoComponent, ModalCompletedProcess } from './components/auth/register-step-two/register-step-two.component';
import { ChatComponent } from './components/chat/chat.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { FileInputConfig, MaterialFileInputModule, NGX_MAT_FILE_INPUT_CONFIG } from 'ngx-material-file-input';
import { CartComponent, popUpDeleteCartDialog } from './components/cart/cart.component';
import { HighlightSearchPipePipe } from './pipes/highlight-search-pipe.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OrderComponent, popUpDialogCompleteOrder } from './components/order/order.component';
import { PaymentComponent } from './components/payment/payment.component';
import { MultiItemGalleryComponentComponent } from './components/multi-item-gallery-component/multi-item-gallery-component.component';
import { CarouselModule } from 'ngx-owl-carousel-o';



const config: FileInputConfig = {
  sizeUnit: 'Octet'
};

@NgModule({
  declarations: [LayoutComponent,
                HeaderComponent,
                HomeComponent,
                OnlineShopComponent,
                popUpUserDialog,
                popUpEditProductDialog,
                PageNotFoundComponent,
                LoginComponent,
                RegisterComponent,
                RegisterStepTwoComponent,
                ModalCompletedProcess,
                ChatComponent,
                AddProductComponent,
                CartComponent,
                popUpDeleteCartDialog,
                HighlightSearchPipePipe,
                OrderComponent,
                popUpDialogCompleteOrder,
                PaymentComponent,
                MultiItemGalleryComponentComponent],
  imports: [BrowserModule,
            AppRoutingModule,
            HttpClientModule,
            FormsModule,
            BrowserAnimationsModule,
            MaterialModule,
            MaterialFileInputModule,
            FlexLayoutModule,
            CarouselModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    { provide: NGX_MAT_FILE_INPUT_CONFIG,
      useValue: config
    }
  ],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
