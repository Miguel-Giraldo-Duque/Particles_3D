import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const textureParticle = textureLoader.load("./textures/particles/12.png")

console.log(textureParticle)
/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)


// geometry

const sphereGeometry = new THREE.SphereGeometry(1, 32 ,32);


const count = 5000
const Pointsgeometry =  new THREE.BufferGeometry()
const array = new Float32Array(count * 3)
const arrayColors = new Float32Array(count * 3)

const atrr = new THREE.BufferAttribute(array, 3)
const atrrColor = new THREE.BufferAttribute(arrayColors, 3)

for (let i = 0; i < array.length; i++) {
    array[i] = (Math.random() -0.5) * 10 ;


    const i3 = i * 3 
    const isYellow = 0 // Retorna 0 o 1


    if (isYellow == 0 ) {
        arrayColors[i3 + 1] = 1
        arrayColors[i3] = 1
        arrayColors[i3 + 2] = 1
    }
    // }else{
    //     arrayColors[i3 + 2] = 1
    //     arrayColors[i3] = 0
    // }

}


// Particle animation


Pointsgeometry.setAttribute("position", atrr)
Pointsgeometry.setAttribute("color", atrrColor)


//Material
const particlesMaterial =  new THREE.PointsMaterial()
particlesMaterial.size = 0.1
particlesMaterial.sizeAttenuation = true
particlesMaterial.alphaMap =textureParticle
// particlesMaterial.color = new THREE.Color("green")
//particlesMaterial.alphaTest = 0.01
particlesMaterial.transparent = true
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending
particlesMaterial.vertexColors = true

// points

const points = new THREE.Points(Pointsgeometry, particlesMaterial)

scene.add(points)


/**
* Sizes*/
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    for (let i = 0; i < array.length; i++) {
        const i3 = i * 3
        const x = Pointsgeometry.attributes.position.array[i3 + 2]
        Pointsgeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime - x)
    }

     Pointsgeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()