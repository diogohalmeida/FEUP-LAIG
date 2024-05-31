const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var NODES_INDEX = 6;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if(rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if(referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    parsePerspectiveCamera(node){
        var near;
        var far;
        var angle;
        var fromIndex;
        var toIndex;
        var from = [];
        var to = [];


        near = this.reader.getFloat(node,'near');
        far = this.reader.getFloat(node,'far');
        angle = this.reader.getFloat(node,'angle');

        if(near <= 0 || isNaN(near) || far <= 0 || isNaN(far) || angle <=0 || isNaN(angle))
            return "Values of near, far and angle need to be a value greater then zero";

        var children = node.children;
        var childrenNames = [];

        for (var i = 0; i < children.length; i++) {
            childrenNames.push(children[i].nodeName);
        }

        fromIndex = childrenNames.indexOf("from");
        toIndex = childrenNames.indexOf("to");

        if(fromIndex == -1 || toIndex == -1)
            return "From or To not given";

        from = this.parseCoordinates3D(children[fromIndex],'Perspective Camera');

        to = this.parseCoordinates3D(children[toIndex],'Perspective Camera');

        return new CGFcamera(angle*Math.PI/180,near,far,vec3.fromValues(from[0],from[1],from[2]),vec3.fromValues(to[0], to[1], to[2]));
    }

    parseOrthogonalCamera(node){

        var near;
        var far;
        var left;
        var right;
        var top;
        var bottom;
        var fromIndex;
        var toIndex;
        var upIndex;
        var from = [];
        var to = [];
        var up = [];

        near = this.reader.getFloat(node,'near');
        far = this.reader.getFloat(node,'far'); 
        left = this.reader.getFloat(node,'left');
        right = this.reader.getFloat(node,'right');
        top = this.reader.getFloat(node,'top');
        bottom = this.reader.getFloat(node,'bottom');

        if(near <= 0 || isNaN(near) || far <= 0 || isNaN(far))
            return "Values of near, far and angle need to be a value greater then zero";

        if(isNaN(left) || isNaN(right) || isNaN(top) || isNaN(bottom))
            return "Left, right, top and bottom attributes need to be a number!";

        var children = node.children;
        var childrenNames = [];

        for (var i = 0; i < children.length; i++) {
            childrenNames.push(children[i].nodeName);
        }

        fromIndex = childrenNames.indexOf("from");
        toIndex = childrenNames.indexOf("to");
        upIndex = childrenNames.indexOf("up");

        if(fromIndex == -1 || toIndex == -1)
            return "From or To not given in the orthogonal camera";

        from = this.parseCoordinates3D(children[fromIndex], 'Orthogonal Camera');

        to = this.parseCoordinates3D(children[toIndex], 'Orthogonal Camera');


        if(upIndex == -1){
            up = [0,1,0];
        }
        else{
            up = this.parseCoordinates3D(children[upIndex], 'Orthogonal Camera')
        }

        return new CGFcameraOrtho(left,right,bottom,top,near,far,vec3.fromValues(from[0],from[1],from[2]),vec3.fromValues(to[0], to[1], to[2]),vec3.fromValues(up[0],up[1],up[2]));
    }
    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {

        var children = viewsNode.children;

        var numCameras = 0;
        var perspectiveCamera;
        var orthogonalCamera;
        
        
        for (var i = 0; i < children.length; i++) {


            if(children[i].nodeName == "perspective"){
                perspectiveCamera = this.parsePerspectiveCamera(children[i]);
                var id = this.reader.getString(children[i],'id');
                var index = this.scene.cameras.length;
                this.scene.cameras.push(perspectiveCamera);
                this.scene.cameraIDs[id] = index;
            }
            else if(children[i].nodeName == "ortho"){
                orthogonalCamera = this.parseOrthogonalCamera(children[i]);
                var id = this.reader.getString(children[i],'id');
                var index = this.scene.cameras.length;
                this.scene.cameras.push(orthogonalCamera);
                this.scene.cameraIDs[id] = index;
            }
            numCameras++;
        }

        if(numCameras < 1){
            return "At least one of the following type of cameras must be declared: perspective, orthogonal";
        }

        this.log("Parsed views");
        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;
                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        this.scene.numLights = numLights;

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;

        this.textures = [];

        for (var i = 0; i < children.length; i++){
            if(children[i].nodeName != "texture"){
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            var textureID = this.reader.getString(children[i],'id');
            if(textureID == null){
                return "Invalid texture ID";
            }
            if (this.textures[textureID] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";

            var texture = new CGFtexture(this.scene,this.reader.getString(children[i],'path'));
            this.textures[textureID] = texture;
        }

        this.log("Parsed Textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        var shininessIndex;
        var shininess;
        var ambientIndex;
        var ambient = [];
        var diffuseIndex;
        var diffuse = [];
        var specularIndex;
        var specular = [];
        var emissiveIndex;
        var emissive = [];

        //Creating defaultMaterial
        var defaultMaterial = new CGFappearance(this.scene);
        defaultMaterial.setShininess(1.0);
        defaultMaterial.setAmbient(1.0,1.0,1.0,1);
        defaultMaterial.setDiffuse(1.0,1.0,1.0,1);
        defaultMaterial.setSpecular(1.0,1.0,1.0,1);
        defaultMaterial.setEmission(0.0,0.0,0.0,1);

        this.materials['Main Material'] = defaultMaterial;

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            grandChildren = children[i].children;

            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            shininessIndex = nodeNames.indexOf("shininess");
            ambientIndex = nodeNames.indexOf("ambient");
            diffuseIndex = nodeNames.indexOf("diffuse");
            specularIndex = nodeNames.indexOf("specular");
            emissiveIndex = nodeNames.indexOf("emissive");


            if(shininessIndex == -1 || ambientIndex == -1 || diffuseIndex == -1 || specularIndex == -1)
                return "Missing parameters on the material with the ID = " + materialID;

            shininess = this.reader.getFloat(grandChildren[shininessIndex],'value');

            if(shininess == null || isNaN(shininess) || shininess < 0)
                return "Shininess is a number greater than zero";
            
            //Ambient component
            ambient = this.parseColor(grandChildren[ambientIndex],'Ambient');

            //Diffuse
            diffuse = this.parseColor(grandChildren[diffuseIndex],'Diffuse');

            //Specular
            specular = this.parseColor(grandChildren[specularIndex],'Specular');

            //Emissive
            emissive = this.parseColor(grandChildren[emissiveIndex],'Emissive');

            var material = new CGFappearance(this.scene);
            material.setShininess(shininess);
            material.setAmbient(ambient[0],ambient[1],ambient[2],ambient[3]);
            material.setDiffuse(diffuse[0],diffuse[1],diffuse[2],diffuse[3]);
            material.setSpecular(specular[0],specular[1],specular[2],specular[3]);
            material.setEmission(emissive[0],emissive[1],emissive[2],emissive[3]);

            this.materials[materialID] = material;
        }
        
        this.log("Parsed materials");
        return null;
    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
  parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            this.nodes[nodeID] = new MyGraphNode(this,nodeID);
            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");

            if(transformationsIndex == -1 || materialIndex == -1 || textureIndex == -1 || descendantsIndex == -1)
                return "Missing at least one of the following nodes: transformations, material, texture, descendants";

            // Transformations
            var transformationsChildren = grandChildren[transformationsIndex].children;

            for (var l = 0; l < transformationsChildren.length; l++) {
                switch(transformationsChildren[l].nodeName){
                    case 'translation':
                        mat4.translate(this.nodes[nodeID].transformationMatrix,this.nodes[nodeID].transformationMatrix,this.parseCoordinates3D(transformationsChildren[l],'Translation'));
                        break;
                    case 'rotation':
                        var angle = this.reader.getFloat(transformationsChildren[l],'angle');
                        var axis = this.reader.getItem(transformationsChildren[l],'axis',['x','y','z']);
                        mat4.rotate(this.nodes[nodeID].transformationMatrix,this.nodes[nodeID].transformationMatrix,angle*Math.PI/180,this.axisCoords[axis]);
                        break;
                    case 'scale':
                        var sx = this.reader.getFloat(transformationsChildren[l],'sx');
                        var sy = this.reader.getFloat(transformationsChildren[l],'sy');
                        var sz = this.reader.getFloat(transformationsChildren[l],'sz');
                        mat4.scale(this.nodes[nodeID].transformationMatrix,this.nodes[nodeID].transformationMatrix,[sx,sy,sz]);
                        break;
                }
            }
            

            // Material
            var materialID = this.reader.getString(grandChildren[materialIndex],'id');

            if(nodeID == this.idRoot && materialID == 'null'){
                this.nodes[nodeID].changeMaterial('Main Material');
            }
            else{
                this.nodes[nodeID].changeMaterial(materialID);
            }
            

            // Texture
            var textureID = this.reader.getString(grandChildren[textureIndex],'id');

            this.nodes[nodeID].changeTexture(textureID);

            var textureChildren = grandChildren[textureIndex].children;
            var textureNodeNames = [];

            for (var k = 0; k < textureChildren.length; k++) {
                textureNodeNames.push(textureChildren[k].nodeName);
            }

            var amplificationIndex = textureNodeNames.indexOf("amplification");
            var afs = 1.0;
            var aft = 1.0;
            if(amplificationIndex != -1){
                afs = this.reader.getFloat(textureChildren[amplificationIndex],'afs');
                aft = this.reader.getFloat(textureChildren[amplificationIndex],'aft');

                if(isNaN(afs) || afs <= 0 || isNaN(aft) || aft <= 0){
                    console.log(afs);
                    return "Afs and Aft need to be a value greater than zero";
                }
            }
                
            this.nodes[nodeID].changeAmplificationFactors(afs,aft);

            // Descendants
            var descendantsChildren = grandChildren[descendantsIndex].children;
            for (var m = 0; m < descendantsChildren.length; m++) {
                if(descendantsChildren[m].nodeName == 'noderef'){
                    var childNode = this.reader.getString(descendantsChildren[m],'id');
                    this.nodes[nodeID].addChild(childNode);
                }
                else if(descendantsChildren[m].nodeName == 'leaf'){
                    var type = this.reader.getString(descendantsChildren[m],'type');
                    if(type == 'rectangle'){
                        this.nodes[nodeID].addLeaf(this.ProcessRectanglePrimitive(descendantsChildren[m]));
                    }
                    else if(type == 'sphere'){
                        this.nodes[nodeID].addLeaf(this.ProcessSpherePrimitive(descendantsChildren[m]));
                    }
                    else if(type == 'cylinder'){
                        this.nodes[nodeID].addLeaf(this.ProcessCylinderPrimitive(descendantsChildren[m]));
                    }
                    else if(type == 'triangle'){
                        this.nodes[nodeID].addLeaf(this.ProcessTrianglePrimitive(descendantsChildren[m]));
                    }
                    else if(type == 'torus'){
                        this.nodes[nodeID].addLeaf(this.ProcessTorusPrimitive(descendantsChildren[m]));
                    }
                    
                }
            }

        }
    }

    ProcessRectanglePrimitive(node){
        var x1 = this.reader.getFloat(node,'x1');

        if(x1 == null || isNaN(x1))
            return "unable to parse x1-coordinate of the rectangle" ;

        var x2 = this.reader.getFloat(node,'x2');

        if(x2 == null || isNaN(x2))
            return "unable to parse x2-coordinate of the rectangle" ;

        var y1 = this.reader.getFloat(node,'y1');

        if(y1 == null || isNaN(y1))
            return "unable to parse y1-coordinate of the rectangle" ;

        var y2 = this.reader.getFloat(node,'y2');

        if(y2 == null || isNaN(y2))
            return "unable to parse y2-coordinate of the rectangle" ;

        return new MyRectangle(this.scene,x1,y1,x2,y2);
    }

    ProcessSpherePrimitive(node){
        var slices = this.reader.getInteger(node,'slices');

        if(slices == null || isNaN(slices) || slices < 1)
            return "unable to parse slices of the sphere. It must be an positive integer greater than 1";

        var stacks = this.reader.getInteger(node,'stacks');

        if(stacks == null || isNaN(stacks) || stacks < 1)
            return "unable to parse slices of the sphere. It must be an positive integer greater than 1" ;

        var radius = this.reader.getFloat(node,'radius');

        if(radius == null || isNaN(radius) || radius <= 0)
            return "unable to parse slices of the sphere. It must be a positive number greater than zero" ;

        return new MySphere(this.scene,slices,stacks,radius);
    }

    ProcessCylinderPrimitive(node){
        var slices = this.reader.getInteger(node,'slices');

        if(slices == null || isNaN(slices) || slices < 1)
            return "unable to parse slices of the cylinder. It must be an positive integer greater than 1";

        var stacks = this.reader.getInteger(node,'stacks');

        if(stacks == null || isNaN(stacks) || stacks < 1)
            return "unable to parse slices of the cylinder. It must be an positive integer greater than 1";

        var topRadius = this.reader.getFloat(node,'topRadius');

        if(topRadius == null || isNaN(topRadius) || topRadius < 0)
            return "unable to parse topRadius of the cylinder. It must be a positive number greater than zero" ;

        var bottomRadius = this.reader.getFloat(node,'bottomRadius');

        if(bottomRadius == null || isNaN(bottomRadius) || bottomRadius < 0)
            return "unable to parse bottomRadius of the cylinder. It must be a positive number greater than zero" ;

        var height = this.reader.getFloat(node,'height')

        if(height == null || isNaN(height) || height <= 0)
            return "unable to parse height of the cylinder. It must be a positive number greater than zero" ;

        return new MyCylinder(this.scene,slices, stacks,bottomRadius,topRadius,height);
}

    ProcessTrianglePrimitive(node){
        var x1 = this.reader.getFloat(node,'x1');

        if(x1 == null || isNaN(x1))
            return "unable to parse x1-coordinate of the triangle" ;

        var y1 = this.reader.getFloat(node,'y1');

        if(y1 == null || isNaN(y1))
            return "unable to parse y1-coordinate of the triangle" ;

        var x2 = this.reader.getFloat(node,'x2');

        if(x2 == null || isNaN(x2))
            return "unable to parse x2-coordinate of the triangle" ;

        var y2 = this.reader.getFloat(node,'y2');

        if(y2 == null || isNaN(y2))
            return "unable to parse y2-coordinate of the triangle" ;

        var x3 = this.reader.getFloat(node,'x3');

        if(x3 == null || isNaN(x3))
            return "unable to parse x3-coordinate of the triangle" ;

        var y3 = this.reader.getFloat(node,'y3');

        if(y3 == null || isNaN(y3))
            return "unable to parse y3-coordinate of the triangle" ;

        return new MyTriangle(this.scene,x1,y1,x2,y2,x3,y3);
    }

    ProcessTorusPrimitive(node){
        var innerRadius = this.reader.getFloat(node,'inner');

        if(innerRadius == null || isNaN(innerRadius) || innerRadius <= 0)
            return "unable to parse inner of the torus. It must be a positive number greater than zero" ;

        var outerRadius = this.reader.getFloat(node,'outer');

        if(outerRadius == null || isNaN(outerRadius) || outerRadius <= 0)
            return "unable to parse outer of the torus. It must be a positive number greater than zero" ;

        var slices = this.reader.getInteger(node,'slices');

        if(slices == null || isNaN(slices) || slices < 1)
            return "unable to parse slices of the torus. It must be an positive integer greater than 1";

        var loops = this.reader.getInteger(node,'loops');

        if(loops == null || isNaN(loops) || loops < 1)
            return "unable to parse loops of the torus. It must be an positive integer greater than 1";

        return new MyTorus(this.scene, innerRadius, outerRadius, slices, loops);
    }


    parseBoolean(node, name, messageError){
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

        return boolVal;
    }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.nodes[this.idRoot].display(this.nodes[this.idRoot].materialID, this.nodes[this.idRoot].textureID);   
    }
}