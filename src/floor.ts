import * as THREE from "three"
import * as Mirror from './Mirror.js'
import { RENDER_MIRROR,FLOOR_COLOR,MIRROR_COLOR } from './constants'

let mirror = Mirror(THREE)

export class Floor{
    
    bufferedGeometry : THREE.BufferGeometry
    geometry : THREE.Geometry
    material : THREE.Material
    ref : THREE.Mesh
    sofaRoot : THREE.Mesh
    floor : THREE.Mesh
    groundMirror : any /* THREE.Mirror */

    constructor(renderer:THREE.Renderer,camera:THREE.PerspectiveCamera){


        /* add mirrored surface */
        this.bufferedGeometry = new THREE.PlaneBufferGeometry(1024,1024)
        this.geometry = new THREE.PlaneGeometry(1024,1024)
        this.groundMirror = new mirror(
            renderer, 
            camera, {clipBias : 0.003,textureWidth: 1024, textureHeight: 1024,color:MIRROR_COLOR})

        this.material = new THREE.MeshPhongMaterial({
            color:MIRROR_COLOR,
            side:THREE.DoubleSide,
            vertexColors:THREE.FaceColors,
        })
        
        this.ref = new THREE.Mesh()

        if ( RENDER_MIRROR ){
            this.floor = new THREE.Mesh( this.bufferedGeometry , this.groundMirror.material )
            this.floor.add( this.groundMirror )
        }else{
            this.floor = new THREE.Mesh(this.geometry,this.material)
        }
        this.ref.add( this.floor )
        this.floor.position.set(0,0,0)
        this.floor.rotateX(-Math.PI/2)

        this.sofaRoot = new THREE.Mesh()
        this.ref.add( this.sofaRoot )
    }
}