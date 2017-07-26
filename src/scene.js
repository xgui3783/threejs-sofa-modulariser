"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("three");
var floor_1 = require("./floor");
var sofaFactory_1 = require("./sofaFactory");
var constants_1 = require("./constants");
var Scene = (function () {
    function Scene(renderer) {
        var _this = this;
        this.cameraAnchor = new THREE.Mesh();
        this.cameraAnchorDest = new THREE.Mesh();
        this.rootSofas = [];
        this.cameraConfig = constants_1.PERSPECTIVE_CAMERA_CONFIG;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(this.cameraConfig.FOV, this.cameraConfig.aspectRatio, this.cameraConfig.clipNear, this.cameraConfig.clipFar);
        this.directional = new THREE.DirectionalLight(0xffffff, 0.3);
        this.directional2 = new THREE.DirectionalLight(0xffffff, 0.2);
        this.ambient = new THREE.AmbientLight(0xffffff, constants_1.AMBIENT_INTENSITY);
        this.spot = new THREE.SpotLight(constants_1.SPOT_COLOR, constants_1.SPOT_INTENSITY, constants_1.SPOT_DISTANCE, constants_1.SPOT_ANGLE, constants_1.SPOT_PENUMBRA, constants_1.SPOT_DECAY);
        this.floor = new floor_1.Floor(renderer, this.camera);
        this.sofaFactory = new sofaFactory_1.SofaFactory();
        this.sofaFactory.loadGeometries(function () {
            _this.addRootSofa(new THREE.Vector3(0, 0, 0));
        });
    }
    Scene.prototype.setup = function () {
        /* add camera to the scene */
        this.scene.add(this.cameraAnchorDest);
        this.scene.add(this.cameraAnchor);
        this.cameraAnchorDest.position.set(0, 0, 0);
        this.cameraAnchor.position.set(0, 0, 0);
        this.cameraAnchor.add(this.camera);
        /* adding light to the scene */
        this.scene.add(this.ambient);
        this.scene.add(this.directional);
        this.scene.add(this.spot);
        this.spot.position.set(0, constants_1.SPOT_HEIGHT, 0);
        /* add skybox */
        var skyboxGeometry = new THREE.BoxGeometry(1024, 1024, 1024);
        var skyboxMaterial = new THREE.MeshBasicMaterial({ color: constants_1.SKYBOX_COLOR, side: THREE.DoubleSide });
        var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
        this.scene.add(skybox);
        /* add floor and meshes */
        this.scene.add(this.floor.ref);
        /* setup camera default position */
        this.camera.position.set(constants_1.INIT_CAMERA_POS[0], constants_1.INIT_CAMERA_POS[1], constants_1.INIT_CAMERA_POS[2]);
        this.camera.add(this.directional2);
        this.camera.lookAt(this.cameraAnchor.position);
        this.setupLighting();
    };
    Scene.prototype.addRootSofa = function (pos) {
        var newSofa = this.sofaFactory.makeANewSofa(null, null);
        this.rootSofas.push(newSofa);
        this.floor.sofaRoot.add(newSofa.mesh);
        this.sofaFactory.addArmrest(newSofa, 'left');
        this.sofaFactory.addBacksupport(newSofa, 'top');
    };
    Scene.prototype.setupLighting = function () {
        this.directional.position.set(-10, 10, 0);
    };
    return Scene;
}());
exports.Scene = Scene;
//# sourceMappingURL=scene.js.map