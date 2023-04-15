import * as PIXI from "pixi.js";
import gsap from "gsap";

export class Card extends PIXI.Container {
  private _cardBase: PIXI.Sprite;
  private _cardFace: PIXI.Sprite;
  private _name: string;
  constructor(cardName: string) {
    super();
    this._name = cardName;
    this._cardBase = PIXI.Sprite.from("images/face.png");
    this._cardFace = PIXI.Sprite.from("images/" + this._name + ".png");
    this.create();
    this._cardFace.scale.set(0.65);
    this._cardFace.visible = false;
    this.scale.set(0.5);
  }

  private create() {
    this._cardBase.tint = 0xed86b2;
    this._cardBase.anchor.set(0.5);
    this.addChild(this._cardBase);
    this._cardFace.anchor.set(0.5);
    this.addChild(this._cardFace);
    // console.log("Added  ::   ", this._name);
  }

  private flipCardFace() {
    this._cardFace.visible = !this._cardFace.visible;
  }

  revealCard() {
    if (!this._cardFace.visible) {
      this.flipCard();
    }
  }

  hideCard() {
    if (this._cardFace.visible) {
      this.flipCard();
    }
  }

  private flipCard() {
    // Add tweening animation to flip card ...
    let tl = gsap.timeline();
    tl.to(this, {
      width: 0,
      duration: 0.1,
      onComplete: this.flipCardFace.bind(this),
    }).to(this, { width: 80, duration: 0.1 });
  }

  get cardValue() {
    let value = 0;
    let cardFace = this._name.split("_")[0];
    switch (cardFace) {
      case "ace":
        value = 11;
        break;
      case "king":
      case "queen":
      case "jack":
        value = 10;
        break;
      default:
        value = parseInt(cardFace);
    }
    return value;
  }

  reset() {}
}
