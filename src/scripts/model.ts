export class Model {
  private static instance: Model;
  private _playerBalance: number = 1000;
  private _selectedBet: number = 2;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {}

  set playerBalance(value: number) {
    this._playerBalance = value;
  }

  get playerBalance() {
    return this._playerBalance;
  }

  set selectedBet(value: number) {
    this._selectedBet = value;
  }

  get selectedBet() {
    return this._selectedBet;
  }

  placeBet() {
    this._playerBalance -= this._selectedBet;
  }

  addWins(winAmount: number) {
    this._playerBalance += winAmount;
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): Model {
    if (!Model.instance) {
      Model.instance = new Model();
    }

    return Model.instance;
  }
}
