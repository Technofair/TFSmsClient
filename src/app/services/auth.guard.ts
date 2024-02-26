import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Assuming you have an AuthService for authentication

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    const isLoggedIn = this.authService.isLoggedIn(); // Call a method in AuthService to check if the user is logged in

    if (isLoggedIn) {
      return true; // Allow access to the page
    } else {
      return this.router.parseUrl('/'); // Redirect to the login page
    }
  }
}
