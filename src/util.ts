import * as THREE from "three"
import * as OrbitControls from "three-orbit-controls"
import { Scene } from "./scene"
import { SofaFactory } from "./sofaFactory"
import { Sofa } from "./sofaModel"
import { ModifySofaDialog } from "./modSofa"
import { SOFAHEIGHT, SOFAWIDTH,HIGHLIGHT_COLOR2,WHITE,BLACK,BLUE,PINK,BROWN,CHARCOAL,NAVY,BEIGE,LIGHTGRAY,NODESIZE } from "./constants"

let orbitControls = OrbitControls( THREE )

export class Util{
    
    camera : THREE.Camera
    raycaster : THREE.Raycaster
    mouse : THREE.Vector2 = new THREE.Vector2( -1 , -1 )
    control : any

    // tooltip : HTMLElement

    constructor(camera:THREE.Camera,domElement:HTMLElement){
        this.camera = camera
        this.control = new orbitControls(camera,domElement)
        this.control.autoRotate = false
        this.raycaster = new THREE.Raycaster()

        // this.tooltip = document.getElementById('tooltip_anchor')
        // this.tooltip.addEventListener('click',(e)=>{
        //     e.stopPropagation()
        // },false)
    }

    /* this event may become obsolete soon */
    mouseClickEvent( canvas:HTMLElement , e:any , modSofa: ModifySofaDialog ){
        // if( this.sofaInFocus ){
        //     this.tooltip.style.left = '-9999'
        //     this.sofaInFocus = false
        // }else if( this.INTERSECT ){
        //     this.sofaInFocus = true
        //     this.tooltip.style.left = e.clientX
        //     this.tooltip.style.top = e.clientY
        //     modSofa.findSofa( this.INTERSECT )
        // }
    }

    mouseMoveEvent( canvas:HTMLElement, e:any ){
        this.mouse.x = e.clientX / canvas.clientWidth * 2 - 1
        this.mouse.y = - ( e.clientY / canvas.clientHeight * 2 )+ 1
    }
}

export class OnHoverControls{

