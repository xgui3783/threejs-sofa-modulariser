import { Scene } from './scene'
import * as THREE from "three"

class KopaViewer{

    renderer : THREE.WebGLRenderer
    scene : Scene

    constructor(canvas:HTMLElement){

        /* canvas should be the html element passed */

        /* setting up the renderer */
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize( canvas.clientWidth, canvas.clientHeight )
        canvas.appendChild( this.renderer.domElement )

        /* setting up the scene + units */
        // this.scene = new Scene()
    }
}