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
  template = 'Normal';
  templates = ['Normal', 'Effect', 'Fusion', 'Ritual', 'Synchro', 'Xyz', 'Link',
    'Token', 'Slifer', 'Obelisk', 'Ra', 'Legendary Dragon', 'Dark Synchro', 'Skill', 'Spell', 'Trap'];
  title = "Dark Magician";
  titleStyle = 'Ultra-Rare';
  titleStyles = ['Common', 'Rare', 'Secret-Rare', 'Ultra-Rare', 'Barian', 'Skill'];
  attribute = 'Dark';
  attributes = ['Dark', 'Light', 'Earth', 'Water', 'Fire', 'Wind', 'Divine'];
  levelType = 'Level';
  levelTypes = ['Level', 'Negative Level', 'Rank'];
  primaryType = 'Spellcaster';
  primaryTypes = ['Aqua', 'Beast', 'Beast-Warrior', 'Creator God', 'Cyberse', 'Dinosaur', 'Divine-Beast', 'Dragon',
    'Fairy', 'Fiend', 'Fish', 'Insect', 'Illusion', 'Machine', 'Plant', 'Psychic', 'Pyro', 'Reptile',
    'Rock', 'Sea Serpent', 'Spellcaster', 'Thunder', 'Light', 'Warrior', 'Winged Beast', 'Wyrm', 'Zombie'];
  coreType = '';
  coreTypes = ['Fusion', 'Ritual', 'Synchro', 'Dark Synchro', 'Xyz', 'Pendulum', 'Link'];
  abilityType = '';
  abilityTypes = ['Gemini', 'Spirit', 'Toon', 'Union', 'Flip', 'Tuner'];
  lastType = 'Normal';
  lastTypes = ['Normal', 'Effect', 'Token'];
  effectText = "The ultimate wizard in terms of attack and defense.";
  pendulumEffectText = "Once per turn, you can reduce the battle damage you take from an attack involving a Pendulum Monster you control to 0.";
  pendulumTemplate = false;
 
  level = 7;
  rank = 4;
  nLevel = 7;
  pendulumScale = 4;
  linkRating = 3;
  atk = 2500;
  def = 2000;
  
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

  hoverLevel = 0;
  hoverRank = 0;
  hoverNLevel = 0;

  nameDropdownVisible = false;
  attributeDropdownVisible = false;
  templateDropdownVisible = false;
  primaryTypeDropdownVisible = false;
  abilityDropdownVisible = false;


///////////////////////////////////////////////////////////////////////////
effectTextLines = [6, 7, 8];
effectMode: 6 | 7 | 8 = 6;


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

  createCard() {
    domtoimage.toJpeg(document.getElementById('card')!)
      .then((dataUrl) => {
        var link = document.createElement('a');
        link.download = this.title;
        link.href = dataUrl;
        link.click();
      });
  }

  imageUrl: string | null = null;
  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.imageUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  selectAttribute(attr: string) {
    this.attribute = attr;
    this.attributeDropdownVisible = false;
  }

  selectNameStyle(style: string) {
    this.titleStyle = style;
    this.nameDropdownVisible = false;
  }
  
  selectPrimaryType(type: string) {
    this.primaryType = type;
    this.primaryTypeDropdownVisible = false;
  }

selectAbilityType(type: string) {
  if (this.abilityType === type) {
    this.abilityType = '';
  } else {
    this.abilityType = type;
  }
  this.abilityDropdownVisible = false;
}

  selectTemplate(template: string) {
    this.template = template;
    this.coreType = template;
    this.qualityOfLife();
    this.updateLevelType();
    this.templateDropdownVisible = false;
  }

  updateLevelType() {
    this.levelType = this.template === 'Xyz' ? 'Rank': 
    this.template === 'Dark Synchro' ? 'Negative Level' : 'Level';
  }

  qualityOfLife() {
    this.lastTypes.includes(this.template) ? this.lastType = this.template : '';
    if (this.coreTypes.includes(this.template)) {
      if (this.lastType === 'Normal') {
        this.lastType = 'Effect';
      }
    }
    // Remove Pendulum Overlay
    const nonPendulum = ["Link"];
    if (nonPendulum.includes(this.template)) {
      this.pendulumTemplate = false;
    }
  }

  @ViewChild('nameInput', { static: true }) nameInput!: ElementRef<HTMLInputElement>;
  private ctx!: CanvasRenderingContext2D;

  @ViewChild('typeBox', { static: true }) typeBox!: ElementRef<HTMLDivElement>;

  ngAfterViewChecked() {
  this.adjustTypeValue(this.typeBox.nativeElement);
}

ngAfterViewInit() {
  console.log('asdasd')
  const canvas = document.createElement('canvas');
  this.ctx = canvas.getContext('2d')!;

  // Scale ATK on load
  const atkEl = document.querySelector('.atk') as HTMLInputElement;
  if (atkEl) this.adjustAtkDefValue(atkEl);

  // Scale DEF on load (if it exists)
  const defEl = document.querySelector('.def') as HTMLInputElement;
  if (defEl) this.adjustAtkDefValue(defEl);
  
const typeEl = document.querySelector('.type') as HTMLElement;
if (typeEl) this.adjustTypeValue(typeEl);}

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
///////////////////////////////////////////////////////////////////////////////////////
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
}