/**
 * MyGraphNode class - represents an intermediate node in the scene graph
 */

class MyGraphNode {
    constructor(graph, nodeID){
        this.graph = graph;
        this.nodeID = nodeID;
        this.amplified = false;
        
        this.children = [];
        this.leaves = [];
        
        this.materialID = null;
        this.textureID = null;

        this.afs = 1;
        this.aft = 1;

        this.transformationMatrix = mat4.create();
        mat4.identity(this.transformationMatrix);
    }

    addChild(nodeID){
        this.children.push(nodeID);
    }

    addLeaf(leaf){
        this.leaves.push(leaf);
    }

    changeMaterial(material){
        this.materialID = material;
    }

    changeTexture(texture){
        this.textureID = texture;
    }

    changeAmplificationFactors(afs,aft){
        this.afs = afs;
        this.aft = aft;
    }

    display(fatherMaterialID, fatherTextureID){

        var materialID = fatherMaterialID;
        var textureID = fatherTextureID;

        this.graph.scene.multMatrix(this.transformationMatrix);

        if(this.graph.materials[this.materialID] != null){
            materialID = this.materialID;
        }

        if(this.textureID == 'clear')
            textureID = null;
        
        if(this.graph.textures[this.textureID] != null)
            textureID = this.textureID;
        
        var currentTexture = this.graph.textures[textureID];
        var currentMaterial = this.graph.materials[materialID];
        
        for (var i = 0; i < this.leaves.length; i++){
            if(currentTexture != null && !this.amplified){
                this.leaves[i].updateTexCoords(this.afs,this.aft);
                this.amplified = true;
            }
            if(currentMaterial != null){
                currentMaterial.setTexture(currentTexture);
                currentMaterial.setTextureWrap('MIRRORED_REPEAT', 'MIRRORED_REPEAT');
                currentMaterial.apply();
            }
            this.leaves[i].display();
        }

        for (var i = 0; i < this.children.length; i++) {
            this.graph.scene.pushMatrix();
            if (this.graph.nodes[this.children[i]] != null) {
                this.graph.nodes[this.children[i]].display(materialID, textureID);
            }
            else 
                this.graph.onXMLMinorError("node not defined.");
            this.graph.scene.popMatrix();
        }
    }
}