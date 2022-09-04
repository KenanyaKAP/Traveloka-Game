window.addEventListener('load', function() {
//Base screen construction
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const losepanel = document.querySelector('#lose');
const restart_bt = losepanel.querySelector('#button img:nth-child(1)');
const to_stage_bt = losepanel.querySelector('#button img:nth-child(2)');
//import assset
const player_img = new Image();
player_img.src = "img/Player_Plane.png";
const bg_layer1 = new Image();
bg_layer1.src = "img/RajaAmpat_Layer_1.png";
const bg_layer2 = new Image();
bg_layer2.src = "img/RajaAmpat_Layer_2.png";
const bg_layer3 = new Image();
bg_layer3.src = "img/RajaAmpat_Layer_3.png";
const bg_layer4 = new Image();
bg_layer4.src = "img/RajaAmpat_Layer_4.png";
const bird = new Image();
bird.src = "img/bird.png";
const enemy_plane = new Image();
enemy_plane.src = "img/Enemy_2.png";
const cloud = new Image();
cloud.src = "img/Cloud_4.png";
const kite = new Image();
kite.src= "img/Kite.png";
const explode = new Audio('Explode.mp3');
const bgm = new Audio('BGM.mp3');

//player and object classes
class Game{
    constructor(){
        this.enemies = [];
        this.enemyInterval = 800;
        this.enemyTimer = 0;
        this.enemyTypes = ['bird', 'plane', 'cloud', 'kite'];
        this.#addNewEnemy();
    }
    restart(){
        this.enemies = [];
        this.enemyTimer = 0;
    }
    update(deltaTime){
        this.enemies = this.enemies.filter(object => !object.deleteFlag);
        if(this.enemyTimer > this.enemyInterval){
            this.#addNewEnemy();
            console.log(this.enemies);
            this.enemyTimer=0;
        }else{
            this.enemyTimer+=deltaTime;
        }        
        this.enemies.forEach(object => object.update());
    }
    draw(){
        this.enemies.forEach(object => object.draw());
    }
    #addNewEnemy(){
        const enemyRand = this.enemyTypes[Math.round(Math.random()*this.enemyTypes.length)];
        if(enemyRand == 'bird'){this.enemies.push(new Birdy(this))}
        else if(enemyRand == 'plane'){this.enemies.push(new EnemyPlane(this))}
        else if(enemyRand == 'cloud'){this.enemies.push(new Cloud(this))}
        else if(enemyRand == 'kite'){this.enemies.push(new Kite(this))}
        this.enemies.sort(function(a,b){
            return a._y - b._y;
        });
    }
}

class Player{
    constructor(){
        this.x= 0;
        this.y= canvas.height/2;
        this.image= player_img;
        this.hitbox = {
            width: 75,
            height: 35
        };
    }
    restart(){
        this.x= 0;
        this.y= canvas.height/2;
    }
    draw() {
        ctx.drawImage(this.image,this.x,this.y,75,35);
    }
    update(){
        this.draw();
    }
    move(val){
        let yDiff = Math.abs(this.y - val);
        if(val < this.y && (this.y - yDiff)>100)this.y -= yDiff;
        else if(val > this.y && (this.y + yDiff)<canvas.height-100)this.y += yDiff;
    }
}

class Background{
    constructor(x,y,image,image2,speed,width,height){
        this.x = x;
        this.x2 = width; 
        this.y = y;
        this.image2 = image2;
        this.image = image;
        this.speed = speed;
        this.width = width;
        this.height = height;
    }
    restart(){
        this.x = 0;
        this.x2 = this.width;
    }
    draw(){
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image2,this.x2,this.y,this.width,this.height);
    }
    update(){
        this.draw();
        if(this.x < -this.width) this.x = this.width + this.x2 - this.speed;
        else this.x -= this.speed;
        if(this.x2 < -this.width) this.x2 = this.width + this.x - this.speed;
        else this.x2 -= this.speed;
    }
}

class Enemy{
    constructor(){
        this._x = canvas.width;
        this._y = ((Math.random() * 600) + 100);
        this.deleteFlag = false; 
    }
    update(){
        this._x -= this.speed;
        if (this._x < 0 - this.width){
            this.deleteFlag = true;
        }
    }    
}

class Birdy extends Enemy{
    constructor(){
        super();        
        this.speed = 2.4;
        this.width = 60;
        this.height = 60;
        this.image = bird;
        this.hitbox = {
            x: this._x+20,
            y: this._y+20,
            width: this.width/2,
            height: this.height/2,
        }
    }
    draw(){
        ctx.drawImage(this.image,this._x, this._y, this.width, this.height);
    }
    update(){
        super.update();
        this.hitbox.x -=this.speed;
    }
}

