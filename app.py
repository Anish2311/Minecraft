from p5 import *
from noise import pnoise2
import random

blocks = []
moveX = True
moveY = True
flag = True
flagZ = True

def setup():
    size(600,600)
    global blocks
    for i in range(70):
        blocks.append([])
        for j in range(70):
            l = int(3 + (3 * pnoise2(i/20, j/20, octaves=1, persistence=0.5, lacunarity=2.0, repeatx=1024, repeaty=1024, base=25)))
            # print(l)
            for k in range(l):
                blocks[i].append(Block((i-35)*100,(k-3)*100,(j-35)*100))
                # print(blocks)
    

    

class Camera:
    def __init__(self,x,y,z):
        self.pos = Vector(x,y,z)
        self.vel = Vector(0,0,0)
        self.acc = Vector(0,-2.5,0)

    def update(self):
        global moveY
        if moveY:
            self.vel += self.acc
        else:
            self.vel.y = 0
            moveY = True
        self.pos += self.vel
        # print(self.pos)

        
cam = Camera(0,0,0)

def draw():
    global moveX
    global moveZ
    global flagZ
    background(0)
    translate(0,0,0)
    # lights()
    point_light(255,255,255,0,0,1000)
    # light_specular(100,255,100)
    # ambient_light(100,100,250)
    # light_falloff(1,1,1)
    sphere(25)
    global blocks
    global flag
    flag = True
    flagZ = True
    for j in blocks:
        for k in j:
            k.show()
            # k.colliding()
    if flag:
        moveX = True
    if flagZ:
        moveZ = True
    cam.vel.x = 0
    cam.vel.z = 0



    if key_is_pressed and key == 'a' and moveX:
        # print('A')
        cam.vel.x = -15
    if key_is_pressed and key == 'd' and moveX:
        cam.vel.x = 15
        # print(moveX)
    if key_is_pressed and key == 'w' and moveZ:
        cam.vel.z = -15
    if key_is_pressed and key == 's' and moveZ:
        cam.vel.z = 15

    cam.update()

class Block:
    def __init__(self,x,y,z):
        self.pos = Vector(x,y,z)

    def show(self):
        global cam
        global moveX
        global moveY
        global moveZ
        global flagZ
        global flag
        # self.pos -= cam.pos
        dis = self.pos - cam.pos
        if dis.mag() < 300:
            with push_matrix():
                translate(self.pos.x - cam.pos.x,self.pos.y - cam.pos.y,self.pos.z - cam.pos.z)
                no_stroke()
                blinn_phong_material()
                fill(100,255,100)
                box(100, 100, 100)
            
            if abs(self.pos.y - cam.pos.y) < 100 and self.pos.z - cam.pos.z > -100 and self.pos.z - cam.pos.z < 100 and self.pos.x - cam.pos.x < 100 and self.pos.x - cam.pos.x > -100:
                moveY = False
            if self.pos.y - cam.pos.y < 50 and self.pos.z - cam.pos.z > -100 and self.pos.z - cam.pos.z < 100 and self.pos.y - cam.pos.y > -50 and abs(self.pos.x - cam.pos.x) < 150:
                moveX = False
                flag = False
            if self.pos.y - cam.pos.y < 50 and self.pos.x - cam.pos.x > -50 and self.pos.x - cam.pos.x < 50 and self.pos.y - cam.pos.y > -50 and abs(self.pos.z - cam.pos.z) < 150:
                moveZ = False
                flagZ = False

            
                

def mouse_pressed():
    global moveY
    moveY = True
    cam.vel.y = 25
    cam.update()

if __name__ == '__main__':
    run(mode='P3D')
