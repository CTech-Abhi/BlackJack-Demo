import * as PIXI from "pixi.js";
import { Deck } from "./deck";
import { BetSelector } from "./betSelector";
import { Model } from "./model";
import { Card } from "./card";
import { gsap } from "gsap";

export class BlackjackTable extends PIXI.Container {
  private _deck: Deck = new Deck();
  private _betPanel: BetSelector | undefined;
  private _model: Model = Model.getInstance();
  private _startBtn: PIXI.Sprite = PIXI.Sprite.from("images/btn_start.png");
  private _betPlusBtn: PIXI.Sprite = PIXI.Sprite.from("images/btn_start.png");
  private _standBtn: PIXI.Sprite = PIXI.Sprite.from("images/btn_start.png");
  private _hitBtn: PIXI.Sprite = PIXI.Sprite.from("images/btn_start.png");
  private _dealerCards: Card[] = [];
  private _playerCards: Card[] = [];
  private _dealerCardStartX: number = 180;
  private _dealerCardStartY: number = -30;
  private _playerCardStartY: number = 180;
  private _dealerCardSpace: number = 100;
  private _roundBet: number = 0;
  private _buttonTextStyle: PIXI.TextStyle = new PIXI.TextStyle({
    fontSize: 60,
    fill: "#000000",
    lineJoin: "round",
  });

  private _resultTextStyle: PIXI.TextStyle = new PIXI.TextStyle({
    fontSize: 42,
    fill: "#00ff00",
    lineJoin: "round",
  });
  private _resultText: PIXI.Text = new PIXI.Text("-", this._resultTextStyle);

  private _balanceMeter: PIXI.Text = new PIXI.Text(
    "1000",
    new PIXI.TextStyle({
      fontSize: 32,
      fill: "#fdb9ff",
      lineJoin: "round",
    })
  );

  constructor() {
    super();
  }

  get playerBalance() {
    return this._model.playerBalance;
  }

  create() {
    this._resultText.anchor.set(0.5);
    this._resultText.x = 450;
    this._resultText.y = 200;
    this.addChild(this._resultText);

    this.addDeck();
    this._betPanel = new BetSelector();
    this.addChild(this._betPanel);
    this._betPanel.scale.set(0.75);
    this._betPanel.x = 225;
    this._betPanel.y = 420;

    this.addChild(this._balanceMeter);
    this._balanceMeter.anchor.set(0.5);
    this._balanceMeter.x = 450;
    this._balanceMeter.y = 420;
    this.updateBalanceMeter();

    this.addStartButton();
    this.addStandButton();
    this.addHitButton();
    this.addBetPlusButton();
    this.showStartButton();
    this.showAddBetButton(false);
    this.showHitStandCommands(false);
    console.log("Table Created ...");
  }

  private addStartButton() {
    this._startBtn.anchor.set(0.5);
    this.addChild(this._startBtn);
    const text = new PIXI.Text("START", this._buttonTextStyle);

    text.anchor.set(0.5);
    this._startBtn.addChild(text);
    this._startBtn.x = 670;
    this._startBtn.y = 400;
    this._startBtn.scale.set(0.3);
    this._startBtn.cursor = "pointer";

    this._startBtn.on("pointerdown", () => {
      this.showStartButton(false);
      if (this._dealerCards.length > 0) {
        this.clearTable();
        gsap.delayedCall(0.5, this.startNewGame.bind(this));
      } else {
        this.startNewGame();
      }
    });
  }

  private addBetPlusButton() {
    this._betPlusBtn.anchor.set(0.5);
    this.addChild(this._betPlusBtn);
    const text = new PIXI.Text("Add Bet", this._buttonTextStyle);

    text.anchor.set(0.5);
    this._betPlusBtn.addChild(text);
    this._betPlusBtn.x = 100;
    this._betPlusBtn.y = 400;
    this._betPlusBtn.scale.set(0.3);
    this._betPlusBtn.cursor = "pointer";

    this._betPlusBtn.on("pointerdown", () => {
      this._roundBet += this._model.selectedBet;
      this._model.placeBet();
      this.updateBalanceMeter();
    });
  }

