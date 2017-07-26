import * as THREE from "three"
import {SofaFactory} from "./sofaFactory"

export class Sofa{

    mesh:THREE.Mesh
    material:THREE.Material
    geometry:THREE.Geometry

    top:Sofa|SofaAddon
    bottom:Sofa|SofaAddon
    left:Sofa|SofaAddon
    right:Sofa|SofaAddon

    mirrortop:Sofa
    mirrorbottom:Sofa
    cushion:Cushion
    
    constructor( geometry:THREE.Geometry , material:THREE.Material ){
        this.material = material
        this.geometry = geometry
        this.mesh = new THREE.Mesh( geometry, material )
    }

    clone(sofaFactory:SofaFactory):Sofa{
        let newSofaGeometry = this.geometry.clone()
        let newSofaMaterial :any = this.material.clone()

        newSofaMaterial.emissive.setHex(0x000000)

        let newSofa = new Sofa(newSofaGeometry,newSofaMaterial)

        let arrSides = ['top','left','right','bottom','cushion']
        arrSides.forEach(side =>{
            if (this[side] && this[side].constructor.name!='Sofa'){
                let addonName = this[side].constructor.name
                sofaFactory['add'+addonName](newSofa,side)
            }
        })
        return newSofa
    }

    mirrorXZ(){
        let arrSides = ['top','left','right','bottom','cushion']

        let tempSide
        if ( this.top ){
            this.top.mesh.rotateY(Math.PI)
            tempSide = this.top
        }

        if( this.bottom ){
            this.bottom.mesh.rotateY(Math.PI)
            this.top = this.bottom
            if( tempSide ){
                this.bottom = tempSide
            } 
        }else if(tempSide){
            this.bottom = tempSide
            this.top = undefined
        }
    }
}

export abstract class SofaAddon{
    
    parent:Sofa

    geometry:THREE.Geometry
    material:THREE.Material
    mesh:THREE.Mesh

    /* defines parent, and inherits material from parent */
    constructor(sofa:Sofa){
        this.parent = sofa
        this.material = this.parent.material
    }
}

export class Armrest extends SofaAddon{
    constructor( sofa:Sofa,geometry:THREE.Geometry ){
        super( sofa )
        this.geometry = geometry
        this.mesh = new THREE.Mesh( this.geometry,this.material )
    }
    clone(sofa:Sofa):Armrest{
        return new Armrest(sofa,this.geometry.clone())
    }
}

export class Backsupport extends SofaAddon{
    constructor( sofa:Sofa,geometry:THREE.Geometry ){
        super( sofa )
        this.geometry = geometry
        this.mesh = new THREE.Mesh( this.geometry,this.material )
    }
    clone(sofa:Sofa):Backsupport{
        return new Backsupport(sofa,this.geometry.clone())
    }
}

export class Cushion extends SofaAddon{
    constructor( sofa:Sofa,geometry:THREE.Geometry ){
        super( sofa )
        this.geometry = geometry
        this.mesh = new THREE.Mesh( this.geometry,this.material )
    }
    clone(sofa:Sofa):Cushion{
        return new Cushion(sofa,this.geometry.clone())
    }
}