class EnemyPlane extends Enemy{
    constructor(){
        super();        
        this.speed = 4;
        this.image = enemy_plane;
        this.width = this.image.width/10;
        this.height = this.image.height/10;
        this.hitbox = {
            x: this._x+5,
            y: this._y+35,
            width: this.width,
            height: this.height/4.2
        }
    }
    draw(){
        ctx.drawImage(this.image,this._x, this._y, this.width, this.height);
    }
    update(){
        super.update();
        this.hitbox.x -=this.speed;
    }
}

class Cloud extends Enemy{
    constructor(){
        super();        
        this.speed = 1;
        this.image = cloud;
        this.width = this.image.width/4;
        this.height = this.image.height/4;
        this.hitbox = {
            x: this._x+40,
            y: this._y+10,
            width: this.width-100,
            height: this.height-20,
        }
    }
    draw(){
        ctx.drawImage(this.image,this._x, this._y, this.width, this.height);
    }
    update(){
        super.update();
        this.hitbox.x -=this.speed;
    }
}

class Kite extends Enemy{
    constructor(){
        super();        
        this.speed = 4;
        this.image = kite;
        this.width = 60;
        this.height = 60;
        this.hitbox = {
            x: this._x,
            y: this._y,
            width: this.width,
            height: 30,
        }
    }
    draw(){
        ctx.drawImage(this.image,this._x, this._y, this.width, this.height);
    }
    update(){
        super.update();
        this.hitbox.x -=this.speed;
    }
}

function gameScore(){
    this.width= canvas.width/5;
    this.height= canvas.height/8;
    this.x = canvas.width-100;
    this.y = 20;
    this.intervaltime = 200;
    this.timecur = 0;
    this.font = canvas.style.fontFamily;
    this.scoresum = 0;
    this.update = function(deltaTime){
        ctx.font ="100px" + " " + this.font;
        ctx.fillStyle = "black";
        ctx.fillText(this.text, this.x,this.y,this.width,this.height);
        if(this.timecur > this.intervaltime){
            this.timecur=0;
            this.scoresum++;
        }else{
            this.timecur+=deltaTime;
        } 
    }
    this.restart = function(){
        this.scoresum = 0;
        this.timecur =0;
    }
}

//player and bg initialization
const game = new Game();
const player = new Player();
const layer1 = new Background(0,0,bg_layer1,bg_layer1,2,1080,canvas.height);
const layer2 = new Background(0,canvas.height-230,bg_layer3,bg_layer3,1,1080,200);
const layer4 = new Background(0,canvas.height-400,bg_layer4,bg_layer4,1,1080,400);
const layer3 = new Background(0,canvas.height-350,bg_layer2,bg_layer2,0.5,1080,300);
const Backgrounds = [layer1, layer3, layer4,layer2];
const score = new gameScore();
let gameOver = false;
let lastTime = 1;
function animate(timeStamp){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        Backgrounds.forEach(objects => {
        objects.update();
        bgm.play();
        });
        let reqAnim = true;
        if(!gameOver){
            player.update();
            game.update(deltaTime);
            game.draw();
            score.text = "SCORE: " + score.scoresum;
            score.update(deltaTime);
            game.enemies.forEach(enemy =>{
            if(player.x < enemy.hitbox.x + enemy.hitbox.width &&
                player.x + player.hitbox.width > enemy.hitbox.x &&
                player.y < enemy.hitbox.y + enemy.hitbox.height &&
                player.y + player.hitbox.height > enemy.hitbox.y){
                console.log(enemy._y)
                console.log("HITTTT!!");
                reqAnim =  false;
                explode.play();
                return;
            }
        });
        }
    if(reqAnim){
        requestAnimationFrame(animate);
    }else{
        losepanel.querySelector('h1').innerHTML = score.scoresum;
        console.log("You Lose!");
        losepanel.style.display='flex';
    }

}

animate(0);
canvas.addEventListener('touchstart', ()=>{
    console.log('touchstart');
});
canvas.addEventListener('touchmove', (e)=>{
    let val = e.changedTouches[0].clientY;
    player.move(val);
});
canvas.addEventListener('touchend', ()=>{
    console.log('end');   
})
restart_bt.addEventListener('click', function(){
    losepanel.style.display='none';
    lastTime = 1;
    restart();
});
to_stage_bt.addEventListener('click', function(){
    window.location.href = "Stages.html";
});
function restart(){
    game.restart();
    player.restart();
    Backgrounds.forEach(bg =>{
        bg.restart();
    });
    score.restart();
    animate(0);}
});