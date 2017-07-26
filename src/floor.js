"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("three");
var Mirror = require("./Mirror.js");
var constants_1 = require("./constants");
var mirror = Mirror(THREE);
var Floor = (function () {
    function Floor(renderer, camera) {
        /* add mirrored surface */
        this.bufferedGeometry = new THREE.PlaneBufferGeometry(1024, 1024);
        this.geometry = new THREE.PlaneGeometry(1024, 1024);
        this.groundMirror = new mirror(renderer, camera, { clipBias: 0.003, textureWidth: 1024, textureHeight: 1024, color: constants_1.MIRROR_COLOR });
        this.material = new THREE.MeshPhongMaterial({
            color: constants_1.MIRROR_COLOR,
            side: THREE.DoubleSide,
            vertexColors: THREE.FaceColors,
        });
        this.ref = new THREE.Mesh();
        if (constants_1.RENDER_MIRROR) {
            this.floor = new THREE.Mesh(this.bufferedGeometry, this.groundMirror.material);
            this.floor.add(this.groundMirror);
        }
        else {
            this.floor = new THREE.Mesh(this.geometry, this.material);
        }
        this.ref.add(this.floor);
        this.floor.position.set(0, 0, 0);
        this.floor.rotateX(-Math.PI / 2);
        this.sofaRoot = new THREE.Mesh();
        this.ref.add(this.sofaRoot);
    }
    return Floor;
}());
exports.Floor = Floor;
//# sourceMappingURL=floor.js.map