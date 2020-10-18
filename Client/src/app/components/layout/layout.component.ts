import { LoginComponent } from './../auth/login/login.component';
import { SharingSizeScreenService } from './../../services/sharing-data/sharing-size-screen.service';
import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { IsOpenDrawerLogInParentService } from 'src/app/services/sharing-data/is-open-drawer-log-in-parent.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})

export class LayoutComponent implements OnInit {
  
  // Responsive layout
  public title = 'flex-tutorial';
  public media$: Observable<MediaChange[]>;
  public screenSize = {
    deviceXs: 'xs', // min-width: 0px , max-width: 600px
    deviceSm: 'sm', // min-width: 600px , max-width: 960px
    deviceMd: 'md', // min-width: 960px , max-width: 1280px
    deviceLg: 'lg', // min-width: 1280px , max-width: 1920px
    deviceXl: 'xl', // min-width: 1920px , max-width: 5000px
  }

  public currentScreenSize: string

  // Side Drawer form log in process
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('chatBox') chatBox: MatSidenav;
  @ViewChild('appLogIn') public child: LoginComponent;
  
  constructor(private myIsOpenLogInDrawerService: IsOpenDrawerLogInParentService,
              private mySharingSizeScreenService: SharingSizeScreenService,
              public myMediaObserver: MediaObserver) {

              // Catch observer of MediaObserver
              this.media$ = myMediaObserver.asObservable();

              // Listening to any called from home component.
              // Home component call to function in layout component to open log in drawer, if localStorage include token "key"   
              this.myIsOpenLogInDrawerService.drawerFunctionCalled$.subscribe(isOpen => {
                if(isOpen === true) this.toggleSideDrawer();
              });
   }
  
  
  ngOnInit(){

    this.media$.subscribe(mq => {

      // Check which variable size screen is and send it.
      // Any change on screen size sent to service "SharingSizeScreenService"
      for (const size in this.screenSize) {
        if (this.screenSize[size] === mq[0].mqAlias) {
          this.mySharingSizeScreenService.whichSizeScreenIs(size)
        }
      }

      this.currentScreenSize = mq[0].mqAlias

    })

  }

  // Toggle side drawer
  public toggleSideDrawer(){

    // Toggle log in drawer
    this.sidenav.toggle();

    // Clear form
    this.child.clearForm();


  }


}