    sphereMaterial : THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
        depthTest : false,
        opacity : 0.3,
        transparent:true,
        blending:THREE.CustomBlending,
        blendEquation:THREE.AddEquation,
        blendSrc:THREE.SrcAlphaFactor,
        blendDst:THREE.OneMinusSrcAlphaFactor
        // blendSrcAlpha:0.3
    })
    solidMaterial : THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({

    })
    sphereGeometry : THREE.SphereGeometry = new THREE.SphereGeometry(NODESIZE,16,16)

    refMesh : THREE.Mesh = new THREE.Mesh()

    materialSphere : THREE.Mesh = new THREE.Mesh(this.sphereGeometry,this.sphereMaterial.clone())

    leftSphere : THREE.Mesh = new THREE.Mesh(this.sphereGeometry,this.sphereMaterial.clone())
    rightSphere : THREE.Mesh = new THREE.Mesh(this.sphereGeometry,this.sphereMaterial.clone())
    topSphere : THREE.Mesh = new THREE.Mesh(this.sphereGeometry,this.sphereMaterial.clone())
    bottomSphere : THREE.Mesh = new THREE.Mesh(this.sphereGeometry,this.sphereMaterial.clone())


    materialSolid : THREE.Mesh = new THREE.Mesh(this.sphereGeometry,this.solidMaterial.clone())

    leftSolid : THREE.Mesh = new THREE.Mesh(this.sphereGeometry,this.solidMaterial.clone())
    rightSolid : THREE.Mesh = new THREE.Mesh(this.sphereGeometry,this.solidMaterial.clone())
    topSolid : THREE.Mesh = new THREE.Mesh(this.sphereGeometry,this.solidMaterial.clone())
    bottomSolid : THREE.Mesh = new THREE.Mesh(this.sphereGeometry,this.solidMaterial.clone())

    target : THREE.Mesh

    sofaFactory : SofaFactory

    smallerTooltip : HTMLElement

    constructor(factory:SofaFactory){
        this.refMesh.add( this.materialSphere )
        this.refMesh.add( this.leftSphere )
        this.refMesh.add( this.rightSphere )
        this.refMesh.add( this.topSphere )
        this.refMesh.add( this.bottomSphere )

        this.refMesh.add( this.materialSolid )
        this.refMesh.add( this.leftSolid )
        this.refMesh.add( this.rightSolid )
        this.refMesh.add( this.topSolid )
        this.refMesh.add( this.bottomSolid )

        this.materialSolid.position.set(0,SOFAHEIGHT,0)
        this.leftSolid.position.set(-SOFAWIDTH/2,SOFAHEIGHT,0)
        this.rightSolid.position.set(SOFAWIDTH/2,SOFAHEIGHT,0)
        this.topSolid.position.set(0,SOFAHEIGHT,-SOFAWIDTH/2)
        this.bottomSolid.position.set(0,SOFAHEIGHT,SOFAWIDTH/2)

        this.materialSphere.position.set(0,SOFAHEIGHT,0)
        this.leftSphere.position.set(-SOFAWIDTH/2,SOFAHEIGHT,0)
        this.rightSphere.position.set(SOFAWIDTH/2,SOFAHEIGHT,0)
        this.topSphere.position.set(0,SOFAHEIGHT,-SOFAWIDTH/2)
        this.bottomSphere.position.set(0,SOFAHEIGHT,SOFAWIDTH/2)  

        this.sofaFactory = factory

        this.smallerTooltip = document.getElementById('tooltip_singular')
        this.smallerTooltip.addEventListener('click',e=>e.stopPropagation())
    }

    tetherTo(target:THREE.Mesh){
        
        if( this.target ){
            this.target.remove( this.refMesh )
        }

        if( target ){
            let targetSofa = this.sofaFactory.findSofa( target )
            if( targetSofa ){
                this.target = targetSofa.mesh
                this.target.add( this.refMesh )
            }
        }else{
            this.target = null
        }
    }

    INTERSECTS : any[] = []
    sphereOnHover : boolean = false
    sphereOnSelect : boolean = false

    lightupObj(obj:any){
        this.refMesh.children.forEach( child => {
            if(child === obj ){
                 obj.currentHex = obj.material.emissive.getHex()
                 obj.material.emissive.setHex( HIGHLIGHT_COLOR2 )
                 this.INTERSECTS.push( obj )
                 this.sphereOnHover = true
            } 
        })
    }

    mouseClickEvent(canvas,e,modsofa:ModifySofaDialog){
        if( !this.sphereOnSelect && this.INTERSECTS.length > 0 ){
            this.smallerTooltip.style.left = e.clientX
            this.smallerTooltip.style.top = e.clientY
            this.showToolTip()
            this.sphereOnSelect = true
        }else{
            this.dismissTooltip()
        }
    }

    selectedSofa : Sofa
    selectedSide : string

    showToolTip(){
        this.selectedSofa = this.sofaFactory.findSofa( this.INTERSECTS[0].parent )

        /* then find the node that was clicked */
        if( Math.abs( this.INTERSECTS[0].position.x - this.INTERSECTS[0].parent.position.x ) < 0.01 ){
            if( Math.abs( this.INTERSECTS[0].position.z - this.INTERSECTS[0].parent.position.z ) < 0.01 ){
                /* material sphere */
                this.selectedSide = 'color'
            }else if( this.INTERSECTS[0].position.z > this.INTERSECTS[0].parent.position.z ){
                /* bottom node */
                this.selectedSide = 'bottom'
            }else if( this.INTERSECTS[0].position.z < this.INTERSECTS[0].parent.position.z ){
                /* top node */
                this.selectedSide = 'top'
            }
        }else if( this.INTERSECTS[0].position.x > this.INTERSECTS[0].parent.position.x ){
            /* right node */
            this.selectedSide = 'right'
        }else if( this.INTERSECTS[0].position.x < this.INTERSECTS[0].parent.position.x ){
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
            removeMe.className = ' smaller'
            removeMe.innerHTML = 'remove'
            removeMe.addEventListener('click',(ev:any)=>{
                this.sofaFactory.remove(this.selectedSofa,this.selectedSide)
                this.dismissTooltip()
            })
            accElement.appendChild(accName).appendChild(removeMe)

            this.smallerTooltip.innerHTML = ``
            this.smallerTooltip.appendChild(accElement)

            /* if the selected node is a backrest, append an additional option: mirrorclone */
            if (this.selectedSofa[this.selectedSide].constructor.name == 'Backsupport'){
                
                let mirrorClone = document.createElement('div')

                if ( this.selectedSofa['mirror' + this.selectedSide] ){
                    let title = document.createElement('span')
                    title.innerHTML = 'Mirrored Sofa'
                    let removeButton = document.createElement('span')
                    removeButton.className = ' smaller'
                    removeButton.innerHTML = 'remove'
                    removeButton.addEventListener('click',(ev:any)=>{
                        this.sofaFactory.remove( this.selectedSofa,'mirror'+this.selectedSide )
                        this.dismissTooltip()
                    })
                    mirrorClone.appendChild(title).appendChild(removeButton)
                }else{
                    mirrorClone.className = ' smaller'
                    mirrorClone.innerHTML = 'Mirror Clone'
                    mirrorClone.addEventListener('click',(ev:any)=>{
                        this.cloneMirror(this.selectedSofa,this.selectedSide)
                        this.dismissTooltip()
                    })
                }
                this.smallerTooltip.appendChild(mirrorClone)
            }
        }else{
            this.smallerTooltip.innerHTML = ``
            let accElement = document.createElement('div')
            let elements = []
            switch(this.selectedSide){
                case 'top':
                case 'bottom':{
                    
                    let accNameAddBackSupport = document.createElement('div')
                    accNameAddBackSupport.innerHTML = `add Backsupport`
                    accNameAddBackSupport.className = `smaller`
                    accNameAddBackSupport.addEventListener('click',()=>{
                        this.sofaFactory.addBacksupport(this.selectedSofa,this.selectedSide)
                        this.dismissTooltip()
                    })

                    let accNameAddSofa = document.createElement('div')
                    accNameAddSofa.innerHTML = `add Sofa`
                    accNameAddSofa.className = `smaller`
                    accNameAddSofa.addEventListener('click',()=>{
                        this.sofaFactory.makeANewSofa(this.selectedSofa,this.selectedSide)
                        this.dismissTooltip()
                    })

                    elements = [accNameAddBackSupport,accNameAddSofa]
                }break;
                case 'left':
                case 'right':{

                    let accNameAddArmRest = document.createElement('div')
                    accNameAddArmRest.innerHTML = `add Armrest`
                    accNameAddArmRest.className = `smaller`
                    accNameAddArmRest.addEventListener('click',()=>{
                        this.sofaFactory.addArmrest(this.selectedSofa,this.selectedSide)
                        this.dismissTooltip()
                    })
                    let accNameAddSofa = document.createElement('div')
                    accNameAddSofa.innerHTML = `add Sofa`
                    accNameAddSofa.className = `smaller`
                    accNameAddSofa.addEventListener('click',()=>{
                        this.sofaFactory.makeANewSofa(this.selectedSofa,this.selectedSide)
                        this.dismissTooltip()
                    })
                    elements = [accNameAddArmRest,accNameAddSofa]

                }break;
                case 'color':{
                    let rowEl = document.createElement('div')

                    let materialColor = document.createElement('span')
                    // materialColor.innerHTML = 'chnage color'//this.selectedSofa[this.selectedSide].constructor.name
                    
                    let colors = [WHITE,BLUE,PINK,BROWN,BLACK]
                    colors.forEach(color=>{
                        let colorEl = document.createElement('span')
                        colorEl.className = `colorEl`
                        colorEl.style.backgroundColor = `#${color.toString(16)}`
                        colorEl.style.setProperty('display','inline-block')
                        colorEl.addEventListener('click',()=>this.sofaFactory.changeColor(this.selectedSofa,color))
                        materialColor.appendChild(colorEl)
                    })
                    rowEl.appendChild(materialColor)

                    let removeSofa = document.createElement('div')
                    removeSofa.innerHTML = `remove sofa`
                    removeSofa.className = `smaller`
                    removeSofa.addEventListener('click',()=>{
                        let parentSofa = this.sofaFactory.findSofa(this.selectedSofa.mesh.parent)
                        let sides = ['left','right','top','bottom','mirrortop','mirrorbottom']
                        
                        /* currently, the root sofa cannot be deleted */
                        if( parentSofa ){
                            let parentSide = sides.find(side=>parentSofa[side]===this.selectedSofa)
                            this.sofaFactory.remove(parentSofa,parentSide)
                        }
                        this.dismissTooltip()
                    })

                    elements = [rowEl,removeSofa]
                }break;
            }
            elements.forEach(el => accElement.appendChild(el))
            this.smallerTooltip.appendChild(accElement)
        }
    }

    cloneMirror(targetSofa:Sofa,side:string){
        let ztranslation
        side == 'top' ? ztranslation = - SOFAWIDTH - SOFAWIDTH*0.13 : 
        side == 'bottom' ? ztranslation = SOFAWIDTH + SOFAWIDTH*0.13 : 
        console.log('clone mirror error',side);

        if( !ztranslation ){
            return
        }

        let newSofa = targetSofa.clone(this.sofaFactory)
        newSofa.mirrorXZ()
        this.sofaFactory.sofaLedger.push(newSofa)
        targetSofa['mirror'+side] = newSofa
        targetSofa.mesh.add( newSofa.mesh )

        /* figuring out the translation */
        newSofa.mesh.position.set(0,0,ztranslation) 
    }

    /* dismiss tooltip */
    dismissTooltip(){
        this.smallerTooltip.style.left = '-9999'
        this.sphereOnHover = false
        this.sphereOnSelect = false
    }
}
