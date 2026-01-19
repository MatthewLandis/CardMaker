import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import domtoimage from 'dom-to-image';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Add this import


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  atk = 2500;
  def = 2000;
  level = 7;
  title = 'Dark Magician';
  primaryType = 'Spellcaster';
  coreType = '';
  abilityType = '';
  lastType = 'Normal';
  effectText = "The ultimate wizard in terms of attack and defense.";
  attributeDropdownVisible = false;
  templateDropdownVisible = false;
  attribute = 'Dark';
  template = 'Normal';
  hoverLevel = 0;

  primaryTypes = ['Aqua', 'Beast', 'Beast-Warrior', 'Creator God', 'Cyberse', 'Dinosaur', 'Divine-Beast', 'Dragon',
    'Fairy', 'Fiend', 'Fish', 'Insect', 'Illusion', 'Machine', 'Plant', 'Psychic', 'Pyro', 'Reptile',
    'Rock', 'Sea Serpent', 'Spellcaster', 'Thunder', 'Light', 'Warrior', 'Winged Beast', 'Wyrm', 'Zombie'];
  coreTypes = ['Fusion', 'Ritual', 'Synchro', 'Xyz', 'Pendulum', 'Link'];
  abilityTypes = ['Gemini', 'Spirit', 'Toon', 'Union', 'Flip', 'Tuner'];
  lastTypes = ['Normal', 'Effect', 'Token'];


  attributes = ['Dark', 'Light', 'Earth', 'Water', 'Fire', 'Wind', 'Divine'];
  templates = ['Normal', 'Effect', 'Fusion', 'Ritual', 'Synchro', 'Xyz', 'Pendulum', 'Link', 
    'Token', 'Slifer', 'Obelisk', 'Ra', 'LegendaryDragon', 'DarkSynchro', 'Skill', 'Spell', 'Trap'];

    titleStyle = 'UltraRare';
nameStyles = ['Common', 'Rare', 'SecretRare', 'UltraRare', 'Barian', 'Skill'];
    
  createCard() {
    domtoimage.toJpeg(document.getElementById('card')!)
      .then((dataUrl) => {
        var link = document.createElement('a');
        link.download = this.title;
        link.href = dataUrl;
        link.click();
      });
  }

  toggleAttributeDropdown() {
    this.attributeDropdownVisible = !this.attributeDropdownVisible;
  }

  toggleTemplateDropdown() {
    this.templateDropdownVisible = !this.templateDropdownVisible;
  }


  selectAttribute(attr: string) {
    this.attribute = attr;
    this.attributeDropdownVisible = false;
  }

  selectTemplate(template: string) {
    this.template = template;
    this.coreType = template;
    this.abilityType = template;
    this.lastType = template;
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


}