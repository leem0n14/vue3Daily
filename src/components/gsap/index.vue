<template>
  <div ref="containerRef" class="card-container">
    <div ref="cardRef" class="card">
      滚动容器，卡片会旋转
    </div>
    <div style="height: 1200px">1</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const cardRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

function handleScroll() {
  if (!containerRef.value) return
  const scrollY = containerRef.value.scrollTop
  const rotate = Math.min(scrollY/2, 360)
  if (cardRef.value) {
    gsap.to(cardRef.value, { rotateY: rotate, duration: 1, ease: 'power2.out' })
  }
}

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped lang="scss">
.card-container {
  height: 80vh;
  overflow-y: scroll;
  background: #f5f6fa;
  padding-top: 100px;
  border: 1px solid #eee;
}
.card {
  width: 300px;
  height: 180px;
  background: #fff;
  border-radius: 16px;
  
  transition: box-shadow 0.3s;
  will-change: transform;
  perspective: 800px;
  transform-style: preserve-3d;

  position: fixed;
}
</style>
