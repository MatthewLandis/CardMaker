import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CardCatalogService } from './card-catalog.service';
import { Icard } from '../cardmaker/cardmaker.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-catalog',
  imports: [FormsModule],
  templateUrl: './card-catalog.html',
  styleUrl: './card-catalog.scss',
})
export class CardCatalog implements OnInit {
  private service = inject(CardCatalogService);

  public cards: Icard[] = [];
  selectedCard: Icard | null = null;
  cardSize = 1;

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

  editCard(card: Icard, event: MouseEvent) {
    event.stopPropagation();
    console.log('Editing card:', card);
  }

  removeCard(cardId: number | undefined) {
    this.service.deleteCard(cardId).subscribe({
      next: () => {
        // this.refreshCards();
        this.selectedCard = null;
      },
      error: err => console.error(err),
    });
  }

  // refreshCards() {
  //   this.service.getCards().subscribe({
  //     next: cards => this.cards = cards,
  //     error: err => console.error(err),
  //   });
  // }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const step = 0.1;
    const delta = event.deltaY > 0 ? -step : step;
    this.cardSize = Math.min(2, Math.max(0.5, +(this.cardSize + delta).toFixed(2)));
  }

  ngOnInit(): void {
    this.service.getCards().subscribe({
      next: (result: Icard[]) => {
        this.cards = result;
      },
      error: err => console.error(err),
    });
  }
}