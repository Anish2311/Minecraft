new p5()

let blocks = []
let mobs = []
let moveR = true
let moveL = true
let moveY = false
let moveB = true
let moveF = true
let flagR = true
let flagL = true
let flagB = true
let flagF = true
let breaking = false
let minangle = HALF_PI
let depth = -6900
let zooming = false
let zoom = 400
let minzoom = 450
// let underWater = false
let moveVector = createVector(0,0,1)
let pointingVector = createVector(0,0,1)



class Camera{
    constructor(x,y,z){
        this.pos = createVector(x,y,z)
        this.vel = createVector(0,0,0)
        this.acc = createVector(0,2,0)
    }
    
    update(){
        if (moveY){
            this.vel.add(this.acc)
            // console.log('Yes');
            
        }
        else{
            this.vel.y = round(this.vel.y * -0.2)
            moveY = true
        }
        
        this.pos.add(this.vel)
    }
}

cam = new Camera(0,-10000,0)

class Block{
    constructor(x,y,z,i,j,k){
        this.pos = createVector(x,y,z)
        this.index = [i,j,k]
        this.life = 0.5
        this.death = null
        this.red = 100
        this.status = true
        this.wat = 1
        if(y > depth){
            this.wat = 0.5
        }
    }
    
    show(){
        if(this.status){
            // if (abs(this.pos.y - cam.pos.y )< 1000){
            push()
            translate(this.pos.x - cam.pos.x,this.pos.y - cam.pos.y, this.pos.z - cam.pos.z)
            noStroke()
            ambientMaterial(this.red*this.wat)
            // shininess(50)
            fill(100,100,100)
            box(100,100,100)
            pop()
            // }
        }
    }
    
    update(){
        if(this.status){

            // Character

            if (abs(this.pos.y - cam.pos.y) <= 100 && abs(this.pos.z - cam.pos.z) < 50 && abs(this.pos.x - cam.pos.x) < 50){
                moveY = false
                cam.pos.y -= 100 - abs(this.pos.y - cam.pos.y)
                // cam.pos.x += 100 - abs(this.pos.x - cam.pos.x)
            }
            let comp = p5.Vector.add(cam.pos,p5.Vector.mult(moveVector,20))
            if (abs(this.pos.y - cam.pos.y) < 50 && this.pos.dist(comp) < 50){
                moveF = false
                flagF = false
                
            }
            
            let check = p5.Vector.sub(cam.pos,this.pos)
            let angi = abs(check.angleBetween(p5.Vector.mult(pointingVector,-1)))

            if(angi < HALF_PI/3){
                if(check.mag() < 900 - zoom){
                    zooming = true
                    console.log('HE');
                }
                else{
                    minzoom = min(minzoom,check.mag())
                }
                
            }

            let ang = abs(check.angleBetween(p5.Vector.mult(pointingVector,5)))
            // console.log(ang,minangle);
            
            if(ang <= minangle && check.mag() < 200){
                minangle = ang
                // console.log(this.death,frameCount);
                if(breaking){
                
                    if(this.death == null){
                        this.death = frameCount
                    }
                    else{
                        if(frameCount - this.death >= this.life*30){
                            // console.log(this.death,frameCount);
                            blocks[this.index[0]][this.index[1]][this.index[2]] = undefined
                            this.status = false
                        }
                        else{
                            this.red += (frameCount-this.death)/4
                        }
                    }
                }
                else{
                    this.red = 150
                }
            }
            else{``
                this.death = null
                this.red = 100
            }

            // Mob

            mobs.forEach(e => {
                if (abs(this.pos.y - e.pos.y) <= 100 && abs(this.pos.z - e.pos.z) < 50 && abs(this.pos.x - e.pos.x) < 50){
                    e.moveY = false
                    e.pos.y -= 100 - abs(this.pos.y - e.pos.y)
                    // e.pos.x += 100 - abs(this.pos.x - e.pos.x)
                }
                let mcomp = p5.Vector.add(e.pos,p5.Vector.mult(e.vel,20))
                if (abs(this.pos.y - e.pos.y) < 50 && this.pos.dist(mcomp) < 50){
                    e.moveF = false
                }
            });
            
        }
        
    }
    
}

class Mob{
    constructor(h,x,y,z){
        this.health = h
        this.pos = createVector(x,y,z)
        this.vel = createVector(random(-5,5),0,random(-5,5))
        this.acc = createVector(0,2,0)
        this.moveF = true
        this.moveY = true
    }

    show(){
        push()
        translate(p5.Vector.sub(this.pos,cam.pos))
        noStroke()
        ambientMaterial(0,255,255)
        sphere(50)
        pop()
    }

