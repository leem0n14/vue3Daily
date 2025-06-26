<template>
    <div class="three-container">
        <h1>threeJS</h1>
        <div ref="containerRef" class="container"></div>
    </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, ref, onUnmounted } from 'vue'

const containerRef = ref<HTMLDivElement>()

let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let cube: THREE.Mesh
let animationId: number

onMounted(() => {
    // 创建场景
    scene = new THREE.Scene()
    
    // 创建相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1)
    
    // 添加到容器
    containerRef.value?.appendChild(renderer.domElement)
    
    // 创建一个立方体
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    
    // 添加一些光源
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)
    
    // 开始渲染循环
    animate()
    
    // 监听窗口大小变化
    window.addEventListener('resize', onWindowResize)
})

// 渲染循环
function animate() {
    animationId = requestAnimationFrame(animate)
    
    // 旋转立方体
    if (cube) {
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
    }
    
    // 渲染场景
    renderer.render(scene, camera)
}

// 窗口大小变化处理
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

// 清理资源
onUnmounted(() => {
    if (animationId) {
        cancelAnimationFrame(animationId)
    }
    window.removeEventListener('resize', onWindowResize)
    if (renderer) {
        renderer.dispose()
    }
})
</script>

<style scoped>
.three-container {
    width: 100%;
    height: 100vh;
    position: relative;
}

.container {
    width: 100%;
    height: calc(100vh - 60px);
    position: relative;
}

h1 {
    margin: 0;
    padding: 20px;
    background: #f0f0f0;
    text-align: center;
}
</style>