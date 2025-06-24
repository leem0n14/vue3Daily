<template>
    <div>
        <span> 通过控制 inputType <span style="color: blue;"> {{ inputType }} </span> 的方式来控制密码的显示与隐藏 </span>
        <form action="">
            <input :type="inputType" v-model="password1">
            <img v-if="inputType === 'password'" @click="changeType" src="./assets/show.svg" alt="o">
            <img v-if="inputType === 'text'" @click="changeType" src="./assets/hide.svg" alt="-">
        </form>

        <span> 通过手动控制 value 的方式 好瓜的方式</span>
        <form action="">
            <input
                :value="passwordDisplay"
                @input="onInput"
                :type="'text'"
                autocomplete="off"
            >
            <img v-if="!isPasswordVisible" @click="togglePasswordVisibility" src="./assets/show.svg" alt="o">
            <img v-else @click="togglePasswordVisibility" src="./assets/hide.svg" alt="-">
        </form>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const inputType = ref('password')
const password1 = ref('hello password')
const changeType = () => {
    inputType.value = inputType.value === 'password' ? 'text' : 'password'
}

const passwordTrue = ref('')
const isPasswordVisible = ref(false)

const passwordDisplay = computed(() => {
    return isPasswordVisible.value
        ? passwordTrue.value
        : '*'.repeat(passwordTrue.value.length)
})

function onInput(e: Event) {
    const input = e.target as HTMLInputElement
    if (isPasswordVisible.value) {
        passwordTrue.value = input.value
    } else {
        // 只允许在密文状态下追加或删除最后一位
        const oldLen = passwordTrue.value.length
        const newLen = input.value.length
        if (newLen > oldLen) {
            // 追加
            passwordTrue.value += input.value.slice(-1)
        } else if (newLen < oldLen) {
            // 删除
            passwordTrue.value = passwordTrue.value.slice(0, newLen)
        }
        // 其他情况（如粘贴星号等）不处理
    }
}

function togglePasswordVisibility() {
    isPasswordVisible.value = !isPasswordVisible.value
}
</script>