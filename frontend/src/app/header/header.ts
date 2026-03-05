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

  userLogin = false;
  showLogin = false;
  showRegister = false;

  username = '';
  password = '';

  authenticatedUser = '';

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      this.authenticatedUser = payload.username;
    }

    console.log(this.authenticatedUser)
  }

  register() {
    this.service.register(this.username, this.password).subscribe({
      next: (token: string) => {
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
        this.authenticatedUser = this.username;
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
