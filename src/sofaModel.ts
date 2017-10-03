import * as THREE from "three"
import {SofaFactory} from "./sofaFactory"

export class Sofa{

    meshes:THREE.Mesh[]
    material:THREE.Material
    geometry:THREE.Geometry

    legGeometry:THREE.Geometry
    legMaterial:THREE.Material

    top:Sofa|SofaAddon
    bottom:Sofa|SofaAddon
    left:Sofa|SofaAddon
    right:Sofa|SofaAddon

    mirrortop:Sofa
    mirrorbottom:Sofa
    cushion:Cushion
    
    constructor( geometry:THREE.Geometry , material:THREE.Material,legGeometry:THREE.Geometry,legMaterial:THREE.Material ){
        this.material = material
        this.geometry = geometry
        this.legGeometry = legGeometry
        this.legMaterial = legMaterial
        this.material = material
        this.meshes = [new THREE.Mesh( geometry, this.material ),new THREE.Mesh(legGeometry,legMaterial)]
    }

    clone(sofaFactory:SofaFactory):Sofa{
        let newSofaGeometry = this.geometry.clone()
        let newSofaMaterial :any = this.material.clone()
        let newLegGeometry = this.legGeometry.clone()
        let newlegMaterial = this.legMaterial.clone()

        newSofaMaterial.emissive.setHex(0x000000)

        let newSofa = new Sofa(newSofaGeometry,newSofaMaterial,newLegGeometry,newlegMaterial)

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
            this.top.meshes.forEach(mesh=>{
                mesh.rotateY(Math.PI)
            })
            tempSide = this.top
        }

        if( this.bottom ){
            this.bottom.meshes.forEach(mesh=>{
                mesh.rotateY(Math.PI)
            })
            this.top = this.bottom
            if( tempSide ){
                this.bottom = tempSide
            } 
        }else if(tempSide){
            this.bottom = tempSide
            this.top = undefined
        }
    }

    hasBackRest():number{
        let pos = 0
        if ( this.top && this.top.constructor.name == 'Backsupport' ){
            pos ++
        }
        if (this.bottom && this.bottom.constructor.name == 'Backsupport' ){
            pos --
        }
        return pos
    }
}

export abstract class SofaAddon{
    
    parent:Sofa

    legGeometry:THREE.Geometry
    legMaterial:THREE.Material
    geometry:THREE.Geometry
    material:THREE.Material
    meshes:THREE.Mesh[]

    /* defines parent, and inherits material from parent */
    constructor(sofa:Sofa){
        this.parent = sofa
        this.material = this.parent.material
    }
}

export class Armrest extends SofaAddon{
    constructor( sofa:Sofa,geometry:THREE.Geometry,legGeometry:THREE.Geometry,legMaterial:THREE.Material){
        super( sofa )
        this.geometry = geometry
        this.legGeometry = legGeometry
        this.legMaterial = legMaterial
        this.meshes = [new THREE.Mesh( this.geometry,this.material ),new THREE.Mesh(this.legGeometry,this.legMaterial)]
    }
    clone(sofa:Sofa):Armrest{
        return new Armrest(sofa,this.geometry.clone(),this.legGeometry.clone(),this.legMaterial.clone())
    }
}

export class Backsupport extends SofaAddon{
    pinGeometry : THREE.Geometry
    pinMaterial : THREE.Material
    constructor( sofa:Sofa,geometry:THREE.Geometry,pinGeometry:THREE.Geometry,pinMaterial:THREE.Material ){
        super( sofa )
        this.geometry = geometry
        this.pinGeometry = pinGeometry
        this.pinMaterial = pinMaterial
        this.meshes = [new THREE.Mesh( this.geometry,this.material ),new THREE.Mesh(this.legGeometry,this.legMaterial),new THREE.Mesh(this.pinGeometry,this.pinMaterial)]
    }
    clone(sofa:Sofa):Backsupport{
        return new Backsupport(sofa,this.geometry.clone(),this.pinGeometry.clone(),this.pinMaterial.clone())
    }
}

export class Cushion extends SofaAddon{
    constructor( sofa:Sofa,geometry:THREE.Geometry ){
        super( sofa )
        this.geometry = geometry
        this.meshes = [new THREE.Mesh( this.geometry,this.material )]
    }
    clone(sofa:Sofa):Cushion{
        return new Cushion(sofa,this.geometry.clone())
    }
    reposition(){
        switch( this.parent.hasBackRest() ){
            case 0: {
                this.meshes[0].visible = false; 
            }break;
            case 1:{
                this.meshes[0].visible = true
                this.meshes[0].setRotationFromAxisAngle(new THREE.Vector3(0,0,1),0)
            }break;
            case -1:{
                this.meshes[0].visible = true 
                this.meshes[0].setRotationFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI)
            }
            break;
        }
    }
}