  private clearTable() {
    this._resultText.text = "-";
    for (let i = 0; i < this._dealerCards.length; i++) {
      this._dealerCards[i].hideCard();
    }
    for (let i = 0; i < this._playerCards.length; i++) {
      this._playerCards[i].hideCard();
    }

    while (this._dealerCards.length > 0) {
      const card = this._dealerCards.pop();
      if (card) {
        this._deck.returnCard(card);
        gsap.to(card, {
          x: 0,
          y: 0,
          duration: 0.2,
        });
      }
    }
    while (this._playerCards.length > 0) {
      const card = this._playerCards.pop();
      if (card) {
        this._deck.returnCard(card);
        gsap.to(card, {
          x: 0,
          y: 0,
          duration: 0.2,
        });
      }
    }
  }

  private startNewGame() {
    this._roundBet = this._model.selectedBet;
    this._model.placeBet();
    this.updateBalanceMeter();
    this._startBtn.visible = false;
    this._startBtn.interactive = false;
    this._deck.shuffleDeck();
    this.dealCards();
  }

  private addStandButton() {
    this._standBtn.anchor.set(0.5);
    this.addChild(this._standBtn);
    const text = new PIXI.Text("STAND", this._buttonTextStyle);

    text.anchor.set(0.5);
    this._standBtn.addChild(text);
    this._standBtn.x = 650;
    this._standBtn.y = 400;
    this._standBtn.scale.set(0.25);
    this._standBtn.cursor = "pointer";

    this._standBtn.on("pointerdown", () => {
      this.showAddBetButton(false);
      this.showHitStandCommands(false);
      this.revealDealerHitResult();
    });
  }

  private addHitButton() {
    this._hitBtn.anchor.set(0.5);
    this.addChild(this._hitBtn);
    const text = new PIXI.Text("HIT", this._buttonTextStyle);

    text.anchor.set(0.5);
    this._hitBtn.addChild(text);
    this._hitBtn.x = 750;
    this._hitBtn.y = 400;
    this._hitBtn.scale.set(0.25);
    this._hitBtn.cursor = "pointer";

    this._hitBtn.on("pointerdown", this.dealCardToPlayer.bind(this));
  }

  private playDealerHitSequence() {
    const card = this._deck.drawCard();
    this._dealerCards.push(card);
    gsap.to(card, {
      x:
        this._dealerCardStartX +
        (this._dealerCards.length - 1) * this._dealerCardSpace,
      y: this._dealerCardStartY,
      duration: 0.4,
      onComplete: this.revealDealerHitResult.bind(this),
    });
  }

  private revealDealerHitResult() {
    for (let i = 0; i < this._dealerCards.length; i++) {
      this._dealerCards[i].revealCard();
    }

    gsap.delayedCall(0.2, this.verifyDealerGameOver.bind(this));
  }

  private verifyDealerGameOver() {
    //console.log("Tracing cards   :::   ", this._playerCards, this._dealerCards);
    let playerCardCount = this.checkCardResult(this._playerCards);
    let dealerCardCount = this.checkCardResult(this._dealerCards);

    if (dealerCardCount <= 21 && dealerCardCount > playerCardCount) {
      this._resultText.text = " DEALER   Won  !! ";
      this.showHitStandCommands(false);
      gsap.delayedCall(0.5, this.showStartButton.bind(this));
    } else if (dealerCardCount > 21) {
      this._resultText.text = " PLAYER   Won  !! ";
      this._model.addWins(this._roundBet * 2);
      this.updateBalanceMeter();
      this.showHitStandCommands(false);
      gsap.delayedCall(0.5, this.showStartButton.bind(this));
    } else {
      this.playDealerHitSequence();
    }
  }

