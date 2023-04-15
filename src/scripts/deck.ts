import { Card } from "./card";
import * as PIXI from "pixi.js";
// import gsap from "gsap";

export class Deck extends PIXI.Container {
  private deckSize: number = 52;
  private _suit: string[] = ["hearts", "diamonds", "spades", "clubs"];
  private _cardFace: string[] = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "jack",
    "queen",
    "king",
    "ace",
  ];
  private cards: Card[] = [];
  constructor() {
    super();
    console.log(this._suit, this._cardFace);
    this.createDeck();
    // this.shuffleDeck();

    // gsap.delayedCall(2, this.flipCardOnTop.bind(this));
    // gsap.delayedCall(4, this.flipCardOnTop.bind(this));
  }

  shuffleDeck() {
    for (var i = 0; i < this.size / 2; i++) {
      const randomPosition = Math.floor(
        Math.random() * (this.children.length - 1)
      );
      const card = this.cards.splice(randomPosition, 1);
      this.cards.push(card[0]);
      this.addChild(card[0]);
    }
    this.organizeDeck();
  }

  private organizeDeck() {
    for (var i = 0; i < this.children.length; i++) {
      const card = this.children[i] as Card;
      card.x = 0.2 * i;
      card.y = -0.1 * i;
    }
  }

  /* private flipCardOnTop() {
    const card = this.children[this.children.length - 1] as Card; // cards[this.cards.length - 1];
    card.flipCard();
  } */

  private createDeck() {
    for (var i = 0; i < this.size; i++) {
      const name =
        this._cardFace[i % this._cardFace.length] +
        "_of_" +
        this._suit[Math.floor(i / this._cardFace.length)];
      const card = new Card(name);
      card.x = 0.2 * i;
      card.y = -0.1 * i;
      this.cards.push(card);
      this.addChild(card);
    }
  }

  drawCard() {
    return this.cards.pop() as Card;
  }

  returnCard(card: Card) {
    this.cards.push(card);
  }

  get size() {
    return this.deckSize;
  }

  reset() {
    this.shuffleDeck();
  }
}
