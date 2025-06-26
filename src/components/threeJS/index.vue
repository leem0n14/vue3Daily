<template>
    <div class="three-container">
        <div ref="containerRef" class="container"></div>
    </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
// @ts-ignore
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
// @ts-ignore
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { onMounted, ref, onUnmounted } from 'vue'

const containerRef = ref<HTMLDivElement>()

let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let animationId: number

// 卡片和动画参数
let cards: THREE.Mesh[] = []
let cardGroup: THREE.Group
let person: THREE.Mesh
let textMesh: THREE.Mesh

let mouse = new THREE.Vector2()
let raycaster = new THREE.Raycaster()
let hoveredCardIndex: number | null = null
let containerRect: DOMRect
let cardTargetRotations: number[] = [0, 0, 0]
let cardCurrentScales: number[] = [1, 1, 1]

onMounted(() => {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x232323)
    
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 2, 11)
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.value?.appendChild(renderer.domElement)
    
    // 光源
    scene.add(new THREE.AmbientLight(0xffffff, 1))
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(5, 10, 7)
    scene.add(dirLight)
    
    // 卡片组
    cardGroup = new THREE.Group()
    const cardMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.3, roughness: 0.7 })
    for (let i = 0; i < 7; i++) {
        const cardGeo = new THREE.BoxGeometry(5, 2, 0.1)
        const card = new THREE.Mesh(cardGeo, cardMaterial.clone())
        card.position.set(-4 + i * 4, 0.5, 0)
        card.castShadow = true
        card.receiveShadow = true
        cards.push(card)
        cardGroup.add(card)
    }
    scene.add(cardGroup)
    
    // 人物模型（用胶囊体或立方体代替）
    const bodyGeo = new THREE.CapsuleGeometry(0.6, 2, 8, 16)
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x00ff66 })
    person = new THREE.Mesh(bodyGeo, bodyMat)
    person.position.set(0, 1.5, 0.5)
    scene.add(person)
    
    // 头部
    const headGeo = new THREE.SphereGeometry(0.5, 16, 16)
    const headMat = new THREE.MeshStandardMaterial({ color: 0x222222 })
    const head = new THREE.Mesh(headGeo, headMat)
    head.position.set(0, 2.5, 0.5)
    scene.add(head)
    
    // 3D文字
    const fontLoader = new FontLoader()
    fontLoader.load('https://unpkg.com/three@0.150.1/examples/fonts/helvetiker_regular.typeface.json', (font: any) => {
      
        textMesh.position.set(-3.5, 3.5, 0)
        textMesh.rotation.x = -0.1
        scene.add(textMesh)
    })
    
    containerRect = renderer.domElement.getBoundingClientRect()
    renderer.domElement.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', () => {
        containerRect = renderer.domElement.getBoundingClientRect()
        onWindowResize()
    })
    cardTargetRotations = [0, 0, 0]
    cardCurrentScales = [1, 1, 1]
    animate()
})

function animate() {
    animationId = requestAnimationFrame(animate)
    
    // 卡片浮动动画 & 鼠标指向旋转
    cardGroup.children.forEach((card: THREE.Object3D, i: number) => {
        card.position.y = 0.5 + Math.sin(Date.now() * 0.001 + i) * 0.2
        // 鼠标悬停时让卡片朝向鼠标
        let targetY = Math.sin(Date.now() * 0.001 + i) * 0.1
        if (hoveredCardIndex === i) {
            // 计算鼠标射线与卡片所在平面的交点
            const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -card.position.z)
            raycaster.setFromCamera(mouse, camera)
            const intersectPoint = new THREE.Vector3()
            raycaster.ray.intersectPlane(plane, intersectPoint)
            // 计算卡片中心到交点的方向
            const target = intersectPoint.clone().sub(card.position)
            const targetAngle = Math.atan2(target.x, target.z)
            // 平滑插值旋转（限制最大旋转速度）
            const maxStep = 0.08
            let delta = targetAngle - (card.rotation.y || 0)
            if (delta > Math.PI) delta -= Math.PI * 2
            if (delta < -Math.PI) delta += Math.PI * 2
            delta = Math.max(-maxStep, Math.min(maxStep, delta))
            cardTargetRotations[i] = (card.rotation.y || 0) + delta
            // 放大效果
            cardCurrentScales[i] += (1.08 - cardCurrentScales[i]) * 0.15
            // 高亮阴影
            if (card instanceof THREE.Mesh) {
                const mat = card.material as THREE.MeshStandardMaterial
                if (mat.emissive && typeof mat.emissive.set === 'function') {
                    mat.emissive.set(0x333333)
                }
                mat.emissiveIntensity = 0.5
            }
        } else {
            // 恢复初始角度和平滑缩放
            cardTargetRotations[i] += (0 - cardTargetRotations[i]) * 0.08
            cardCurrentScales[i] += (1 - cardCurrentScales[i]) * 0.1
            // 恢复阴影
            if (card instanceof THREE.Mesh) {
                const mat = card.material as THREE.MeshStandardMaterial
                if (mat.emissive && typeof mat.emissive.set === 'function') {
                    mat.emissive.set(0x000000)
                }
                mat.emissiveIntensity = 0
            }
        }
        // 应用旋转和平滑缩放
        card.rotation.y = cardTargetRotations[i]
        card.scale.set(cardCurrentScales[i], cardCurrentScales[i], cardCurrentScales[i])
        card.rotation.x = Math.cos(Date.now() * 0.001 + i) * 0.05
    })
    
    // 人物轻微呼吸动画
    if (person) {
        person.position.y = 1.5 + Math.sin(Date.now() * 0.001) * 0.1
    }
    
    // 文字轻微发光动画
    if (textMesh) {
        (textMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.002) * 0.2
    }
    
    renderer.render(scene, camera)
}

function onWindowResize(): void {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

function onMouseMove(event: MouseEvent) {
    if (!containerRect) return
    // 计算鼠标在canvas中的归一化坐标
    mouse.x = ((event.clientX - containerRect.left) / containerRect.width) * 2 - 1
    mouse.y = -((event.clientY - containerRect.top) / containerRect.height) * 2 + 1
    // 使用射线检测鼠标悬停的卡片
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(cards)
    if (intersects.length > 0) {
        hoveredCardIndex = cards.indexOf(intersects[0].object as THREE.Mesh)
    } else {
        hoveredCardIndex = null
    }
}

onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', onWindowResize)
    if (renderer) renderer.dispose()
    renderer.domElement.removeEventListener('mousemove', onMouseMove)
})
</script>

<style scoped>
.three-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: #232323;
}
.container {
    width: 100vw;
    height: 100vh;
}
</style>