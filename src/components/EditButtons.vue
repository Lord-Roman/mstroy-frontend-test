<template>
  <div class="container">
    <span class="title">{{ title }}</span>
    <div class="buttons" v-if="isEdit">
      <button class="button button_blue" @click="onAddItem">+</button>
      <button class="button button_red" @click="onRemoveItem">+</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface RendererParams {
  title: string;
  isEdit: () => boolean;
  onAddItem: () => void;
  onRemoveItem: () => void;
}

const props = defineProps<{
  params: RendererParams;
}>();

const { title, onAddItem, onRemoveItem } = props.params;

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
  padding-inline: 12px;
  height: 100%;
}

.buttons button {
  width: 24px;
  height: 24px;
  border-radius: 100%;
  border: none;
  color: white;
  margin-right: 8px;
  font-size: 24px;
  line-height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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
