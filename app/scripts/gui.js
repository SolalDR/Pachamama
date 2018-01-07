import Dat from "dat-gui"
import Tree from "./tree/Tree.js"

var initDatGui = function() {
    var gui = new Dat.GUI();

    gui.close();
    var branch = gui.addFolder('Branch');
    var trunk = gui.addFolder('Trunk');
    var animation = gui.addFolder('Animation');

    gui.add(Tree.CONFIG.compute, 'precision', 0.001, 0.1).onFinishChange(this.tree.newGeometry.bind(this.tree));
    gui.add(Tree.CONFIG.compute, 'dist', 0.001, 1).onFinishChange(this.tree.newGeometry.bind(this.tree));
    gui.add(Tree.CONFIG.compute, 'pointW', 0, 1).onFinishChange(this.tree.newGeometry.bind(this.tree));

    gui.add(this.tree, 'display')

    /**********
    *  Trunk
    **********/

    trunk.add(Tree.CONFIG.trunk, 'l', 0, 10)
        .name("length").onFinishChange(this.tree.new.bind(this.tree));

    trunk.add(Tree.CONFIG.trunk, 'w', 0, 2.5)
        .name("weight").onFinishChange(this.tree.new.bind(this.tree));
   
    trunk.add(Tree.CONFIG.trunk.noise, 'speed', 0, 2)
        .name("twistChangeSpeed").onFinishChange(this.tree.newGeometry.bind(this.tree));

    trunk.add(Tree.CONFIG.trunk.noise, 'force', 0, 2)
        .name("twistForce").onFinishChange(this.tree.newGeometry.bind(this.tree));

    trunk.add(Tree.CONFIG.trunk.transition, 'w', 0, 1)
        .name("weightTransition").onFinishChange(this.tree.newGeometry.bind(this.tree));

    var trunkChild = trunk.addFolder("Branch Child creation");

    trunkChild.add(Tree.CONFIG.trunk.prob.behaviourSeparation, "division", 0, 1)
        .name("Division").onFinishChange(this.tree.new.bind(this.tree));

    trunkChild.add(Tree.CONFIG.trunk.prob.behaviourSeparation, "ramification", 0, 1)
        .name("Ramification").onFinishChange(this.tree.new.bind(this.tree));

    var trunkChildCreation = trunkChild.addFolder("Number of child branches (probability)");
    for(var i=0; i < Tree.CONFIG.trunk.prob.countChild.length; i++){
        trunkChildCreation.add(Tree.CONFIG.trunk.prob.countChild, i, 0, 10)
            .step(0.2).onFinishChange(this.tree.new.bind(this.tree));
    }
    
    /**********
    *  Branch
    **********/

    manageMinMaxGui(this, Tree.CONFIG.branch.l, branch, 0, 10, "Length");
    manageMinMaxGui(this, Tree.CONFIG.branch.w, branch, 0, 2, "Weight");
    manageMinMaxGui(this, Tree.CONFIG.branch.w.transfer, branch, 0, 1, "Transfer"); 

    branch.add(Tree.CONFIG.branch.noise, 'speed', 0, 2)
        .name("twistChangeSpeed").onFinishChange(this.tree.newGeometry.bind(this.tree));

    branch.add(Tree.CONFIG.branch.noise, 'force', 0, 2)
        .name("twistForce").onFinishChange(this.tree.newGeometry.bind(this.tree));

    branch.add(Tree.CONFIG.branch.transition, 'w', 0, 1)
        .name("weightTransition").onFinishChange(this.tree.newGeometry.bind(this.tree));

    var branchChild = branch.addFolder("Branch Child creation");
   
    branchChild.add(Tree.CONFIG.branch.prob.behaviourSeparation, "division", 0, 1)
        .name("Division").onFinishChange(this.tree.new.bind(this.tree));
  
    branchChild.add(Tree.CONFIG.branch.prob.behaviourSeparation, "ramification", 0, 1)
        .name("Ramification").onFinishChange(this.tree.new.bind(this.tree));
    
    var branchCreation = branchChild.addFolder("Number of child branches (probability)");
   
    for(var i=0; i < Tree.CONFIG.branch.prob.countChild.length; i++){
        branchCreation.add(Tree.CONFIG.branch.prob.countChild, i, 0, 10)
            .step(0.2).onFinishChange(this.tree.new.bind(this.tree));
    }

    animation.add(Tree.CONFIG.animation.noise, 'speed', 0, 0.005).onChange(this.tree.updateUniforms.bind(this.tree));
    animation.add(Tree.CONFIG.animation.noise, 'force', 0, 1).onChange(this.tree.updateUniforms.bind(this.tree));
    animation.add(Tree.CONFIG.animation.hurricane, 'radius', 0, 5).onChange(this.tree.updateUniforms.bind(this.tree));
    animation.add(Tree.CONFIG.animation.hurricane, 'turns', 0, 20).onChange(this.tree.updateUniforms.bind(this.tree));
    animation.add(Tree.CONFIG.animation, 'durationLeave', 0, 5000).onChange(this.tree.updateUniforms.bind(this.tree));

}

function manageMinMaxGui(self, config, folder, min, max, name){

    folder.add(config, 'min', min, max).name('min'+name).listen().onChange((val)=>{
        if( config.max < config.min)
            config.max = config.min;
    }).onFinishChange(self.tree.new.bind(self.tree));

    folder.add(config, 'max', min, max).name('max'+name).listen().onChange((val)=>{
        if( config.max < config.min)
            config.min = config.max;
    }).onFinishChange(self.tree.new.bind(self.tree));

}

export default initDatGui;