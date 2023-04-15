import * as PIXI from "pixi.js";
import { Model } from "./model";

export class BetSelector extends PIXI.Container {
  private _model: Model = Model.getInstance();
  private _leftArrow: PIXI.Sprite = PIXI.Sprite.from("images/arrow.png");
  private _rightArrow: PIXI.Sprite = PIXI.Sprite.from("images/arrow.png");
  private _availableBets: number[] = [1, 2, 5, 10, 20];
  private _selectedIndex: number = 1;
  private _betText: PIXI.Text = new PIXI.Text(
    "1",
    new PIXI.TextStyle({
      fontSize: 32,
      fill: "#acb9ff",
      lineJoin: "round",
    })
  );

  constructor() {
    super();
    this.createUI();
  }

  private createUI() {
    this._leftArrow.anchor.set(0.5);
    this._rightArrow.anchor.set(0.5);
    this._betText.anchor.set(0.5, 0);
    this._betText.text = "" + this._availableBets[this._selectedIndex];
    this.addChild(this._betText);
    this.addChild(this._leftArrow);
    this.addChild(this._rightArrow);
    this._leftArrow.scale.set(-1, 1);
    this._leftArrow.x = -50;
    this._rightArrow.x = 50;
    this._betText.y = -15;

    this.addListeners();
  }

  private addListeners() {
    this._leftArrow.on("pointerdown", () => {
      if (this._selectedIndex > 0) {
        --this._selectedIndex;
      }
      this.updateSelectedBet();
    });
    this._leftArrow.cursor = "pointer";
    this._leftArrow.interactive = true;

    this._rightArrow.on("pointerdown", () => {
      if (this._selectedIndex < this._availableBets.length - 1) {
        ++this._selectedIndex;
      }
      this.updateSelectedBet();
    });
    this._rightArrow.cursor = "pointer";
    this._rightArrow.interactive = true;
  }

  private updateSelectedBet() {
    this._model.selectedBet = this._availableBets[this._selectedIndex];
    this._betText.text = "" + this._availableBets[this._selectedIndex];
  }
}
