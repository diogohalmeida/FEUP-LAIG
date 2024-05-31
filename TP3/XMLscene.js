/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();
        this.xmlScenes = [];
        this.loadedScenes = 0;
        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(20);

        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress=0;

        this.defaultAppearance=new CGFappearance(this);

        this.cameraIDs = {'Default Camera': 0};
        this.cameras = [this.camera];
        this.selectedCamera = 0;
        this.defaultCameraId;
        this.numLights = 0;
        this.displayAxis = true;
        this.gameModes = {
            'Player vs Player' : 0,
            'Player vs Pc' : 1,
            'Pc vs Pc' : 2
        };
        this.botLevels = {
            'Easy' : 0,
            'Hard' : 1,
        };

        this.turnTime = 65;
        this.botLevel = 0;
        this.gameModeSelected = 0;
        this.animatePiecesOut = false;
        this.animating = false;
        this.moviePlaying = false;
        this.undoActive = false;


        this.start = function(){
            this.gameOrchestrator.gameStarted = false;
            this.gameOrchestrator.restart();
        }
        

        this.movie = function(){
            if (!this.moviePlaying && !this.animating && !this.animatePiecesOut){
                if(!this.animating && this.gameOrchestrator.gameSequence.moves.length > 0){
                    //this.animating = true;
                    this.moviePlaying = true;
                    this.gameOrchestrator.movie();
                    //Reset the score board on click
                    this.gameOrchestrator.animator.updateScoreBoard();
                }
            }
        }


        this.undo = function(){
            if (!this.moviePlaying && !this.animating && !this.animatePiecesOut && this.gameModeSelected != 2){
                this.gameOrchestrator.undo();
            }
        }

        this.animateCameraRotation = false;
        this.angle = 0;

        this.gameOrchestrator = new MyGameOrchestrator(this);

        //enable picking
        this.setPickEnabled(true);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);

                if (graphLight[0]){
                    this.lights[i].enable();
                }
                else{
                    this.lights[i].disable();
                }

                this.lights[i].update();

                i++;
            }
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.loadedScenes++;
        if (this.loadedScenes == 2){
            this.allGraphsLoaded();
        }
    }

    allGraphsLoaded(){
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();

        this.interface.removeFolder("Lights");

        this.camera = this.cameras[this.cameraIDs["Player Camera"]];
        this.defaultCameraId = this.cameraIDs["Player Camera"];
        this.selectedCamera = this.defaultCameraId;
        

        this.interface.gui.add(this,'selectedCamera',this.cameraIDs).name('Select Camera').onChange(this.updateActiveCamera.bind(this));

        
        var folder = this.interface.gui.addFolder('Lights');
        for(var i = 0; i < this.numLights; i++) {
            folder.add(this.lights[i], 'enabled')
            .name("Light: " + i);
        }

        this.sceneInited = true;

        this.gameOrchestrator.graph = this.xmlScenes[1];
    }

    updateActiveCamera(){
        this.camera = this.cameras[this.selectedCamera];
        //this.interface.setActiveCamera(this.camera);
    }

    update(t) {
        for(var i=0; i<this.graph.animationsIDs.length; i++) {
            this.graph.animations[this.graph.animationsIDs[i]].update(t);
        }
        for (var i = 0; i < this.graph.spriteAnimationsIDs.length; i++) {
            if (this.graph.spriteAnimationsIDs[i] == "confetti"){
                if (this.gameOrchestrator.state == 2){
                    this.graph.spriteAnimations[this.graph.spriteAnimationsIDs[i]].update(t);
                }
            }
            else{
                this.graph.spriteAnimations[this.graph.spriteAnimationsIDs[i]].update(t);
            }
        }
        if (!this.gameOrchestrator.madeMove && this.gameOrchestrator.gameStarted && this.gameOrchestrator.state != 2 && !this.moviePlaying && this.gameModeSelected == 0){
            if (this.gameOrchestrator.startTime == 0){
                this.gameOrchestrator.startTime = t;
                
            }
            else{
                var timeGone = Math.floor((t - this.gameOrchestrator.startTime)/1000);
                if (timeGone != this.gameOrchestrator.timePassed){
                    this.gameOrchestrator.timePassed = Math.floor((t - this.gameOrchestrator.startTime)/1000);
                    if (this.gameOrchestrator.graph != null){
                        var timeLeft = this.gameOrchestrator.timeTurn - this.gameOrchestrator.timePassed;
                        if (timeLeft >= 0){
                            if (timeLeft < 10){
                                this.gameOrchestrator.graph.nodes["timeCounterText"].leaves[0].text = "0" + timeLeft.toString();
                                if (timeLeft == 0){
                                    this.gameOrchestrator.changeTurn();
                                    this.animateCameraRotation = true;
				                    this.gameOrchestrator.animator.updateScoreBoard();
                                }
                            }
                            else{
                                this.gameOrchestrator.graph.nodes["timeCounterText"].leaves[0].text = timeLeft.toString();
                            }
                        }
                        else{
                            this.gameOrchestrator.graph.nodes["timeCounterText"].leaves[0].text = "0";
                        }
                    }
                }
            }
        }

        if(this.animating){
            this.gameOrchestrator.animator.update(t);
        }
        if(this.animateCameraRotation && this.gameModeSelected == 0 && !this.moviePlaying){
            this.cameras[this.defaultCameraId].orbit([0, 1, 0], Math.PI / 178);
            this.angle += Math.PI/178.0;
            if (this.angle >= Math.PI) {
                this.angle -= Math.PI;
                this.animateCameraRotation = false;
                if (this.gameOrchestrator.player == 1){
                    this.cameras[this.defaultCameraId].setPosition(vec3.fromValues(0, 10, 10));
                }
                else{
                    this.cameras[this.defaultCameraId].setPosition(vec3.fromValues(0, 10, -10));
                }
            }
        }
        if(this.animatePiecesOut){
            for (var i = 0; i < this.gameOrchestrator.animatorList.length; i++) {
                this.gameOrchestrator.animatorList[i].update(t);
            }
        }
        if(this.undoActive){
            for (var i = 0; i < this.gameOrchestrator.reverseAnimatorList.length; i++) {
                this.gameOrchestrator.reverseAnimatorList[i].update(t);
            }
        }
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        for (var i = 0; i < this.numLights; i++) {
            this.lights[i].setVisible(true);

            this.lights[i].update();            
        }

        if (this.sceneInited) {
            this.gameOrchestrator.graph.displayScene();
		    this.gameOrchestrator.gameBoard.display();
            if (this.gameOrchestrator.state != 2 && this.gameOrchestrator.gameStarted){
                this.gameOrchestrator.orchestrate();
                this.gameOrchestrator.managePick(false);
            }
            // Draw axis
            if(this.displayAxis)
                this.axis.display();
 
            this.defaultAppearance.apply();

            // Displays the scene (MySceneGraph function).
            if (this.gameOrchestrator.graph != null)
                this.gameOrchestrator.display();
        }
        else
        {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}