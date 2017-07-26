"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ModifySofaDialog = (function () {
    function ModifySofaDialog(sofaFactory) {
        var _this = this;
        this.sofaFactory = sofaFactory;
        this.tooltip = document.getElementById('tooltip_anchor');
        this.smallTooltip = document.getElementById('tooltip_singular');
        var sides = this.tooltip.querySelectorAll('.tooltip_int');
        this.trashcan = document.getElementById('trashcan');
        for (var i = 0; i < sides.length; i++) {
            sides[i].addEventListener('click', function (ev) { return _this.tooltipIntClick(ev); }, false);
        }
        this.lvl2menu = document.createElement('span');
        ['addSofa', 'addArmRest', 'addBackRest', 'remove', 'cancel'].forEach(function (name) { return _this.spanFactory(name); });
    }
    /* v1, full menu on sofa click */
    ModifySofaDialog.prototype.findSofa = function (mesh) {
        var _this = this;
        if (mesh) {
            this.selectedSofa = this.sofaFactory.findSofa(mesh);
            /* intersection could be with an accessory (armrest, back, etc) */
            // if( ! this.selectedSofa ){
            //     this.selectedSofa = this.sofaFactory.sofaLedger.find( (sofa) => sofa.mesh === mesh.parent )
            // }
        }
        else {
            this.selectedSofa = null;
        }
        mesh ? ['top', 'right', 'bottom', 'left'].forEach(function (value) { return _this.populateTooltip(value); }) : {};
    };
    ModifySofaDialog.prototype.populateTooltip = function (value) {
        this.tooltip.querySelector("#side" + value).innerHTML = this.selectedSofa[value] ? this.selectedSofa[value].constructor.name : '&#x2295;';
    };
    ModifySofaDialog.prototype.tooltipIntClick = function (ev) {
        var target = ev.originalTarget || ev.target;
        this.selectedSide = target.id.substring(4) || target.id.substring(4);
        this.trashcan.appendChild(this.lvl2menu);
        document.querySelector('.tooltip_int.active') ? document.querySelector('.tooltip_int.active').className = 'tooltip_int' : {};
        target.className += ' active';
        while (document.querySelector('.tooltip_int.hidden')) {
            document.querySelector('.tooltip_int.hidden').className = 'tooltip_int';
        }
        if (target.innerHTML.length == 1) {
            this.remove.className += ' hidden';
        }
        else {
            this.addSofa.className += ' hidden';
            this.addArmRest.className += ' hidden';
            this.addBackRest.className += ' hidden';
        }
        target.appendChild(this.lvl2menu);
    };
    ModifySofaDialog.prototype.spanFactory = function (name) {
        var _this = this;
        this[name] = document.createElement('span');
        this[name].className += ' tooltip_int';
        this[name].innerHTML = name;
        this[name].addEventListener('click', function (ev) { return _this.l2EventHandler(ev); }, false);
        this.lvl2menu.appendChild(this[name]);
    };
    ModifySofaDialog.prototype.l2EventHandler = function (ev) {
        var _this = this;
        var target = ev.originalTarget || ev.target;
        switch (target.innerHTML) {
            case 'remove':
                {
                    this.sofaFactory.remove(this.selectedSofa, this.selectedSide);
                }
                break;
            case 'addSofa':
                {
                    this.sofaFactory.makeANewSofa(this.selectedSofa, this.selectedSide);
                }
                break;
            case 'addArmRest':
                {
                    this.sofaFactory.addArmrest(this.selectedSofa, this.selectedSide);
                }
                break;
            case 'addBackRest':
                {
                    this.sofaFactory.addBacksupport(this.selectedSofa, this.selectedSide);
                }
                break;
        }
        this.trashcan.appendChild(this.lvl2menu);
        ['top', 'right', 'bottom', 'left'].forEach(function (value) { return _this.populateTooltip(value); });
        ev.stopPropagation();
    };
    /* v2 - smaller tooltip, node click */
    /* in the progress of migrating to util.ts > OnHOverControls */
    ModifySofaDialog.prototype.showToolTip = function (intersects, onHoverControls) {
        var _this = this;
        /* find the selected sofa first */
        this.selectedSofa = this.sofaFactory.findSofa(intersects[0].parent);
        /* then find the node that was clicked */
        if (Math.abs(intersects[0].position.x - intersects[0].parent.position.x) < 0.01) {
            if (Math.abs(intersects[0].position.z - intersects[0].parent.position.z) < 0.01) {
                /* material sphere */
                this.selectedSide = 'color';
            }
            else if (intersects[0].position.z > intersects[0].parent.position.z) {
                /* bottom node */
                this.selectedSide = 'bottom';
            }
            else if (intersects[0].position.z < intersects[0].parent.position.z) {
                /* top node */
                this.selectedSide = 'top';
            }
        }
        else if (intersects[0].position.x > intersects[0].parent.position.x) {
            /* right node */
            this.selectedSide = 'right';
        }
        else if (intersects[0].position.x < intersects[0].parent.position.x) {
            /* left node */
            this.selectedSide = 'left';
        }
        /* now, append the correct information to tooltip box */
        /* first check if the spot is occupied */
        if (this.selectedSofa[this.selectedSide]) {
            var accElement = document.createElement('div');
            var accName = document.createElement('span');
            accName.innerHTML = this.selectedSofa[this.selectedSide].constructor.name;
            var removeMe = document.createElement('span');
            removeMe.className = 'tooltip_int';
            removeMe.innerHTML = 'remove';
            removeMe.addEventListener('click', function (ev) {
                _this.sofaFactory.remove(_this.selectedSofa, _this.selectedSide);
                /* TODO: dismiss tooltip */
            });
            accElement.appendChild(accName).appendChild(removeMe);
            this.smallTooltip.innerHTML = "";
            this.smallTooltip.appendChild(accElement);
        }
        else {
            this.smallTooltip.innerHTML = "";
            switch (this.selectedSide) {
                case 'top':
                case 'bottom':
                    {
                    }
                    break;
                case 'left':
                case 'right':
                    {
                    }
                    break;
                case 'material':
                    {
                    }
                    break;
            }
        }
    };
    return ModifySofaDialog;
}());
exports.ModifySofaDialog = ModifySofaDialog;
//# sourceMappingURL=modSofa.js.map