  private dealCardToPlayer() {
    this.showHitStandCommands(false);
    const card = this._deck.drawCard();
    this._playerCards.push(card);
    gsap.to(card, {
      x:
        this._dealerCardStartX +
        (this._playerCards.length - 1) * this._dealerCardSpace,
      y: this._playerCardStartY,
      duration: 0.4,
      onComplete: this.revealCard.bind(this),
    });
  }

  private showHitStandCommands(active: boolean = true) {
    this._hitBtn.visible = active;
    this._standBtn.visible = active;
    this._hitBtn.interactive = active;
    this._standBtn.interactive = active;
  }

  private showAddBetButton(active: boolean = true) {
    this._betPlusBtn.visible = active;
    this._betPlusBtn.interactive = active;
  }

  private showStartButton(active: boolean = true) {
    this._startBtn.visible = active;
    this._startBtn.interactive = active;
  }

  private dealCards() {
    for (let i = 0; i < 2; i++) {
      this._dealerCards.push(this._deck.drawCard());
      this._playerCards.push(this._deck.drawCard());
    }

    for (let i = 0; i < this._dealerCards.length; i++) {
      gsap.to(this._dealerCards[i], {
        x: this._dealerCardStartX + i * this._dealerCardSpace,
        y: this._dealerCardStartY,
        duration: 0.4,
        delay: i * 0.4,
      });
      gsap.to(this._playerCards[i], {
        x: this._dealerCardStartX + i * this._dealerCardSpace,
        y: this._playerCardStartY,
        duration: 0.4,
        delay: i * 0.4,
      });
    }

    gsap.delayedCall(
      this._dealerCards.length * 0.4,
      this.revealCard.bind(this)
    );
  }

  private revealCard() {
    for (let i = 0; i < this._playerCards.length; i++) {
      this._playerCards[i].revealCard();
    }
    this._dealerCards[0].revealCard();
    let playerCardCount = this.checkCardResult(this._playerCards);
    if (playerCardCount < 21) {
      gsap.delayedCall(0.5, () => {
        this.showAddBetButton();
        this.showHitStandCommands();
      });
    } else {
      if (playerCardCount == 21) {
        if (this._playerCards.length == 2) {
          this._resultText.text = " PLAYER   WON  !! ";
          this._model.addWins(this._roundBet * 2);
          this.updateBalanceMeter();
          gsap.delayedCall(0.5, this.showStartButton.bind(this));
        } else {
          gsap.delayedCall(0.5, () => {
            this.showAddBetButton();
            this.showHitStandCommands();
          });
        }
      } else {
        this._resultText.text = " PLAYER   BUSTED  !! ";
        this.updateControlOnGameEnd();
      }
    }
  }

  private updateControlOnGameEnd() {
    this.showStartButton();
    this.showAddBetButton(false);
    this.showHitStandCommands(false);
  }

  private checkCardResult(cards: Card[]) {
    let aceCount = 0;
    let totalCardValue = 0;
    for (let i = 0; i < cards.length; i++) {
      const cardValue = cards[i].cardValue;
      if (cardValue == 11) {
        aceCount++;
      } else {
        totalCardValue += cardValue;
      }
      // console.log("CardName is ::::      ", aceCount, cards[i].cardValue);
    }

    if (aceCount - 1 > 0) {
      totalCardValue += aceCount - 1;
      aceCount = 1;
    }

    if (aceCount) {
      if (totalCardValue + 11 <= 21) {
        totalCardValue += 11;
      } else {
        totalCardValue += 1;
      }
    }

    return totalCardValue;
  }

  private addDeck() {
    this._deck.x = 150;
    this._deck.y = 120;
    this.addChild(this._deck);
  }

  private updateBalanceMeter() {
    this._balanceMeter.text = "EUR " + this.playerBalance;
  }

  reset() {}
}
