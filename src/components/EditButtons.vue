<template>
  <div class="container">
    <span class="title">{{ title }}</span>
    <div class="buttons" v-if="isEdit">
      <button class="button button_blue" @click="OnAddItem">+</button>
      <button class="button button_red" @click="OnRemoveItem">+</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface RendererParams {
  title: string;
  isEdit: () => boolean;
  OnAddItem: () => void;
  OnRemoveItem: () => void;
}

const props = defineProps<{
  params: RendererParams;
}>();

const { title, OnAddItem, OnRemoveItem } = props.params;

const isEdit = computed(() => props.params.isEdit());
</script>
<style>
.container {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}

.title {
  flex-grow: 1;
}

.buttons {
  display: flex;
}

.buttons button {
  width: 24px;
  height: 24px;
  border-radius: 100%;
  border: none;
  color: white;
  margin-right: 8px;
  font-size: 24px;
  text-align: center;
  line-height: 24px;
  cursor: pointer;
}

.button_blue {
  background-color: #488dda;
}

.button_red {
  background-color: #d22328;
  transform: rotate(45deg);
}

.ag-cell-value,
.ag-group-value {
  width: 100%;
  overflow: visible;
}
</style>
