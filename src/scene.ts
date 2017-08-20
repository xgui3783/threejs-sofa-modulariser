import * as THREE from "three"
import { Floor } from "./floor"
import { Sofa } from "./sofaModel"
import { SofaFactory } from "./sofaFactory"
import { SKYBOX_COLOR,INIT_CAMERA_POS,PERSPECTIVE_CAMERA_CONFIG,AMBIENT_INTENSITY,SPOT_INTENSITY,SPOT_HEIGHT,SPOT_COLOR,SPOT_DISTANCE,SPOT_ANGLE,SPOT_PENUMBRA,SPOT_DECAY } from "./constants"

export class Scene{

    scene : THREE.Scene
    camera : THREE.PerspectiveCamera
    cameraAnchor : THREE.Mesh = new THREE.Mesh()
    cameraAnchorDest : THREE.Mesh = new THREE.Mesh()

    directional : THREE.DirectionalLight
    directional2 : THREE.DirectionalLight
    ambient : THREE.AmbientLight
    spot : THREE.SpotLight

    rootSofas : Sofa [] = []

    cameraConfig : any = PERSPECTIVE_CAMERA_CONFIG

    floor : Floor

    sofaFactory : SofaFactory
    
    constructor(renderer:THREE.Renderer){
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            this.cameraConfig.FOV,
            this.cameraConfig.aspectRatio,
            this.cameraConfig.clipNear,
            this.cameraConfig.clipFar
        )
        this.directional = new THREE.DirectionalLight( 0xffffff , 0.3 )
        this.directional2 = new THREE.DirectionalLight( 0xffffff , 0.2 )
        this.ambient = new THREE.AmbientLight( 0xffffff , AMBIENT_INTENSITY )
        this.spot = new THREE.SpotLight(SPOT_COLOR,SPOT_INTENSITY,SPOT_DISTANCE,SPOT_ANGLE,SPOT_PENUMBRA,SPOT_DECAY)

        this.floor = new Floor(renderer,this.camera)

        this.sofaFactory = new SofaFactory()
        this.sofaFactory.loadGeometries( ()=>{
            this.addRootSofa(new THREE.Vector3(0,0,0))
        })
    }

    setup(){
        /* add camera to the scene */
        this.scene.add( this.cameraAnchorDest )
        this.scene.add( this.cameraAnchor )
        this.cameraAnchorDest.position.set(0,0,0)
        this.cameraAnchor.position.set(0,0,0)
        this.cameraAnchor.add( this.camera )

        /* adding light to the scene */
        this.scene.add( this.ambient )
        this.scene.add( this.directional )
        this.scene.add( this.spot )
        this.spot.position.set(0,SPOT_HEIGHT,0)

        /* add skybox */
        let skyboxGeometry = new THREE.BoxGeometry(1024,1024,1024)
        let skyboxMaterial = new THREE.MeshBasicMaterial({color:SKYBOX_COLOR,side:THREE.DoubleSide})
        let skybox = new THREE.Mesh(skyboxGeometry,skyboxMaterial)
        this.scene.add( skybox )

        /* add floor and meshes */
        this.scene.add( this.floor.ref )

        /* setup camera default position */
        this.camera.position.set( INIT_CAMERA_POS[0],INIT_CAMERA_POS[1],INIT_CAMERA_POS[2] )
        this.camera.add( this.directional2 )
        this.camera.lookAt( this.cameraAnchor.position )

        this.setupLighting()
    }

    addRootSofa(pos:THREE.Vector3){
        let newSofa = this.sofaFactory.makeANewSofa(null,null)
        this.rootSofas.push( newSofa )
        newSofa.meshes.forEach(mesh=>{
            this.floor.sofaRoot.add( mesh )
        })

        this.sofaFactory.addArmrest(newSofa,'left')
        this.sofaFactory.addBacksupport(newSofa,'top')
    }

    setupLighting(){
        this.directional.position.set( -10 , 10 , 0 )
    }
}