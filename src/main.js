"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scene_1 = require("./scene");
var THREE = require("three");
var util_1 = require("./util");
var modSofa_1 = require("./modSofa");
var constants_1 = require("./constants");
var KopaViewer = (function () {
    /* canvas should be the html element passed */
    function KopaViewer(canvas) {
        var _this = this;
        /* necessary to keep the scope */
        this.animationFrame = function () {
            /* update control, or else will not have mouse driven control of webgl */
            _this.util.control.update();
            /* set the center of the scene to be the average of all sofas */
            _this.scene.cameraAnchorDest.position.set(0, 0, 0);
            var counter = 0;
            _this.scene.sofaFactory.sofaLedger.forEach(function (sofa) {
                _this.scene.cameraAnchorDest.position.add(sofa.mesh.position);
                counter++;
            });
            if (counter > 0) {
                _this.scene.cameraAnchorDest.position.divideScalar(counter);
            }
            /* reposition camera anchor */
            _this.scene.cameraAnchor.position.multiplyScalar(9).add(_this.scene.cameraAnchorDest.position).divideScalar(10);
            /* if a node is SELECTED, then raycast will not be tested. Until the node is unselected */
            if (!_this.onHoverControls.sphereOnSelect) {
                /* find mouse on hover target */
                var raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(_this.util.mouse, _this.scene.camera);
                var intersects = raycaster.intersectObjects(_this.scene.floor.sofaRoot.children, true);
                /* firstly, reset the existing intersects with spheres, if any */
                _this.onHoverControls.INTERSECTS.forEach(function (INTERSECT) {
                    INTERSECT.material.emissive.setHex(INTERSECT.currentHex);
                });
                _this.onHoverControls.INTERSECTS = [];
                _this.onHoverControls.sphereOnHover = false;
                /* next, detect any intersections with spheres */
                intersects.forEach(function (intersect) {
                    _this.onHoverControls.lightupObj(intersect.object);
                });
                /* reselect the sofa only if no sphere is selected */
                if (!_this.onHoverControls.sphereOnHover) {
                    /* onhover sofa mesh */
                    /* reset previous on hover emissivehex */
                    _this.INTERSECT ? _this.INTERSECT.material.emissive.setHex(_this.INTERSECT.currentHex) : {};
                    /* modify on hover target appearance */
                    if (intersects.length > 0) {
                        _this.INTERSECT = intersects[0].object;
                        _this.INTERSECT.currentHex = _this.INTERSECT.material.emissive.getHex();
                        _this.INTERSECT.material.emissive.setHex(constants_1.HIGHLIGHT_COLOR);
                    }
                    else {
                        _this.INTERSECT = null;
                    }
                }
                _this.onHoverControls.tetherTo(_this.INTERSECT);
            }
            if (constants_1.RENDER_MIRROR) {
                _this.scene.floor.groundMirror.render();
            }
            _this.renderer.render(_this.scene.scene, _this.scene.camera);
            requestAnimationFrame(_this.animationFrame);
        };
        this.canvas = canvas;
        /* setting up the renderer */
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setClearColor(constants_1.RENDERER_COLOR);
        this.canvas.appendChild(this.renderer.domElement);
        /* setting up the scene + units */
        this.scene = new scene_1.Scene(this.renderer);
        /* util deals with drag controls and highlighting */
        this.util = new util_1.Util(this.scene.camera, this.renderer.domElement);
        this.modSofa = new modSofa_1.ModifySofaDialog(this.scene.sofaFactory);
        this.canvas.addEventListener('mousemove', function (e) { return _this.util.mouseMoveEvent(_this.canvas, e); }, false);
        this.canvas.addEventListener('click', function (e) { return _this.onHoverControls.mouseClickEvent(_this.canvas, e, _this.modSofa); }, false);
        this.onHoverControls = new util_1.OnHoverControls(this.scene.sofaFactory);
        if (constants_1.RENDER_SPOT)
            this.configShadow();
        this.init();
    }
    KopaViewer.prototype.configShadow = function () {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.scene.floor.floor.receiveShadow = true;
        this.scene.sofaFactory.castShadow = true;
        this.scene.spot.castShadow = true;
        this.scene.spot.shadow.mapSize.width = 1024;
        this.scene.spot.shadow.mapSize.height = 1024;
    };
    KopaViewer.prototype.init = function () {
        this.scene.setup();
        this.animationFrame();
    };
    return KopaViewer;
}());
exports.KopaViewer = KopaViewer;
exports.kopaViewer = new KopaViewer(document.getElementById('kopa_webgl'));
//# sourceMappingURL=main.js.map