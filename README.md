# BlackJack-Demo

Its a demo for H5 game development using PIXI.JS

**Developer**
Abhishek Singhal

**Installation**
   * run command : npm install or npm i
   * run command : npm run serve
   * browser game : open "localhost:8080" on your preferred browaser

** TEST **
run command :  npm test

In case you see below error ( on serve command )
opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],

Use any of the below options :

**for macOS, Linux or Windows Git Bash**

export NODE_OPTIONS=--openssl-legacy-provider

**for Windows CMD (Command Prompt)**

set NODE_OPTIONS=--openssl-legacy-provider

**for Windows PowerShell**

$env:NODE_OPTIONS="--openssl-legacy-provider"

**for Docker (in your Dockerfile)**

ENV NODE_OPTIONS="--openssl-legacy-provider"

# Game Behavior

    * Click start button to start the game
    * At this stage you may chose any preferred bet and click "start" button to deal the cards.
    * Click hit/stand according to your cards.
    * before clicking hit/stand you may further increase bet by clicking the "add Bet" button.
    * on winning you get double the amount you placed in this round.
