import { OrderComponent } from './components/order/order.component';
import { RegisterStepTwoComponent } from './components/auth/register-step-two/register-step-two.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnlineShopComponent } from './components/online-shop/online-shop.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';


const routes: Routes = [
  {path: "home", component: HomeComponent},
  {path: "online-shop", component: OnlineShopComponent},
  {path: "register", component: RegisterComponent},
  {path: "registerStepTwo", component: RegisterStepTwoComponent},
  {path: "order", component: OrderComponent},
  //{path: "admin", loadChildren: () => import("./components") },
  {path: "", pathMatch: "full", redirectTo:"home"}, // Default route
  {path: "**", component: PageNotFoundComponent} //404

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
