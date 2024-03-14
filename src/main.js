/*
Name: Jacky Chen

Source: https://heterogenoustasks.wordpress.com/2014/09/22/a-bestiary-of-player-agency/
*/
const tileSize = 16;

let config = {
    type: Phaser.WEBGL,
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: [Load, Play]
}

let game = new Phaser.Game(config);
let borderUISize = game.config.height/15;
let borderPadding = borderUISize/3;
