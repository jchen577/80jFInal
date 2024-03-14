class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame) // call Sprite parent class
        scene.add.existing(this)           // add Player to existing scene
        scene.physics.add.existing(this)   // add physics body to scene

        //set player values
        this.direction = new Phaser.Math.Vector2(0)
        this.velocityS = 100;
        this.lvl = 1;
        this.exp = 0;
        this.expToNextLvl = Math.floor(Math.pow(this.lvl/0.5,2));

    }
}
class IdleState extends State {//Player idle state
    enter(scene, hero) {
        if(scene.input.keyboard.enabled == true){
            hero.body.setVelocity(0);
            hero.anims.stop();
        }
    }

    execute(scene,hero){
        scene.swordHitbox.body.x = -100;
        scene.swordHitbox2.body.x = -100;
        const { left, right, up, down} = scene.keys;
        //transition to new states
        if(left.isDown || right.isDown || up.isDown || down.isDown ) {
            this.stateMachine.transition('move');
            return;
        }

        scene.input.on('pointerdown', function (pointer)
        {
            this.stateMachine.transition('swing');
        }, this);
    }


}

class MoveState extends State {
    execute(scene,hero){
        const { left, right, up, down, shift} = scene.keys;
        
        scene.swordHitbox.body.x = -100;
        scene.swordHitbox2.body.x = -100;
        let direction = new Phaser.Math.Vector2(0);
        //Character movement
        if(!(left.isDown || right.isDown || up.isDown|| down.isDown)) {
            this.stateMachine.transition('idle');
            return;
        }

        if(up.isDown || down.isDown){
            if(up.isDown) {
                //hero.setFlip(true, false);
                hero.direction.y = -1;
            }
            else if(down.isDown){
                hero.direction.y = 1;
            }
            hero.direction.normalize();
            hero.body.setVelocityY(hero.velocityS * hero.direction.y);
            if(!(left.isDown || right.isDown)){
                if(hero.direction.y < 0){
                    hero.anims.play(`walkUp`, true);
                }
                else{
                    hero.anims.play(`walkD`, true);
                }
            }
        }
        else{
            hero.setVelocityY(0);
            hero.direction.y = 0;
        }
        
        if(left.isDown || right.isDown){

            if(left.isDown) {
                hero.setFlip(true, false);
                hero.direction.x = -1;
            } else if(right.isDown) {
                hero.resetFlip();
                hero.direction.x = 1;
            }
            hero.direction.normalize();
            hero.body.setVelocityX(hero.velocityS * hero.direction.x);
            hero.anims.play(`walkR`, true);
        }
        else{
            hero.setVelocityX(0);
            hero.direction.x = 0;
        }


    }
}

class IdleSwingState extends State{
    execute(scene,hero){
        if(hero.direction.y > 0){//If player is facing down
            scene.swordHitbox2.body.x = hero.x-26;
            scene.swordHitbox2.body.y = hero.y+30;
            hero.anims.play(`swingDown`, true);
        }
        else if(hero.direction.y < 0){//If player is facing up
            scene.swordHitbox2.body.x = hero.x-32;
            scene.swordHitbox2.body.y = hero.y-20;
            hero.anims.play(`swingUp`, true);
        }
        else{//Move hitbox accordingly to direction
            if(hero.direction.x >=0){
                scene.swordHitbox.body.x = hero.x+10;
            }
            else{
                scene.swordHitbox.body.x = hero.x-50;
            }
            scene.swordHitbox.body.y = hero.y;
            hero.anims.play(`swingR`, true);
        }
        hero.once('animationcomplete', () => {

            this.stateMachine.transition('idle');
        })
        return; 
    }
}

class hurtState extends State{
    execute(scene,hero){
        hero.setVelocityX(-100 * hero.direction.x);
        hero.setVelocityX(-100 * hero.direction.x);
    }
}