class Load extends Phaser.Scene{
    constructor(){
        super("loadScene");
    }
    preload(){
        this.load.spritesheet('playerS','./sprites/characters/player.png',{frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('slimeS','./sprites/characters/slime.png',{frameWidth: 32, frameHeight: 32});
        this.load.bitmapFont('gem_font', './sprites/gem.png', './sprites/gem.xml');
        this.load.tilemapTiledJSON('tilemap','./sprites/map.tmj');
        this.load.image('baseTiles','./sprites/spritesheet.png ');
    }

    create(){
        this.anims.create({ 
            key: 'walkR', 
            frames: this.anims.generateFrameNumbers('playerS',{
                start: 24,
                end: 29,
            }), 
            frameRate: 12,
            repeat: -1 
        });
        this.anims.create({ 
            key: 'walkUp', 
            frames: this.anims.generateFrameNumbers('playerS',{
                start: 30,
                end: 35,
            }), 
            frameRate: 12,
            repeat: -1 
        });
        this.anims.create({ 
            key: 'walkD', 
            frames: this.anims.generateFrameNumbers('playerS',{
                start: 18,
                end: 23,
            }), 
            frameRate: 12,
            repeat: -1 
        });
        this.anims.create({ 
            key: 'swingR', 
            frames: this.anims.generateFrameNumbers('playerS',{
                start: 42,
                end: 45,
            }), 
            frameRate: 12,
            repeat: 0 
        });
        this.anims.create({ 
            key: 'swingDown', 
            frames: this.anims.generateFrameNumbers('playerS',{
                start: 36,
                end: 39,
            }), 
            frameRate: 12,
            repeat: 0 
        });
        this.anims.create({ 
            key: 'swingUp', 
            frames: this.anims.generateFrameNumbers('playerS',{
                start: 48,
                end: 51,
            }), 
            frameRate: 12,
            repeat: 0 
        });
        this.anims.create({
            key: 'slimeIdle', 
            frames: this.anims.generateFrameNumbers('slimeS',{
                start: 0,
                end: 3,
            }), 
            frameRate: 8,
            repeat: -1
        });
        this.scene.start('playScene');
    }

    update(){
    }
}