class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }
    preload(){
    }

    create(){
        this.mobSpeed = 50;

        const map = this.make.tilemap({key:'tilemap'});//Tilemap
        const tileset = map.addTilesetImage('tiles','baseTiles');
        const Layer1 = map.createLayer('Tile Layer 1',tileset);
        const Layer2 = map.createLayer('Tile Layer 2',tileset);

        this.enemyS = map.findObject('Object Layer 1',obj => obj.name === 'spawn1');
        this.mobs = this.add.group();

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.swordHitbox = this.add.rectangle(0,0,48,64,0xffffff);
        this.physics.add.existing(this.swordHitbox);
        this.swordHitbox.setAlpha(0);
        this.swordHitbox2 = this.add.rectangle(0,0,64,48,0xffffff);
        this.physics.add.existing(this.swordHitbox2);
        this.swordHitbox2.setAlpha(0);

        this.keys = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D',});

        this.player = new Player(this,300,300,'playerS').setScale(3,3);//Create player
        this.player.setSize(14,16);
        this.player.setOffset(18,24);

        //Have camera track player
        this.player.body.setCollideWorldBounds(true);
        this.cameras.main.setBounds(0,0,map.widthInPixels,map.heightInPixels);
        this.cameras.main.startFollow(this.player,true,0.25,0.25);
        this.physics.world.setBounds(0,0,map.widthInPixels,map.heightInPixels);

        //Setup player statemachine
        this.playerFSM = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            swing: new IdleSwingState(),
            hurt: new hurtState(),
        }, [this, this.player]);
        this.player.body.allowGravity = false;
        this.player.body.setImmovable = false;
        Layer2.setCollisionByProperty({
            collisions: true,
        });
        this.physics.add.collider(this.player,Layer2);

        let slime = this.physics.add.sprite(this.enemyS.x,this.enemyS.y,'slimeS').setScale(3,3);
        slime.setSize(16,16);
        slime.anims.play('slimeIdle');
        slime.body.setCollideWorldBounds(true);
        slime.body.setImmovable();
        slime.hit = false;
        slime.hp = 3;
        slime.lastHit = this.time.now;
        slime.hitTimer = this.time.now;
        slime.lastSpeed = this.time.now;
        slime.currSpeed = this.time.now;
        this.mobs.add(slime);

        this.physics.add.overlap(this.swordHitbox,this.mobs,(sword,enemy)=>{//Collision on side swing
            if(enemy.lastHit > enemy.hitTimer +350){
                enemy.hitTimer = enemy.lastHit;
                enemy.hit = true;
                enemy.hp -= 1;
                if(enemy.hp <=0){
                    enemy.destroy();
                }
                else{
                    enemy.setTint(0xFF0000);
                    enemy.setVelocityY(500 * this.player.direction.y);
                    enemy.setVelocityX(500 * this.player.direction.x);
                    this.time.delayedCall(300, () => {
                        enemy.clearTint();
                        enemy.setVelocity(0);
                        enemy.hit = false;
                    })
                }
            }
            enemy.lastHit = this.time.now;
        });
        this.physics.add.overlap(this.swordHitbox2,this.mobs,(sword,enemy)=>{//Collision on vertical swing
            if(enemy.lastHit > enemy.hitTimer +350){
                enemy.hitTimer = enemy.lastHit;
                enemy.hit = true;
                enemy.hp -= 1;
                if(enemy.hp <=0){
                    enemy.destroy();
                    this.currSpawns--;
                }
                else{
                    enemy.setTint(0xFF0000);
                    enemy.setVelocityY(500 * this.player.direction.y);
                    enemy.setVelocityX(500 * this.player.direction.x);
                    this.time.delayedCall(300, () => {
                        enemy.clearTint();
                        enemy.setVelocity(0);
                        enemy.hit = false;
                    })
                }
            }
            enemy.lastHit = this.time.now;
        });

        this.text = this.add.bitmapText(this.player.x-150,this.player.y-50,'gem_font',"This is the protagonist");
        this.text2 = this.add.bitmapText(-100,-100,'gem_font','Move the protagonist with WASD')
    }

    update(){
        this.playerFSM.step();
        if(this.player.x < 1000){
            this.text.setText("This is the protagonist");
            this.text2.setText("Move the protagonist with WASD");
            this.text2.setPosition(this.player.x- this.text2.width/2,this.player.y+50);
        }
        else if(this.player.x < 2200){
            this.text.setText("Protagonists are meant to explore the world");
            this.text2.setText("Driven by the grasp of the game");
            this.text2.setPosition(this.player.x- this.text2.width/2,this.player.y+50);
            //this.text2.setAlpha(0);
        }
        else if(this.player.x < 3000){
            this.text.setText("With challenges meant to test them");
            this.text2.setAlpha(0);
        }
        else{
            this.text.setText("And the ability to change the world");
            this.text2.setAlpha(1);
            this.text2.setText("...Or do nothing");
            this.text2.setPosition(this.player.x- this.text2.width/2,this.player.y+50);
        }
        this.text.setPosition(this.player.x- this.text.width/2,this.player.y-50);
        this.mobs.children.each(function(enemy) {//Mobs check distance from player and move accordingly
            if(!enemy.hit){
                if(Phaser.Math.Distance.BetweenPoints(enemy, this.player) < 300) {
                    // if player to left of enemy AND enemy moving to right (or not moving)
                    if (this.player.x < enemy.x && enemy.body.velocity.x >= 0) {
                        // move enemy to left
                        enemy.setVelocityX(-this.mobSpeed);
                    }
                    // if player to right of enemy AND enemy moving to left (or not moving)
                    else if (this.player.x > enemy.x && enemy.body.velocity.x <= 0) {
                        // move enemy to right
                        enemy.setVelocityX(this.mobSpeed);
                    }
                    if (this.player.y < enemy.y && enemy.body.velocity.y >= 0) {
                        // move enemy to left
                        enemy.setVelocityY(-this.mobSpeed);
                    }
                    // if player to right of enemy AND enemy moving to left (or not moving)
                    else if (this.player.y > enemy.y && enemy.body.velocity.y <= 0) {
                        // move enemy to right
                        enemy.setVelocityY(this.mobSpeed);
                    }
                }
            }
        }, this);
    }
}
