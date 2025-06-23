<script setup lang="ts">
import { ref } from 'vue';
import { componentNames, modules } from './utils/autoGetComponents';

const currentComponent = ref(componentNames[0]);

function selectComponent(name: string) {
  currentComponent.value = name;
}
</script>

<template>
  <div class="mainPage">
    <!-- <div class="box">1</div>  测试scss-->
    <div class="leftNav">
      <ul>
        <li v-for="name in componentNames" :key="name" @click="selectComponent(name)"
          :style="{ cursor: 'pointer', fontWeight: name === currentComponent ? 'bold' : 'normal' }">
          {{ name }}
        </li>
      </ul>
    </div>
    <div class="content">
      <component :is="modules[`../components/${currentComponent}.vue`].default" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.mainPage {
  height: 100vh;
  width: 100vw;
  background-color: white;
  display: flex;
  box-sizing: border-box;
  overflow: hidden;

  .box {
    height: 200px;
    width: 200px;
    background-color: red;
  }

  .leftNav {
    min-height: 100vh;
    width: 200px;
    border-right: 2px solid #f5f7fa;
    box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
    overflow-y: auto;
  }

  .content {
    min-height: 100vh;
    overflow-y: auto;
    padding-left: 20px;
    padding-top: 20px;
    flex: 1;
  }
}
</style>
