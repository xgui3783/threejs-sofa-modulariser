import * as THREE from "three"
import { Sofa,Armrest,Backsupport } from "./sofaModel"
import { ROOT,SOFAWIDTH,WHITE,CHARCOAL,NAVY,LIGHTGRAY,BEIGE,TEXTURE_WRAPS,TEXTURE_WRAPT,TEXTURE_BUMP } from "./constants"

export class SofaFactory {

    castShadow : boolean = false

    sofaLedger : Sofa[]
    geometry : THREE.Geometry
    material : THREE.Material

    armrestGeometry : THREE.Geometry
    backsupportGeometry : THREE.Geometry

    charcoalMaterial : THREE.Material
    navyMaterial : THREE.Material
    lightgrayMaterial : THREE.Material
    beigeMaterial : THREE.Material

    texture : THREE.Texture
    normalMap : THREE.Texture
    
    constructor(){
        this.charcoalMaterial = new THREE.MeshPhongMaterial({
            color : CHARCOAL,
            side: THREE.DoubleSide,
            vertexColors : THREE.FaceColors,
        })

        this.navyMaterial = new THREE.MeshPhongMaterial({
            color : NAVY,
            side: THREE.DoubleSide,
            vertexColors : THREE.FaceColors
        })

        this.lightgrayMaterial = new THREE.MeshPhongMaterial({
            color : LIGHTGRAY,
            side: THREE.DoubleSide,
            vertexColors : THREE.FaceColors
        })

        this.beigeMaterial = new THREE.MeshPhongMaterial({
            color : BEIGE,
            side: THREE.DoubleSide,
            vertexColors : THREE.FaceColors
        })

        /* load geometry/materials here */
        this.material = this.charcoalMaterial
        this.sofaLedger = []
    }

    loadGeometries( callback : ()=>void ){
        Promise.all([
            new Promise((resolve,reject)=>{
                let mainLoader = new THREE.JSONLoader()
                mainLoader.load(ROOT + "./blenderobj/main_w_uvmap.json",(geometry)=>{
                    this.geometry = geometry
                    resolve()
                },()=>{},(e)=>{
                    reject(e.message)
                })
            }),
            new Promise((resolve,reject)=>{
                let mainLoader = new THREE.JSONLoader()
                mainLoader.load(ROOT + "./blenderobj/arm_w_uvmap.json",(geometry)=>{
                    this.armrestGeometry = geometry
                    resolve()
                },()=>{},(e)=>{
                    reject(e.message)
                })
            }),
            new Promise((resolve,reject)=>{
                let mainLoader = new THREE.JSONLoader()
                mainLoader.load(ROOT + "./blenderobj/back_w_uvmap.json",(geometry)=>{
                    this.backsupportGeometry = geometry
                    resolve()
                },()=>{},(e)=>{
                    reject(e.message)
                })
            }),
            new Promise((resolve,reject)=>{
                let textureLoader = new THREE.TextureLoader()
                textureLoader.crossOrigin = ''
                textureLoader.load(ROOT + "./blenderobj/white.jpg",(texture)=>{
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set( TEXTURE_WRAPS, TEXTURE_WRAPT );
                    this.texture = texture
                    resolve()
                },()=>{},(e)=>{
                    reject(e.message)
                })
            }),
            new Promise((resolve,reject)=>{
                let textureLoader = new THREE.TextureLoader()
                textureLoader.crossOrigin = ''
                textureLoader.load(ROOT + "./blenderobj/normal.jpg",(texture)=>{
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set( TEXTURE_WRAPS, TEXTURE_WRAPT );
                    this.normalMap = texture
                    resolve()
                },()=>{},(e)=>{
                    reject(e.message)
                })
            })
        ]).then(()=>{

            this.charcoalMaterial = new THREE.MeshPhongMaterial({
                color : WHITE,
                side: THREE.DoubleSide,
                vertexColors : THREE.FaceColors,
                map : this.texture,
                bumpMap : this.normalMap,
                bumpScale:TEXTURE_BUMP,
                // specularMap : this.normalMap,
                // specular : 0xcccccc
            })
            this.material = this.charcoalMaterial

            callback()
        })

        // mainLoader.load("blenderobj/main.json",(geometry)=>{
        //     this.geometry = geometry
        // })

        // armLoader.load("blenderobj/arm.json",(geometry)=>{
        //     this.armrestGeometry = geometry
        // })

        // backLoader.load("blenderobj/back.json",(geometry)=>{
        //     this.backsupportGeometry = geometry
        // })
    }


