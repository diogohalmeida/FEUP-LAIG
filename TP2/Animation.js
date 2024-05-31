class Animation{
    constructor(scene, id){
        if(this.constructor === Animation){     //Abstract class
            throw new Error("Abstract class Animation can't be instantiated.");
        }

        this.scene = scene;
        this.id = id;
        this.transformationMatrix = mat4.create();
        this.startTime = null;
    }

    update(t){
        throw new Error("Method 'update()' must be implemented.");
    }

    apply(){
        throw new Error("Method 'apply()' must be implemented.");
    }

}