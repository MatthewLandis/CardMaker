import { Component, ViewChild, ElementRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import domtoimage from 'dom-to-image';
import { CardService } from './cardmaker.service';
import { Icard } from './cardmaker.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './cardmaker.html',
  styleUrl: './cardmaker.scss'
})
export class CardMaker implements OnInit {
  private service = inject(CardService);
  private route = inject(ActivatedRoute);

  cardData: Icard = {
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

  templates = ['Normal', 'Effect', 'Fusion', 'Ritual', 'Synchro', 'Xyz', 'Link',
    'Token', 'Slifer', 'Obelisk', 'Ra', 'Legendary Dragon', 'Dark Synchro', 'Skill', 'Spell', 'Trap'];
  titleStyles = ['Common', 'Rare', 'Secret-Rare', 'Ultra-Rare', 'Barian', 'Skill'];
  attributes = ['Dark', 'Light', 'Earth', 'Water', 'Fire', 'Wind', 'Divine'];
  primaryTypes = ['Aqua', 'Beast', 'Beast-Warrior', 'Creator God', 'Cyberse', 'Dinosaur', 'Divine-Beast', 'Dragon',
    'Fairy', 'Fiend', 'Fish', 'Insect', 'Illusion', 'Machine', 'Plant', 'Psychic', 'Pyro', 'Reptile',
    'Rock', 'Sea Serpent', 'Spellcaster', 'Thunder', 'Light', 'Warrior', 'Winged Beast', 'Wyrm', 'Zombie'];
  coreTypes = ['Fusion', 'Ritual', 'Synchro', 'Dark Synchro', 'Xyz', 'Pendulum', 'Link'];
  abilityTypes = ['Gemini', 'Spirit', 'Toon', 'Union', 'Flip', 'Tuner'];
  lastTypes = ['Normal', 'Effect', 'Token'];
  linkArrows = {
    topLeft: false,
    top: false,
    topRight: false,
    left: false,
    right: false,
    bottomLeft: false,
    bottom: false,
    bottomRight: false,
  };

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

  ///////////////////////////////////////////////////////////////////////////
  effectTextLines = [6, 7, 8];
  effectMode: 6 | 7 | 8 = 6;

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      if (!params.has('id')) return;
      const cardId = params.get('id');
      this.service.getCardById(cardId).subscribe({
        next: (card: Icard) => {
          this.cardData = card;
        },
        error: (err) => {
          console.error(err);
        }
      })
    });
  }

  adjustEffectText(el: HTMLTextAreaElement) {
    const style = window.getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize);
    const fontFamily = style.fontFamily;
    this.ctx.font = `${fontSize}px ${fontFamily}`;
    const textWidth = this.ctx.measureText(el.value).width;
    console.log(textWidth)
    if (textWidth <= 3905 && this.effectMode == 6) this.effectMode = 6
    else if (textWidth <= 3905 && this.effectMode == 7) this.effectMode = 7
    else if (textWidth > 3905) this.effectMode = 8
  }
  /////////////////////////////////////////////////////////////////////////////
  toggleLinkArrow(arrow: string) {
    this.linkArrows[arrow as keyof typeof this.linkArrows] =
      !this.linkArrows[arrow as keyof typeof this.linkArrows];
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
  }

  selectAbilityType(type: string) {
    if (this.cardData.ability_type === type) {
      this.cardData.ability_type = '';
    } else {
      this.cardData.ability_type = type;
    }
    this.abilityDropdownVisible = false;
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
  }

  qualityOfLife() {
    this.lastTypes.includes(this.cardData.template) ? this.cardData.last_type = this.cardData.template : '';
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

  @ViewChild('typeBox', { static: true }) typeBox!: ElementRef<HTMLDivElement>;

  ngAfterViewChecked() {
    this.adjustTypeValue(this.typeBox.nativeElement);
  }

  ngAfterViewInit() {
    const canvas = document.createElement('canvas');
    this.ctx = canvas.getContext('2d')!;

    // Scale ATK on load
    const atkEl = document.querySelector('.atk') as HTMLInputElement;
    if (atkEl) this.adjustAtkDefValue(atkEl);

    // Scale DEF on load (if it exists)
    const defEl = document.querySelector('.def') as HTMLInputElement;
    if (defEl) this.adjustAtkDefValue(defEl);

    const typeEl = document.querySelector('.type') as HTMLElement;
    if (typeEl) this.adjustTypeValue(typeEl);
  }

  adjustNameScale() {
    const el = this.nameInput.nativeElement;
    const style = window.getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize);
    const fontFamily = style.fontFamily;
    const letterSpacing = parseFloat(style.letterSpacing || '0');
    this.ctx.font = `${fontSize}px ${fontFamily}`;
    const textWidth = this.ctx.measureText(el.value).width;
    const extraSpacing = letterSpacing * el.value.length;
    const totalTextWidth = textWidth + extraSpacing;
    const boxWidth = 616;
    const scale = totalTextWidth > boxWidth ? boxWidth / totalTextWidth : 1;
    el.style.transform = `scaleX(${scale})`;
    el.style.width = `${616 / scale}px`;
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
    domtoimage.toJpeg(document.getElementById('card')!)
      .then((dataUrl) => {
        var link = document.createElement('a');
        link.download = this.cardData.title;
        link.href = dataUrl;
        link.click();
      });
  }

  saveCard() {
    domtoimage.toJpeg(document.getElementById('card')!)
      .then((dataUrl) => {
        this.cardData.image_url = dataUrl;
        this.service.saveCard(this.cardData).subscribe({
          next: () => {
            window.alert(`${this.cardData.title} card saved successfully!`);
          },
          error: err => {
            console.error(err);
          },
        });
      });
  }
}
