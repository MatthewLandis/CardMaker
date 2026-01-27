import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import domtoimage from 'dom-to-image';


@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './cardmaker.html',
  styleUrl: './cardmaker.scss'
})
export class CardMaker {
  atk = 2500;
  def = 2000;
  level = 7;
  rank = 4;
  nLevel = 7;
  title = "Dark Magician";
  primaryType = 'Spellcaster';
  coreType = '';
  abilityType = '';
  lastType = 'Normal';
  effectText = "The ultimate wizard in terms of attack and defense.";
  pendulumEffectText = "Once per turn, you can reduce the battle damage you take from an attack involving a Pendulum Monster you control to 0.";
  attributeDropdownVisible = false;
  templateDropdownVisible = false;
  attribute = 'Dark';
  template = 'Normal';
  hoverLevel = 0;
  hoverRank = 0;
  hoverNLevel = 0;
  scaleMonsterType = 1;
  pendulumTemplate = false;
  pendulumScale = 4;
  primaryTypes = ['Aqua', 'Beast', 'Beast-Warrior', 'Creator God', 'Cyberse', 'Dinosaur', 'Divine-Beast', 'Dragon',
    'Fairy', 'Fiend', 'Fish', 'Insect', 'Illusion', 'Machine', 'Plant', 'Psychic', 'Pyro', 'Reptile',
    'Rock', 'Sea Serpent', 'Spellcaster', 'Thunder', 'Light', 'Warrior', 'Winged Beast', 'Wyrm', 'Zombie'];
  coreTypes = ['Fusion', 'Ritual', 'Synchro', 'Xyz', 'Pendulum', 'Link'];
  abilityTypes = ['Gemini', 'Spirit', 'Toon', 'Union', 'Flip', 'Tuner'];
  lastTypes = ['Normal', 'Effect', 'Token'];

  attributes = ['Dark', 'Light', 'Earth', 'Water', 'Fire', 'Wind', 'Divine'];
  templates = ['Normal', 'Effect', 'Fusion', 'Ritual', 'Synchro', 'Xyz', 'Link',
    'Token', 'Slifer', 'Obelisk', 'Ra', 'LegendaryDragon', 'DarkSynchro', 'Skill', 'Spell', 'Trap'];

  titleStyle = 'Ultra-Rare';
  nameStyles = ['Common', 'Rare', 'Secret-Rare', 'Ultra-Rare', 'Barian', 'Skill'];

  levelType = 'Level';
  levelTypes = ['Level', 'Negative Level', 'Rank'];

  createCard() {
    domtoimage.toJpeg(document.getElementById('card')!)
      .then((dataUrl) => {
        var link = document.createElement('a');
        link.download = this.title;
        link.href = dataUrl;
        link.click();
      });
  }

  selectAttribute(attr: string) {
    this.attribute = attr;
    this.attributeDropdownVisible = false;
  }

  selectTemplate(template: string) {
    this.template = template;
    this.coreType = template;
    this.qualityOfLife();
    this.updateLevelType();
    this.templateDropdownVisible = false;
  }
  primaryTypeDropdownVisible = false;
  togglePrimaryTypeDropdown() {
    this.primaryTypeDropdownVisible = !this.primaryTypeDropdownVisible;
  }

  nameDropdownVisible = false;
  toggleNameDropdown() {
    this.nameDropdownVisible = !this.nameDropdownVisible;
  }

  selectNameStyle(style: string) {
    this.titleStyle = style;
    this.nameDropdownVisible = false;
  }

updateLevelType() {
    if (this.template === 'Xyz') {
      this.levelType = 'Rank';
    } else if (this.template === 'DarkSynchro') {
      this.levelType = 'Negative Level';
    } else {
      this.levelType = 'Level';
    }
  }

  qualityOfLife() {
    this.lastTypes.includes(this.template) ? this.lastType = this.template : '';
    if (this.coreTypes.includes(this.template)) {
      if (this.lastType === 'Normal') {
        this.lastType = '';
      }
    }
  }

  ngOnChanges() {
    this.adjustNameScale();
  }

  @ViewChild('nameInput', { static: true }) nameInput!: ElementRef<HTMLInputElement>;
  private ctx!: CanvasRenderingContext2D;

  ngAfterViewInit() {
    const canvas = document.createElement('canvas');
    this.ctx = canvas.getContext('2d')!;
    this.adjustNameScale();
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

  selectPrimaryType(type: string) {
    this.primaryType = type;
    this.primaryTypeDropdownVisible = false;
  }

  changeArt() {
    alert("Art changing not yet implemented.");
  }
  @ViewChild('valueAtkInput', { static: true }) valueAtkInput!: ElementRef<HTMLInputElement>;
  @ViewChild('valueDefInput', { static: true }) valueDefInput!: ElementRef<HTMLInputElement>;

  ngOnChangesValue() {
    this.adjustValueAtkScale();
  }
  adjustValueAtkScale() {
    const el = this.valueAtkInput.nativeElement;
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

  adjustValueDefScale() {
    const el = this.valueDefInput.nativeElement;
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

  abilityDropdownVisible = false;
  abilityDropdown() {
    this.abilityDropdownVisible = !this.abilityDropdownVisible;
  }

  selectAbilityType(type: string) {
    this.abilityType = type;
    this.abilityDropdownVisible = false;
  }
}