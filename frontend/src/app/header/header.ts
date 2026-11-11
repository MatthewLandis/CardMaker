import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardService } from '../cardmaker/cardmaker.service';
import { errorMessage, getLoggedInUser } from '../auth.interceptor';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  private service = inject(CardService);

  log = false;
  reg = false;

  username = '';
  password = '';
  authError = '';

  authenticatedUser = '';

  ngOnInit() {
    // Reads the username from the saved token (empty if logged out or the token expired)
    this.authenticatedUser = getLoggedInUser();
  }

  toggleForm(form: 'log' | 'reg') {
    this.log = form === 'log' ? !this.log : false;
    this.reg = form === 'reg' ? !this.reg : false;
    this.authError = '';
  }

  submit() {
    if (!this.username.trim() || !this.password) {
      this.authError = 'Enter a username and password';
      return;
    }

    // Calls the service function, passing in the username and password, and waits for a response.
    const request = this.log
      ? this.service.login(this.username, this.password)
      : this.service.register(this.username, this.password);

    request.subscribe({
      next: (token: string) => {
        // On a successful response, save the token in local storage
        localStorage.setItem('token', token);
        window.location.reload();
      },
      error: err => (this.authError = errorMessage(err)),
    });
  }

  logout() {
    localStorage.removeItem('token');
    window.location.reload();
  }
}
