/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
        this.removeFolder = function(name) {
            var folder = this.gui.__folders[name];
            if (!folder) {
                return;
            }
            folder.close();
            this.gui.__ul.removeChild(folder.domElement.parentNode);
            delete this.gui.__folders[name];
            this.gui.onResize();
        }
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        //Checkbox element in GUI
        
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');
        // add a group of controls (and open/expand by defult)
        this.gameScene = 1;
        this.gameScenes = {
            'Room': 1,
            'Garden': 0,
        };

        this.initKeys();

        this.addGameOptions();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    addGameOptions() {
        const folder = this.gui.addFolder("Game Options");
        folder.open();
        folder.add(this, 'gameScene', this.gameScenes).name('Game Scene').onChange(this.scene.gameOrchestrator.changeTheme.bind(this.scene.gameOrchestrator));
        folder.add(this.scene, 'gameModeSelected', this.scene.gameModes).name('Game Mode');
        folder.add(this.scene, 'botLevel', this.scene.botLevels).name('Bot Difficulty');
        folder.add(this.scene, 'start').name('Start Game');
        folder.add(this.scene, 'undo').name('Undo');
        folder.add(this.scene, 'movie').name('Play Game Movie');
        folder.add(this.scene, 'turnTime',15.0,70.0,1.0).name('Turn Time');
    }
}