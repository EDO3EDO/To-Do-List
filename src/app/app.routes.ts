import { Routes } from '@angular/router';
import { SignUpComponent } from '../components/Sign-Up/Sign-Up.component';
import { SignInComponent } from '../components/Sign-In/Sign-In.component';
import { ToDoListComponent } from '../components/To-Do-List/To-Do-List.component';
import { authGuard } from '../Guards/auth-guard';
import { noAuthGuard } from '../Guards/no-auth-guard';
import { FocusComponent } from '../components/Focus/Focus.component';
import { SETTINGSComponent } from '../components/SETTINGS/SETTINGS.component';
import { LISTSComponent } from '../components/LISTS/LISTS.component';
import { PersonalComponent } from '../components/personal/personal.component';
import { RestaurantComponent } from '../components/restaurant/restaurant.component';
import { ShopingComponent } from '../components/shoping/shoping.component';
import { SpaceComponent } from '../components/space/space.component';
import { EditProfileComponent } from '../components/Edit-profile/Edit-profile.component';
import { PrivaceComponent } from '../components/privace/privace.component';
import { HelpComponent } from '../components/help/help.component';
import { Error404Component } from '../components/Error404/Error404.component';

export const routes: Routes = [


{path:"Sign-Up" ,canActivate:[noAuthGuard], component:SignUpComponent},
{path:"Sign-In" ,canActivate:[noAuthGuard], component:SignInComponent},
{path:"To Do List" ,canActivate:[authGuard], component:ToDoListComponent},
{path:"Lists" ,canActivate:[authGuard], component:LISTSComponent},
{path:"Setting" ,canActivate:[authGuard], component:SETTINGSComponent},
{path:"Focus" ,canActivate:[authGuard], component:FocusComponent},
{path:"personal" ,canActivate:[authGuard], component:PersonalComponent},
{path:"restaurant" ,canActivate:[authGuard], component:RestaurantComponent},
{path:"shoping" ,canActivate:[authGuard], component:ShopingComponent},
{path:'space/:id' ,canActivate:[authGuard], component:SpaceComponent},
{path:'edit' ,canActivate:[authGuard], component:EditProfileComponent},
{path:'privet' ,canActivate:[authGuard], component:PrivaceComponent},
{path:'help' ,canActivate:[authGuard], component:HelpComponent},
{path:'**' ,canActivate:[authGuard], component:Error404Component},



];
