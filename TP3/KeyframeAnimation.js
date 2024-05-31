class KeyFrameAnimation extends Animation{
    constructor(scene, id, matrix){
        super(scene, id);

        this.keyframes = [];
        this.keyframeIndex = 0;
        this.startedMoving = false;
        if(matrix == null)
            matrix = mat4.create();
        this.transformationMatrix = matrix;
    }

    addKeyframe(keyframe){
        if (this.keyframes.length > 0){
            let lastKeyframe = this.keyframes[this.keyframes.length-1];
            if (keyframe.instant < lastKeyframe.instant){
                console.log("Instance error while adding a Keyframe");
                return;
            }
            
        }
        this.keyframes.push(keyframe);
    }

    interpolate(iT, nT, p){
        return iT + (nT - iT) * p;
    }

    update(t){
        if (this.startTime == null) {
            this.startTime = t;
        }

        if (this.keyframeIndex == this.keyframes.length - 1){    //Check last keyframe
            return;
        }

        this.currentTime = (t - this.startTime)/1000;

        if (this.keyframes[0].instant <= this.currentTime){
            this.startedMoving = true;
        }
        
        if (this.currentTime >= this.keyframes[this.keyframeIndex+1].instant){
            this.keyframeIndex++;
        }

        let currentKeyframe = this.keyframes[this.keyframeIndex];
        let nextKeyframe = this.keyframes[this.keyframeIndex+1];

        //When the keyframe is the last the animation ends
        if (this.keyframeIndex == this.keyframes.length - 1) {
            this.transformationMatrix = mat4.create();
            mat4.translate(this.transformationMatrix, this.transformationMatrix, currentKeyframe.translation);
            mat4.rotateX(this.transformationMatrix, this.transformationMatrix, currentKeyframe.rotation[0]);
            mat4.rotateY(this.transformationMatrix, this.transformationMatrix, currentKeyframe.rotation[1]);
            mat4.rotateZ(this.transformationMatrix, this.transformationMatrix, currentKeyframe.rotation[2]);
            mat4.scale(this.transformationMatrix, this.transformationMatrix, currentKeyframe.scale);
            return;
        }
    
        
        const perc = (this.currentTime - currentKeyframe.instant)/(nextKeyframe.instant - currentKeyframe.instant); 

        //Translation
        let translationX = this.interpolate(currentKeyframe.translation[0], nextKeyframe.translation[0], perc);
        let translationY = this.interpolate(currentKeyframe.translation[1], nextKeyframe.translation[1], perc);
        let translationZ = this.interpolate(currentKeyframe.translation[2], nextKeyframe.translation[2], perc);

        //Rotation
        let rotationX = this.interpolate(currentKeyframe.rotation[0], nextKeyframe.rotation[0], perc);
        let rotationY = this.interpolate(currentKeyframe.rotation[1], nextKeyframe.rotation[1], perc);
        let rotationZ = this.interpolate(currentKeyframe.rotation[2], nextKeyframe.rotation[2], perc);


        //Scale
        let scaleX = this.interpolate(currentKeyframe.scale[0], nextKeyframe.scale[0], perc);
        let scaleY = this.interpolate(currentKeyframe.scale[1], nextKeyframe.scale[1], perc);
        let scaleZ = this.interpolate(currentKeyframe.scale[2], nextKeyframe.scale[2], perc);


        //Transformation Matrix
        this.transformationMatrix = mat4.create();
        mat4.translate(this.transformationMatrix, this.transformationMatrix, [translationX,translationY,translationZ]);
        mat4.rotateX(this.transformationMatrix, this.transformationMatrix, rotationX);
        mat4.rotateY(this.transformationMatrix, this.transformationMatrix, rotationY);
        mat4.rotateZ(this.transformationMatrix, this.transformationMatrix, rotationZ);
        mat4.scale(this.transformationMatrix, this.transformationMatrix, [scaleX,scaleY,scaleZ]);

    }

    apply() {
        this.scene.multMatrix(this.transformationMatrix);
    }
}