    update(){
        let dir = p5.Vector.sub(cam.pos,this.pos)
        if(dir.mag() > 100 && dir.mag() < 600){
            this.vel.x = dir.x/dir.mag() * 3
            this.vel.z = dir.z/dir.mag() * 3
        }
        this.vel.add(this.acc)
        if(this.moveF){
            this.pos.x += this.vel.x
            this.pos.z += this.vel.z
        }
        else{
            this.vel.y = -25
            this.moveY = true
        }
        if(this.moveY){
            this.pos.y += this.vel.y
        }
        else{
            this.vel.y = 0
        }
    }
}

function setup(){
    createCanvas(window.innerWidth,window.innerHeight, WEBGL)
    for(let i = 0; i < 100; i++){
        blocks.push([])
        for(let j = 0; j < 100; j++){
            blocks[i].push([])
            let l = 50 + 50*noise(i/50,j/50)
            for (let k = 0; k < l; k++){
                blocks[i][j].push(new Block((i-25)*100,(k)*-100,(j-25)*100,i,j,k))
            }
        }
    }
    for(let i = 0; i< 5; i++){
        mobs.push(new Mob(10,random(-1000,1000),-10000,random(-1000,1000)))
    }
}

function checker(i,j,k){
    try{
        if(blocks[i-1][j][k] != undefined && blocks[i+1][j][k] != undefined && blocks[i][j-1][k] != undefined && blocks[i][j+1][k] != undefined && blocks[i][j][k-1] != undefined && blocks[i][j][k+1] != undefined){
            return false
        }
        return true
    }
    catch(error){
        // console.log('one');
        return true
    }
}

function draw(){
    noCursor();
    minzoom = 450
    translate(0,0,zoom);
    if(cam.pos.y > depth - 100){
        ambientLight(50,200,100)
        pointLight(20,150,100)
        background(50,150,200);
        cam.vel = p5.Vector.mult(cam.vel,0.5)
    }
    else{
        background(100,200,200);
        pointLight(50,255,250,0,0,700);
        ambientLight(100,200,100);
    }
    // push()
    // translate(0,-1000,0)
    // pointLight(255,255,255,0,0,0)
    // pop()
    ambientMaterial(0);
    noStroke();
    sphere(30.10);
    
    rotateY((mouseX / 100) * HALF_PI);
    rotate(((height / 2 - mouseY) / 100) * HALF_PI, p5.Vector.fromAngles(HALF_PI, HALF_PI - (mouseX / 100) * HALF_PI, 5));

    flagR = true;
    flagL = true;
    flagB = true;
    flagF = true;
    zooming = false;

    let camX = cam.pos.x;
    let camY = cam.pos.y;
    let camZ = cam.pos.z;

    let camI = floor(camX / 100) + 25;
    let camJ = floor(camZ / 100) + 25;

    let radiusXZ = 20;   
    let radiusY = 5;    
    minangle = HALF_PI/4
    for (let i = max(1, camI - radiusXZ); i < min(99, camI + radiusXZ); i++) {
        for (let j = max(1, camJ - radiusXZ); j < min(99, camJ + radiusXZ); j++) {
            blocks[i][j].forEach((block,k) => {
                
                if(block != undefined && checker(i,j,k)){
                    // let blockY = block.pos.y;
                    // if (abs(blockY - camY) < radiusY * 100) {   
                    // console.log(k);
                    block.show();
                    block.update();
                    // }
                    // noLoop()
                }
            });
        }
    }

    mobs.forEach(e => {
        e.update()
        e.show()
        e.moveY = true
        e.moveF = true
    });

    if(zooming){
        zoom += 50
        // console.log('HEHE');
        
    }
    else{
        if(zoom > 950 - minzoom) zoom -= 50;

    }
    if(flagR) moveR = true;
    if(flagL) moveL = true;
    if(flagB) moveB = true;
    if(flagF) moveF = true;

    if(keyIsDown(87) && moveF){
        cam.pos.add(moveVector);
    }

    if(keyIsPressed && key == ' '){
        if(cam.pos.y > depth - 100){
            moveY = true
            cam.vel.y -= 4
        }
        else if(cam.vel.y == 0){
            moveY = true;
            cam.vel.y = -25;
            cam.update();
        }
    }

    cam.update();
}



function mousePressed(){
    breaking = true
}

function mouseReleased(){
    breaking = false
}

function mouseMoved(){
    moveVector = p5.Vector.fromAngles(HALF_PI,PI - (mouseX/100)*HALF_PI,5)
    pointingVector = p5.Vector.fromAngles(3*HALF_PI + ((mouseY - height/2)/100)*HALF_PI,PI - (mouseX/100)*HALF_PI,1)
    // checking = true
    
    // console.log(moveVector);
}