    makeANewSofa(sofa?:Sofa,position?:string):Sofa{
        if( sofa ){
            if( !sofa[position] ){
                let newMaterial : any = this.material.clone()
                newMaterial.emissive.setHex(0x000000)
                let newSofa = new Sofa( this.geometry,newMaterial )
                
                newSofa.mesh.castShadow = this.castShadow

                this.sofaLedger.push( newSofa )
                sofa[position] = newSofa
                
                sofa.mesh.add( sofa[position].mesh )

                switch( position ){
                    case 'top':{
                        sofa[position].mesh.position.set(0,0,-SOFAWIDTH)
                    }break;
                    case 'left':{
                        sofa[position].mesh.position.set(-SOFAWIDTH,0,0)
                    }break;
                    case 'bottom':{
                        sofa[position].mesh.position.set(0,0,SOFAWIDTH)
                    }break;
                    case 'right':{
                        sofa[position].mesh.position.set(SOFAWIDTH,0,0)
                    }break;
                    case 'mirrortop':{
                        sofa[position].mesh.position.set(0,0,SOFAWIDTH)
                    }
                    case 'mirrorbottom':{
                        sofa[position].mesh.position.set(0,0,-SOFAWIDTH)
                    }
                }

                return null
            }else{
                throw new Error("This position is already occupied!")
            }
        }else{
            let newSofa = new Sofa( this.geometry, this.material )
            newSofa.mesh.castShadow = this.castShadow
            this.sofaLedger.push( newSofa )
            return newSofa
        }
    }

    addArmrest(sofa:Sofa,position:string){
        if ( !sofa[position] ){

            sofa[position] = new Armrest(sofa,this.armrestGeometry)
            sofa[position].mesh.castShadow = true
            sofa.mesh.add( sofa[position].mesh )

            switch( position ){
                case 'top':{
                    sofa[position].mesh.rotateY(Math.PI/2*3)
                }break;
                case 'left':{
                }break;
                case 'bottom':{
                    sofa[position].mesh.rotateY(Math.PI/2)
                }break;
                case 'right':{
                    sofa[position].mesh.rotateY(Math.PI)
                }break;
            }

        }else{
            throw new Error('This position is already occupied!')
        }
    }

    addBacksupport(sofa:Sofa,position:string){
        if ( !sofa[position]){
            sofa[position] = new Backsupport(sofa,this.backsupportGeometry)
            sofa[position].mesh.castShadow = true
            sofa.mesh.add( sofa[position].mesh )

            switch( position ){
                case 'top':{
                }break;
                case 'left':{
                    sofa[position].mesh.rotateY(Math.PI/2)
                }break;
                case 'bottom':{
                    sofa[position].mesh.rotateY(Math.PI)
                }break;
                case 'right':{
                    sofa[position].mesh.rotateY(Math.PI/2*3)
                }break;
            }
        }else{
            throw new Error('This position is already occupied!')
        }
    }

    changeColor(sofa:Sofa,color:number){
        let material : any = sofa.material
        material.color.setHex(color)
    }

    /* remove acc /sofa from view */
    remove(sofa:Sofa,position:string){
        if( sofa[position] ){
            if( sofa[position].constructor.name == 'Sofa' ){
                this.removeAllSofasFromLedger( sofa[position] )
            }
            sofa.mesh.remove(sofa[position].mesh)
            sofa[position] = null
        }
    }

    /* once sofa is removed from view, it also needs to be removed from the ledger */
    removeAllSofasFromLedger(sofa:any){
        this.sofaLedger.forEach( (itSofa,idx,arr) => {
            if (sofa === itSofa ) { 
                arr.splice(idx,1) 
                sofa.left && sofa.left.constructor.name == 'Sofa' ? this.removeAllSofasFromLedger( sofa.left ) : {};
                sofa.right && sofa.right.constructor.name == 'Sofa' ? this.removeAllSofasFromLedger( sofa.right ) : {};
                sofa.top && sofa.top.constructor.name == 'Sofa' ? this.removeAllSofasFromLedger( sofa.top ) : {};
                sofa.bottom && sofa.bottom.constructor.name == 'Sofa' ? this.removeAllSofasFromLedger( sofa.bottom ) : {};
                return
            }
        })
    }

    /* given a mesh, find the Sofa obj in ledger */
    findSofa(mesh:THREE.Object3D):Sofa{
        /* intersection could be an accessory or base sofa */
        let sofa =  this.sofaLedger.find( sofa => sofa.mesh === mesh )
        
        return sofa ? sofa : this.sofaLedger.find( sofa => sofa.mesh === mesh.parent )
    }
}