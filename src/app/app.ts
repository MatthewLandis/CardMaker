import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import domtoimage from 'dom-to-image';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
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

  attributes = ['Dark', 'Light', 'Earth', 'Water', 'Fire', 'Wind', 'Divine'];
  templates = ['Normal', 'Effect', 'Fusion', 'Ritual', 'Synchro', 'Xyz', 'Pendulum', 'Link', 
    'Token', 'Slifer', 'Obelisk', 'Ra', 'LegendaryDragon', 'DarkSynchro', 'Skill', 'Spell', 'Trap'];

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
    this.templateDropdownVisible = false;
  }
}