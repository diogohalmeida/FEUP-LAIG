class MySpriteSheet {

    constructor(scene, texture, sizeM, sizeN){
        this.scene = scene;
        this.texture = new CGFtexture(this.scene,texture);
        this.sizeM = sizeM;
        this.sizeN = sizeN;
        this.shader = new CGFshader(this.scene.gl, "./shaders/sprite.vert", "./shaders/sprite.frag");
        this.shader.setUniformsValues({uSampler: 0});
        this.shader.setUniformsValues({spriteSheetSize: [1/this.sizeM, 1/this.sizeN]});
    }

    activateCellMN(m, n){
        this.shader.setUniformsValues({selectedSprite: [m, n]});
    }


    activateCellP(p){
        var column = Math.floor(p % this.sizeM);    //new m
        var row = Math.floor(p / this.sizeN);   //new n

        this.shader.setUniformsValues({selectedSprite: [column, row]});
    }

    update(t){}

}