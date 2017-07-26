import { Sofa,Armrest,Backsupport } from './sofaModel'
import { SofaFactory } from './sofaFactory'
import * as THREE from 'three'

export class ModifySofaDialog{

    selectedSofa : Sofa
    selectedSide : string
    sofaFactory : SofaFactory
    tooltip : HTMLElement
    smallTooltip : HTMLElement

    lvl2menu : HTMLElement
    trashcan : HTMLElement

    remove : HTMLElement
    cancel : HTMLElement
    addSofa : HTMLElement
    addArmRest : HTMLElement
    addBackRest : HTMLElement

    constructor(sofaFactory:SofaFactory){
        this.sofaFactory = sofaFactory
        this.tooltip = document.getElementById('tooltip_anchor')
        this.smallTooltip = document.getElementById('tooltip_singular')
        let sides = this.tooltip.querySelectorAll('.tooltip_int')
        this.trashcan = document.getElementById('trashcan')

        for (let i = 0; i < sides.length; i++){
            sides[i].addEventListener('click',(ev)=>this.tooltipIntClick(ev),false)
        }

        this.lvl2menu = document.createElement('span');
        ['addSofa','addArmRest','addBackRest','remove','cancel'].forEach(name=>this.spanFactory(name))
    }

    /* v1, full menu on sofa click */
    findSofa(mesh:THREE.Mesh){
        if( mesh ){
            this.selectedSofa = this.sofaFactory.findSofa( mesh )

            /* intersection could be with an accessory (armrest, back, etc) */
            // if( ! this.selectedSofa ){
            //     this.selectedSofa = this.sofaFactory.sofaLedger.find( (sofa) => sofa.mesh === mesh.parent )
            // }
        }else{
            this.selectedSofa = null
        }
        mesh ? ['top','right','bottom','left'].forEach((value)=>this.populateTooltip(value)) : {}
    }

    populateTooltip(value:string){
        this.tooltip.querySelector(`#side${value}`).innerHTML =  this.selectedSofa[value] ? this.selectedSofa[value].constructor.name : '&#x2295;';
    }

    tooltipIntClick(ev){

        let target = ev.originalTarget || ev.target
        this.selectedSide = target.id.substring(4) || target.id.substring(4)

        this.trashcan.appendChild( this.lvl2menu )

        document.querySelector('.tooltip_int.active') ? document.querySelector('.tooltip_int.active').className = 'tooltip_int':{};
        target.className += ' active'

        while( document.querySelector('.tooltip_int.hidden') ){
            document.querySelector('.tooltip_int.hidden').className = 'tooltip_int'
        }

        if( target.innerHTML.length == 1 ) {
            this.remove.className += ' hidden'
        } else {
            this.addSofa.className += ' hidden'
            this.addArmRest.className += ' hidden'
            this.addBackRest.className += ' hidden'
        }

        target.appendChild( this.lvl2menu )
    }

    spanFactory(name:string){
        this[name] = document.createElement('span')
        this[name].className += ' tooltip_int'
        this[name].innerHTML = name
        this[name].addEventListener('click',(ev)=>this.l2EventHandler(ev),false)
        this.lvl2menu.appendChild( this[name] )
    }

    l2EventHandler(ev){
        let target = ev.originalTarget || ev.target
        switch( target.innerHTML ){
            case 'remove':{
                this.sofaFactory.remove(this.selectedSofa,this.selectedSide)
            }break;
            case 'addSofa':{
                this.sofaFactory.makeANewSofa(this.selectedSofa,this.selectedSide)
            }break;
            case 'addArmRest':{
                this.sofaFactory.addArmrest(this.selectedSofa,this.selectedSide)
            }break;
            case 'addBackRest':{
                this.sofaFactory.addBacksupport(this.selectedSofa,this.selectedSide)
            }break;
        }
        this.trashcan.appendChild( this.lvl2menu );

        ['top','right','bottom','left'].forEach((value)=>this.populateTooltip(value))
        ev.stopPropagation()
    }

    /* v2 - smaller tooltip, node click */
    /* in the progress of migrating to util.ts > OnHOverControls */
    showToolTip(intersects,onHoverControls){

        /* find the selected sofa first */
        this.selectedSofa = this.sofaFactory.findSofa( intersects[0].parent )

        /* then find the node that was clicked */
        if( Math.abs( intersects[0].position.x - intersects[0].parent.position.x ) < 0.01 ){
            if( Math.abs( intersects[0].position.z - intersects[0].parent.position.z ) < 0.01 ){
                /* material sphere */
                this.selectedSide = 'color'
            }else if( intersects[0].position.z > intersects[0].parent.position.z ){
                /* bottom node */
                this.selectedSide = 'bottom'
            }else if( intersects[0].position.z < intersects[0].parent.position.z ){
                /* top node */
                this.selectedSide = 'top'
            }
        }else if( intersects[0].position.x > intersects[0].parent.position.x ){
            /* right node */
            this.selectedSide = 'right'
        }else if( intersects[0].position.x < intersects[0].parent.position.x ){
            /* left node */
            this.selectedSide = 'left'
        }

        /* now, append the correct information to tooltip box */
        /* first check if the spot is occupied */
        if( this.selectedSofa[this.selectedSide] ){
            let accElement = document.createElement('div')
            let accName = document.createElement('span')
            accName.innerHTML = this.selectedSofa[this.selectedSide].constructor.name
            let removeMe = document.createElement('span')
            removeMe.className = 'tooltip_int'
            removeMe.innerHTML = 'remove'
            removeMe.addEventListener('click',(ev:any)=>{
                this.sofaFactory.remove(this.selectedSofa,this.selectedSide)
                /* TODO: dismiss tooltip */
            })
            accElement.appendChild(accName).appendChild(removeMe)

            this.smallTooltip.innerHTML = ``
            this.smallTooltip.appendChild(accElement)
        }else{
            this.smallTooltip.innerHTML = ``
            switch(this.selectedSide){
                case 'top':
                case 'bottom':{

                }break;
                case 'left':
                case 'right':{

                }break;
                case 'material':{

                }break;
            }
        }
    }
}