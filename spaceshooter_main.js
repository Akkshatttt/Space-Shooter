const canvas= document.getElementById("canvas");
const c= canvas.getContext('2d');
var display_score= document.querySelector(".user-score");


canvas.width= window.innerWidth;
canvas.height=window.innerHeight;
var player_score=0;
var bossMusic =new Audio(".gamesAudio/finalboss-placeholder.mp3");
var enemy_pop =new Audio(".gamesAudio/pop-sfx.mp3");



class Player{
	constructor(x,y,radius,color){
		this.x=x
		this.y=y
		this.radius=radius
		this.color=color
	}
	draw(){
		c.beginPath()
		c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
		c.fillStyle = this.color
		c.fill()
	}
}

class Hostiles{
	constructor(x,y,radius,color,velocity){
		this.x=x
		this.y=y
		this.radius=radius
		this.color=color
		this.velocity=velocity
	}
	draw(){
		c.beginPath()
		c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
		c.fillStyle = this.color
		c.fill()
	}

	update(){
		this.x= this.x + this.velocity.x
		this.y= this.y + this.velocity.y
	}
}

class Projectile{
	constructor(x,y,radius,color,velocity){
		this.x=x
		this.y=y
		this.radius=radius
		this.color=color
		this.velocity=velocity
	}
	draw(){
		c.beginPath()
		c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
		c.fillStyle = this.color
		c.fill()
	}

	update(){
		this.x= this.x + this.velocity.x
		this.y= this.y + this.velocity.y
	}
}

const x= canvas.width/2;
const y= canvas.height/2;

const player1= new Player(x,y,30,'#D6DAE1');
const projectiles =[];
const hostileEntities=[];
var hostileEntitiesSpawnRate=Math.floor(Math.random()*500)+700;
	

function hostileEntitySpawnEvent(){
	setInterval(()=>{
		const radius=Math.floor(Math.random()*40)+5;
		const x=(Math.random()*canvas.width)+55;
		const y=(Math.random()*canvas.height)+55;
		const color='red'

		const angle= Math.atan2(canvas.height/2-y, canvas.width/2-x)
	    const velocity={
		    x:Math.cos(angle),
		    y:Math.sin(angle)
	   }

	hostileEntities.push(
		new Hostiles(x, y, radius, color, velocity)
		)
    },hostileEntitiesSpawnRate)
}

function bossMusicPlayEvent(){
	bossMusic.loop=true;
	bossMusic.play();
}

function hostileEntityPOPevent(){
	enemy_pop.play();
}

function gameENDalert(){
	if (confirm("YOU LOST!! Do you want to return to the hub? (press 'cancel' to continue playing)")) {
		window.location.replace("../../gamingland.html");
    } 
    else{
    	window.location.reload();
  }
}

let animationID

function animate(){
	animationID=requestAnimationFrame(animate)
	c.fillStyle='rgba(18,18,18,0.2)'
	c.fillRect(0,0,canvas.width,canvas.height)
	projectiles.forEach((projectile, projectileIndex)=>{
		projectile.update();
		projectile.draw();



		if (projectile.x + projectile.radius <0 ||
			projectile.x - projectile.radius>canvas.width ||
			projectile.y + projectile.radius <0 ||
			projectile.y - projectile.radius>canvas.height){
           		setTimeout(()=>{
           		projectiles.splice(projectileIndex,1);
           	    },0);
           	    console.log("projectile terminated[*crossed_boundries*]");
           	}


	})
    hostileEntities.forEach((enemy, enemyIndex) =>{
		enemy.update();
		enemy.draw();
		const playerEnemyDistance = Math.hypot(
           	player1.x-enemy.x,
           	player1.y-enemy.y)

			if (playerEnemyDistance - enemy.radius - player1.radius <1){
				cancelAnimationFrame(animationID);
				bossMusic.pause();
				gameENDalert();
				
			}


           projectiles.forEach((projectile, projectileIndex)=>{
           	const projectileEnemyDistance = Math.hypot(
           		projectile.x-enemy.x,
           		projectile.y-enemy.y)

           	if (projectileEnemyDistance - enemy.radius - projectile.radius <1){
           		if (enemy.radius-projectile.radius >= 10){
           			enemy.radius-=projectile.radius;
           			setTimeout(()=>{
           		     projectiles.splice(projectileIndex,1);
           	        },0);
           		}
                else{
           		setTimeout(()=>{
           		 hostileEntities.splice(enemyIndex,1);
           		 projectiles.splice(projectileIndex,1);
           		 hostileEntityPOPevent();
           	    },0);

           	    }
           	    player_score+=50;
           	    display_score.innerHTML=player_score;
           	    console.log("the player earned",player_score)
           	}
        })
	})

	player1.draw();
}


addEventListener('click',(event)=>
{
	const angle= Math.atan2(
		event.clientY-canvas.height/2,
		event.clientX-canvas.width/2
	)

	const velocity = {
		x:Math.cos(angle)*25,
		y:Math.sin(angle)*25
	}

	projectiles.push(
	    new Projectile(canvas.width/2,canvas.height/2,15,'purple',velocity)
    )
});


bossMusicPlayEvent();
animate();
hostileEntitySpawnEvent();


