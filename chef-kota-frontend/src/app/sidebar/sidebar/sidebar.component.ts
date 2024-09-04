import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoaderService } from 'src/app/loader/loader.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent  implements OnInit {
  isLoginPage = false;
  isSideNavOpened = false;
  isHomePage = false;

  constructor(public loadeService: LoaderService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/app-home') {
          this.isSideNavOpened = true;
          this.isHomePage = true;
        } else {
          this.isSideNavOpened = false;
          this.isHomePage = false;
        }
        this.isLoginPage = event.url === '/login' || event.url === '/register';
        if (this.isLoginPage) {
          this.router.navigateByUrl('/login', { replaceUrl: true }); 
        }
      }
    });
  }

  logout(): void {
    this.router.navigate(['/login'], { replaceUrl: true });
  
  }
  
}
