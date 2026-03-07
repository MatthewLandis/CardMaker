import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { CardService } from '../cardmaker/cardmaker.service';

@Component({
  selector: 'app-header',
  imports: [[RouterLink, RouterLinkActive], FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  private service = inject(CardService);

  log = false;
  reg = false;

  username = '';
  password = '';

  authenticatedUser = '';

  ngOnInit() {
    const token = localStorage.getItem('token'); // Gets the token from the browsers local storage.

    // Grabs the payload portion of the jwt and sets the username inside the payload equal to authenticatedUser
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      this.authenticatedUser = payload.username;
    }
  }

  register() {
    // Calls the service function, passing in the username and password, and awaits a response.
    this.service.register(this.username, this.password).subscribe({
      next: (token: string) => {
        // On a successful response, set the token in local storage
        localStorage.setItem('token', token);
        window.location.reload();
      },
      error: err => {
        console.error(err);
      },
    });
  };


  login() {
    this.service.login(this.username, this.password).subscribe({
      next: (token: string) => {
        localStorage.setItem('token', token);
        window.location.reload();
      },
      error: err => {
        console.error(err);
      },
    });
  };

  logout() {
    localStorage.removeItem('token');
    window.location.reload();
  }
}
