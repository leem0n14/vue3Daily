<template>
  <div ref="containerRef" class="card-container">
    <div 
      v-for="(card, index) in cards" 
      :key="index"
      :ref="el => cardRefs[index] = el"
      class="card"
      :style="{ left: `${200 + index * 200}px` }"
    >
      卡片 {{ index + 1 }} - 滚动容器，卡片会旋转
    </div>
    <div style="height: 1200px">1</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const cardRefs = ref<(HTMLElement | null)[]>([])
const containerRef = ref<HTMLElement | null>(null)

// 创建多个卡片数据
const cards = ref(Array.from({ length: 5 }, (_, i) => ({ id: i })))

function handleScroll() {
  if (!containerRef.value) return
  const scrollY = containerRef.value.scrollTop
  
  cardRefs.value.forEach((cardRef, index) => {
    if (cardRef) {
      // 每张卡片有不同的旋转角度，基于滚动位置和卡片索引
      const rotate = Math.min((scrollY) / 2, 70)
      gsap.to(cardRef, { 
        rotateY: rotate, 
        rotateX: -rotate,
        duration: 0.5, 
        ease: 'power2.out' 
      })
    }
  })
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
  left: 50px;
  
  // 为不同卡片添加不同的颜色
  &:nth-child(1) { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
  &:nth-child(2) { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; }
  &:nth-child(3) { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; }
  &:nth-child(4) { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; }
  &:nth-child(5) { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; }
  
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
</style>
