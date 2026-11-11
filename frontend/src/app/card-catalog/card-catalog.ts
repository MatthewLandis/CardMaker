import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CardCatalogService } from './card-catalog.service';
import { Icard } from '../cardmaker/cardmaker.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { errorMessage, getLoggedInUser } from '../auth.interceptor';

@Component({
  selector: 'app-card-catalog',
  imports: [FormsModule],
  templateUrl: './card-catalog.html',
  styleUrl: './card-catalog.scss',
})
export class CardCatalog implements OnInit {
  private service = inject(CardCatalogService);
  private router = inject(Router);

  cards: Icard[] = [];
  selectedCard: Icard | null = null;
  cardSize = 1;
  message = '';

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.cardWrapper');
    if (!clickedInside) {
      this.selectedCard = null;
    }
  }

  selectCard(card: Icard, event: MouseEvent) {
    event.stopPropagation(); // prevent document click from clearing immediately
    this.selectedCard = card;
  }

  editCard(cardId: number) {
    this.router.navigate(['/'], { queryParams: { id: cardId } });
  }

  removeCard(card: Icard) {
    if (!window.confirm(`Delete "${card.title}"? This can't be undone.`)) return;

    this.service.deleteCard(card.id).subscribe({
      next: () => {
        this.cards = this.cards.filter(c => c.id !== card.id);
        this.selectedCard = null;
      },
      error: err => window.alert(errorMessage(err)),
    });
  }

  refreshCards() {
    this.service.getCards().subscribe({
      next: cards => {
        this.cards = cards;
        this.message = cards.length ? '' : 'No saved cards yet. Make one in the Card Maker and click "Save Card".';
      },
      error: err => (this.message = errorMessage(err)),
    });
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const step = 0.1;
    const delta = event.deltaY > 0 ? -step : step;
    this.cardSize = Math.min(2, Math.max(0.5, +(this.cardSize + delta).toFixed(2)));
  }

  ngOnInit() {
    if (!getLoggedInUser()) {
      this.message = 'Log in to see your saved cards.';
      return;
    }
    this.refreshCards();
  }
}
