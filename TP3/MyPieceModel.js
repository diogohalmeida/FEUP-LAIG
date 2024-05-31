class MyPieceModel extends CGFobject {
    constructor(scene) {
        super(scene);
        this.body = new MyCylinder(this.scene,64,64,0.25,0.25,0.2);
        this.topBarrel = new DefBarrel(this.scene,0.1,0.01,0.1,64,64);
        this.topBarrelInverse = new DefBarrel(this.scene,0.1,0.01,0.1,64,64);
        this.top = new MySphere(this.scene, 64,64, 0.115);
        this.topRing = new MyTorus(this.scene, 0.02, 0.25, 64,64);
        this.middleRing = new MyTorus(this.scene, 0.02, 0.25, 64,64);

        this.animation = null;
        
        this.tile = null;
    }

    display() {
        this.scene.pushMatrix();
        this.body.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,-0.1);
        this.topBarrel.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,0);
        this.scene.scale(-1.0,-1.0,-1.0);
        this.topBarrelInverse.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0,0,-0.15);
        this.top.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(1.0,1.0,0.5);
        this.scene.translate(0,0,0);
        this.topRing.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(1.0,1.0,0.5);
        this.scene.translate(0,0,0.2);
        this.middleRing.display();
        this.scene.popMatrix();
    }
}