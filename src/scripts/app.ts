// app.ts

import * as PIXI from "pixi.js";
import { BlackjackTable } from "./blackjackTable";

interface EngineParams {
  containerId: string;
  canvasW: number;
  canvasH: number;
  fpsMax: number;
}

class Engine {
  public container: HTMLElement;
  public loader: PIXI.Loader;
  public renderer: PIXI.Renderer;
  public stage: PIXI.Container;
  public graphics: PIXI.Graphics;

  constructor(params: EngineParams) {
    this.loader = PIXI.Loader.shared;
    this.renderer = PIXI.autoDetectRenderer({
      width: params.canvasW,
      height: params.canvasH,
      antialias: true,
    });
    this.stage = new PIXI.Container();
    this.graphics = new PIXI.Graphics();

    this.container = params.containerId
      ? document.getElementById(params.containerId) || document.body
      : document.body;
    this.container.appendChild(this.renderer.view);
  } // constructor
} // Engine

const engine = new Engine({
  containerId: "game",
  canvasW: 900,
  canvasH: 450,
  fpsMax: 60,
});

const table: BlackjackTable = new BlackjackTable();
const mainButton = PIXI.Sprite.from("images/btn_main.png");
// const sprite = PIXI.Sprite.from("images/logo.png");

// ==============
// === STATES ===
// ==============

window.onload = load;

function load() {
  showIntroScreen();
  render();
  //table.create();
  //create();
} // load

function showIntroScreen() {
  mainButton.on("pointerdown", (evt: MouseEvent) => {
    startGame(evt);
  });
  mainButton.interactive = true;

  // Shows hand cursor
  mainButton.cursor = "pointer";
  mainButton.anchor.set(0.5);
  mainButton.x = engine.renderer.width / 2;
  mainButton.y = engine.renderer.height / 2;
  //mainButton.x = 250; //window.innerWidth / 2;
  //mainButton.y = 250; //window.innerHeight / 2;
  engine.stage.addChild(mainButton);
}

function startGame(e: MouseEvent) {
  console.log("onClick event   ::::    ", e);
  table.create();
  create();
}

function create() {
  /* ***************************** */
  /* Create your Game Objects here */
  /* ***************************** */

  /* Sprite */
  /* sprite.anchor.set(0.5);
  sprite.x = engine.renderer.width / 2;
  sprite.y = engine.renderer.height / 2;
  engine.stage.addChild(sprite); */
  engine.stage.removeChild(mainButton);
  mainButton.destroy();
  engine.stage.addChild(table);
} // create

function render() {
  requestAnimationFrame(render);
  /* ***************************** */
  /* Render your Game Objects here */
  /* ***************************** */
  /* Sprite */
  // sprite.rotation += 0.01;
  engine.renderer.render(engine.stage);
} // render
