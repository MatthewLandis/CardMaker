import { Component, ViewChild, ElementRef, inject, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import domtoimage from 'dom-to-image';
import { CardService } from './cardmaker.service';
import { Icard } from './cardmaker.model';
import { ActivatedRoute } from '@angular/router';
import { errorMessage, getLoggedInUser } from '../auth.interceptor';

@Component({
  selector: 'app-cardmaker',
  imports: [CommonModule, FormsModule],
  templateUrl: './cardmaker.html',
  styleUrl: './cardmaker.scss'
})
export class CardMaker implements OnInit, AfterViewInit {
  private service = inject(CardService);
  private route = inject(ActivatedRoute);

  cardData: Icard = {
    username: '',
    id: 0,
    image_url: '',
    card_art_url: '',
    title: 'Dark Magician',
    title_style: 'Ultra-Rare',
    template: 'Normal',
    pendulum_template: false,
    level: 7,
    rank: 4,
    n_level: 7,
    attribute: 'Dark',
    primary_type: 'Spellcaster',
    core_type: '',
    ability_type: '',
    last_type: 'Normal',
    effect_text: "The ultimate wizard in terms of attack and defense.",
    pendulum_effect_text: "Once per turn, you can reduce the battle damage you take from an attack involving a Pendulum Monster you control to 0.",
    pendulum_scale: 4,
    link_rating: 3,
    atk: 2500,
    def: 2000,
    link_arrows: {
      topLeft: false,
      top: false,
      topRight: false,
      left: false,
      right: false,
      bottomLeft: false,
      bottom: false,
      bottomRight: false,
    }
  }

  templates = ['Normal', 'Effect', 'Ritual', 'Fusion', 'Synchro', 'Xyz', 'Link',
    'Token', 'Slifer', 'Obelisk', 'Ra', 'Legendary Dragon', 'Dark Synchro', 'Skill', 'Spell', 'Trap'];
  titleStyles = ['Common', 'Rare', 'Secret-Rare', 'Ultra-Rare', 'Barian', 'Skills'];
  attributes = ['Dark', 'Light', 'Earth', 'Water', 'Fire', 'Wind', 'Divine'];
  primaryTypes = ['Aqua', 'Beast', 'Beast-Warrior', 'Creator God', 'Cyberse', 'Dinosaur', 'Divine-Beast', 'Dragon',
    'Fairy', 'Fiend', 'Fish', 'Insect', 'Illusion', 'Machine', 'Plant', 'Psychic', 'Pyro', 'Reptile',
    'Rock', 'Sea Serpent', 'Spellcaster', 'Thunder', 'Light', 'Warrior', 'Winged Beast', 'Wyrm', 'Zombie'];
  coreTypes = ['Fusion', 'Ritual', 'Synchro', 'Dark Synchro', 'Xyz', 'Pendulum', 'Link'];
  abilityTypes = ['Gemini', 'Spirit', 'Toon', 'Union', 'Flip', 'Tuner'];
  lastTypes = ['Normal', 'Effect', 'Token'];

  spellType = 'Normal';
  trapType = 'Normal';
  spellTypes = ['Normal', 'Quick-Play', 'Continuous', 'Equip', 'Field', 'Ritual'];
  trapTypes = ['Normal', 'Continuous', 'Counter'];

  hoverLevel = 0;
  hoverRank = 0;
  hoverNLevel = 0;

  nameDropdownVisible = false;
  attributeDropdownVisible = false;
  templateDropdownVisible = false;
  primaryTypeDropdownVisible = false;
  abilityDropdownVisible = false;
  spellTypeDropdownVisible = false;
  trapTypeDropdownVisible = false;

  showHelp = false;
  ///////////////////////////////////////////////////////////////////////////
  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      if (!params.has('id')) return; // If id is not provided as a query parameter. Return and ignore below.
      const cardId = params.get('id')!;
      this.service.getCardById(cardId).subscribe({ // Makes an asynchronous call to the backend server to retrieve the card with the provided card ID.
        next: (card: Icard) => {
          this.cardData = card; // Replaces the default Dark Magician card data with that of the returned card.
          this.adjustNameScale();
          this.adjustAllText();
        },
        error: err => window.alert(`Could not load that card: ${errorMessage(err)}`),
      })
    });
  }

  effectTextLines = [6, 7, 8];
  effectMode: 6 | 7 | 8 = 6;
  scale = 1;
  n = 0;
  /////////////////////////////////////////////////////////////////////////////
  toggleLinkArrow(arrow: keyof typeof this.cardData.link_arrows) {
    this.cardData.link_arrows[arrow] = !this.cardData.link_arrows[arrow];
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.cardData.card_art_url = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  selectAttribute(attr: string) {
    this.cardData.attribute = attr;
    this.attributeDropdownVisible = false;
  }

  selectNameStyle(style: string) {
    this.cardData.title_style = style;
    this.nameDropdownVisible = false;
  }

  selectPrimaryType(type: string) {
    this.cardData.primary_type = type;
    this.primaryTypeDropdownVisible = false;
    this.adjustTypeBoxLater();
  }

  // The type line only exists on monster cards, so it may not be on screen.
  // Waits for the DOM to update, then measures it.
  private adjustTypeBoxLater() {
    setTimeout(() => {
      if (this.typeBox) this.adjustTypeValue(this.typeBox.nativeElement);
    });
  }

  // Re-fits the type line and ATK/DEF after the card changes (for example after loading a saved card).
  private adjustAllText() {
    setTimeout(() => {
      if (this.typeBox) this.adjustTypeValue(this.typeBox.nativeElement);
      const atkEl = document.querySelector<HTMLInputElement>('.atk');
      if (atkEl) this.adjustAtkDefValue(atkEl);
      const defEl = document.querySelector<HTMLInputElement>('.def');
      if (defEl) this.adjustAtkDefValue(defEl);
    });
  }

  selectAbilityType(type: string) {
    if (this.cardData.ability_type === type) {
      this.cardData.ability_type = '';
    } else {
      this.cardData.ability_type = type;
    }

    this.abilityDropdownVisible = false;
    this.adjustTypeBoxLater();
  }

  selectSpellType(type: string) {
    this.spellType = type;
    this.spellTypeDropdownVisible = false;
  }

  selectTrapType(type: string) {
    this.trapType = type;
    this.trapTypeDropdownVisible = false;
  }

  selectTemplate(template: string) {
    this.cardData.template = template;
    this.cardData.core_type = template;
    this.qualityOfLife();
    this.templateDropdownVisible = false;
    this.adjustAllText();
  }

  togglePendulum() {
    this.cardData.pendulum_template = !this.cardData.pendulum_template;
    this.adjustTypeBoxLater();
  }
  toggleAbilityDropdown() {
    this.abilityDropdownVisible = !this.abilityDropdownVisible;
  }

  qualityOfLife() {
    if (this.lastTypes.includes(this.cardData.template)) {
      this.cardData.last_type = this.cardData.template;
    }
    if (this.coreTypes.includes(this.cardData.template)) {
      if (this.cardData.last_type === 'Normal') {
        this.cardData.last_type = 'Effect';
      }
    }
    // Remove Pendulum Overlay
    const nonPendulum = ["Link"];
    if (nonPendulum.includes(this.cardData.template)) {
      this.cardData.pendulum_template = false;
    }
  }

  @ViewChild('nameInput', { static: true }) nameInput!: ElementRef<HTMLInputElement>;
  private ctx!: CanvasRenderingContext2D;

  @ViewChild('typeBox') typeBox!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    const canvas = document.createElement('canvas');
    this.ctx = canvas.getContext('2d')!;

    // Measure text only once the card fonts have loaded, otherwise the widths are wrong
    document.fonts.ready.then(() => this.adjustAllText());
  }

  adjustNameScale() {
    setTimeout(() => {
      const el = this.nameInput.nativeElement;
      const style = window.getComputedStyle(el);
      const fontSize = parseFloat(style.fontSize);
      const fontFamily = style.fontFamily;
      const letterSpacing = parseFloat(style.letterSpacing || '0');
      this.ctx.font = `${fontSize}px ${fontFamily}`;
      const textWidth = this.ctx.measureText(el.value).width;
      const extraSpacing = letterSpacing * el.value.length;
      const totalTextWidth = textWidth + extraSpacing;
      const boxWidth = 610;
      const scale = totalTextWidth > boxWidth ? boxWidth / totalTextWidth : 1;
      el.style.transform = `scaleX(${scale})`;
      el.style.width = `${610 / scale}px`;

    }, 1);
  }

  adjustAtkDefValue(el: HTMLInputElement) {
    const style = window.getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize);
    const fontFamily = style.fontFamily;
    const letterSpacing = parseFloat(style.letterSpacing || '0');
    this.ctx.font = `${fontSize}px ${fontFamily}`;
    const textWidth = this.ctx.measureText(el.value).width;
    const extraSpacing = letterSpacing * el.value.length;
    const totalTextWidth = textWidth + extraSpacing;
    const boxWidth = 70;
    const scale = totalTextWidth > boxWidth ? boxWidth / totalTextWidth : 1;
    el.style.transform = `scaleX(${scale})`;
    el.style.width = `${70 / scale}px`;
  }

  adjustTypeValue(el: HTMLElement) {
    const style = window.getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize);
    const fontFamily = style.fontFamily;
    this.ctx.font = `${fontSize}px ${fontFamily}`;
    const textWidth = this.ctx.measureText(el.innerText).width;
    const boxWidth = 680;
    const scale = textWidth > boxWidth ? boxWidth / textWidth : 1;
    el.style.transform = `scaleX(${scale})`;
    el.style.width = `${680 / scale}px`;
  }

  generatePNG() {
    domtoimage.toPng(document.getElementById('card')!)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${this.cardData.title || 'card'}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch(err => {
        console.error(err);
        window.alert('Could not create the image.');
      });
  }

  saveCard() {
    if (!getLoggedInUser()) {
      window.alert('Log in (top right) to save cards to your catalog.');
      return;
    }

    // JPEG keeps the saved image much smaller than PNG
    domtoimage.toJpeg(document.getElementById('card')!)
      .then((dataUrl) => {
        this.cardData.image_url = dataUrl;
        this.service.saveCard(this.cardData).subscribe({
          next: ({ id }) => {
            // Remember the id so saving again updates this card instead of making a copy
            this.cardData.id = id;
            window.alert(`${this.cardData.title} card saved successfully!`);
          },
          error: err => window.alert(`Could not save the card: ${errorMessage(err)}`),
        });
      })
      .catch(err => {
        console.error(err);
        window.alert('Could not create the card image.');
      });
  }
}
