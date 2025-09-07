<script setup lang="ts">
interface Props {
  name: string
  size?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  class: ''
})

const iconSize = `${props.size}px`
</script>

<template>
  <!-- Bootstrap Icons 使用 <i> 标签和 CSS 类名 -->
  <i 
    :class="`bi bi-${props.name} ${props.class}`"
    :style="{ fontSize: iconSize }"
  ></i>
</template>

<style>
/* 引入 Bootstrap Icons CSS */
@import 'bootstrap-icons/font/bootstrap-icons.css';
</style>