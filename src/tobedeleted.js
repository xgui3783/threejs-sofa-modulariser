"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("three");
var KopaViewer = (function () {
    function KopaViewer(canvas) {
        /* canvas should be the html element passed */
        /* setting up the renderer */
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        canvas.appendChild(this.renderer.domElement);
        /* setting up the scene + units */
        // this.scene = new Scene()
    }
    return KopaViewer;
}());
//# sourceMappingURL=tobedeleted.js.map