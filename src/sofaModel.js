"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("three");
var Sofa = (function () {
    function Sofa(geometry, material) {
        this.material = material;
        this.geometry = geometry;
        this.mesh = new THREE.Mesh(geometry, material);
    }
    Sofa.prototype.clone = function (sofaFactory) {
        var _this = this;
        var newSofaGeometry = this.geometry.clone();
        var newSofaMaterial = this.material.clone();
        newSofaMaterial.emissive.setHex(0x000000);
        var newSofa = new Sofa(newSofaGeometry, newSofaMaterial);
        var arrSides = ['top', 'left', 'right', 'bottom', 'cushion'];
        arrSides.forEach(function (side) {
            if (_this[side] && _this[side].constructor.name != 'Sofa') {
                var addonName = _this[side].constructor.name;
                sofaFactory['add' + addonName](newSofa, side);
            }
        });
        return newSofa;
    };
    Sofa.prototype.mirrorXZ = function () {
        var arrSides = ['top', 'left', 'right', 'bottom', 'cushion'];
        var tempSide;
        if (this.top) {
            this.top.mesh.rotateY(Math.PI);
            tempSide = this.top;
        }
        if (this.bottom) {
            this.bottom.mesh.rotateY(Math.PI);
            this.top = this.bottom;
            if (tempSide) {
                this.bottom = tempSide;
            }
        }
        else if (tempSide) {
            this.bottom = tempSide;
            this.top = undefined;
        }
    };
    return Sofa;
}());
exports.Sofa = Sofa;
var SofaAddon = (function () {
    /* defines parent, and inherits material from parent */
    function SofaAddon(sofa) {
        this.parent = sofa;
        this.material = this.parent.material;
    }
    return SofaAddon;
}());
exports.SofaAddon = SofaAddon;
var Armrest = (function (_super) {
    __extends(Armrest, _super);
    function Armrest(sofa, geometry) {
        var _this = _super.call(this, sofa) || this;
        _this.geometry = geometry;
        _this.mesh = new THREE.Mesh(_this.geometry, _this.material);
        return _this;
    }
    Armrest.prototype.clone = function (sofa) {
        return new Armrest(sofa, this.geometry.clone());
    };
    return Armrest;
}(SofaAddon));
exports.Armrest = Armrest;
var Backsupport = (function (_super) {
    __extends(Backsupport, _super);
    function Backsupport(sofa, geometry) {
        var _this = _super.call(this, sofa) || this;
        _this.geometry = geometry;
        _this.mesh = new THREE.Mesh(_this.geometry, _this.material);
        return _this;
    }
    Backsupport.prototype.clone = function (sofa) {
        return new Backsupport(sofa, this.geometry.clone());
    };
    return Backsupport;
}(SofaAddon));
exports.Backsupport = Backsupport;
var Cushion = (function (_super) {
    __extends(Cushion, _super);
    function Cushion(sofa, geometry) {
        var _this = _super.call(this, sofa) || this;
        _this.geometry = geometry;
        _this.mesh = new THREE.Mesh(_this.geometry, _this.material);
        return _this;
    }
    Cushion.prototype.clone = function (sofa) {
        return new Cushion(sofa, this.geometry.clone());
    };
    return Cushion;
}(SofaAddon));
exports.Cushion = Cushion;
//# sourceMappingURL=sofaModel.js.map