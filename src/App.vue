<template>
  <div>
    <div class="controls">
      <span class="controls__changer" @click="changeMode">
        Режим: {{ mode }}
      </span>
      <div class="history" v-if="isEdit">
        <img
          class="history__button history__button_undo"
          :class="{ history__button_opacity: !canUndo }"
          src="./assets/images/undo-svgrepo-com.svg"
          alt="undo"
          @click="undo"
        />
        <img
          class="history__button history__button_redo"
          :class="{ history__button_opacity: !canRedo }"
          src="./assets/images/redo-svgrepo-com.svg"
          alt="redo"
          @click="redo"
        />
      </div>
    </div>
    <ag-grid-vue
      :rowData="tree.getAll()"
      :columnDefs
      :treeData="true"
      :treeDataParentIdField="treeDataParentIdField"
      :getRowId="getRowId"
      :autoGroupColumnDef="autoGroupColumn"
      :groupDefaultExpanded="-1"
      @cell-value-changed="onCellValueChanged"
      style="height: calc(100vh - 64px)"
    >
    </ag-grid-vue>
  </div>
</template>

<script setup lang="ts">
true;
import { AgGridVue } from "ag-grid-vue3"; // Vue Grid Logic

import {
  AllEnterpriseModule,
  LicenseManager,
  ModuleRegistry,
  type CellValueChangedEvent,
} from "ag-grid-enterprise";
import { computed, ref } from "vue";
import { UndoableTreeStore } from "./lib/UndoableTreeStore";
import EditButtons from "./components/EditButtons.vue";
import type { guid } from "./lib/types";
ModuleRegistry.registerModules([AllEnterpriseModule]);
LicenseManager.setLicenseKey(
  "[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-090576}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{31 August 2025}____[v3]_[0102]_MTc1NjU5NDgwMDAwMA==055771d37eabf862ce4b35dbb0d2a1df"
);

const items = [
  { id: 1, parent: null, label: "Айтем 1" },
  {
    id: "2",
    parent: 1,
    label: "Айтем 2",
  },
  { id: 3, parent: 1, label: "Айтем 3" },
  {
    id: 4,
    parent: "2",
    label: "Айтем 4",
  },
  {
    id: 5,
    parent: "2",
    label: "Айтем 5",
  },
  {
    id: 6,
    parent: "2",
    label: "Айтем 6",
  },
  { id: 7, parent: 4, label: "Айтем 7" },
  { id: 8, parent: 4, label: "Айтем 8" },
];
const tree = ref(new UndoableTreeStore(items));
const isEdit = ref(true);

const mode = computed(() => (isEdit.value ? "редактирования" : "просмотра"));
const changeMode = () => {
  isEdit.value = !isEdit.value;
};
const treeDataParentIdField = ref("parent");
const getRowId = (params: any) => params.data.id.toString();
const autoGroupColumn = {
  headerName: "Категория",
  flex: 1,

  cellRendererParams: (params: any) => ({
    innerRenderer: EditButtons,
    title: getCategory(params.node.data.id) ? "Группа" : "Элемент",
    isEdit: () => isEdit.value,
    onAddItem: () => onAddItem(params.data?.id),
    onRemoveItem: () => onRemoveItem(params.data?.id),
    suppressCount: true,
  }),
  valueGetter: (params: any) =>
    getCategory(params.node.data.id) ? "Группа" : "Элемент",
};

const getCategory = (id: guid) => {
  return !!tree.value.getChildrenIds(id)?.length;
};

const columnDefs = computed(() => {
  return [
    {
      headerName: "№ п/п",
      valueGetter: (p: any) => p.node.rowIndex + 1,
      lockPosition: true,
      width: 100,
    },
    {
      headerName: "Наименование",
      field: "label",
      editable: isEdit.value,
      flex: 2,
    },
  ];
});

function onAddItem(id: guid) {
  const guid = id.toString() + Date.now().toString();
  tree.value.addItem({ id: guid, parent: id, label: "" });
}

function onRemoveItem(id: guid) {
  tree.value.removeItem(id);
}

function onCellValueChanged(event: CellValueChangedEvent) {
  tree.value.updateItem(event.data);
}

const canUndo = computed(() => {
  return tree.value.canUndo();
});

const canRedo = computed(() => {
  return tree.value.canRedo();
});

function undo() {
  tree.value.undo();
}

function redo() {
  tree.value.redo();
}

// const myTheme = themeQuartz.withPart(colorSchemeDarkWarm);
</script>
<style scoped>
.controls {
  height: 38px;
  padding-block: 5px;
  display: flex;
  align-items: center;
  color: #488dda;
  font-family: sans-serif, serif;
}

.controls__changer {
  cursor: pointer;
}
.history {
  display: flex;
}
.history__button {
  width: 20px;
  color: #488dda;
  fill: #488dda;
  cursor: pointer;
}

.history__button_opacity {
  opacity: 0.5;
}

.history__button_undo {
  padding: 10px 5px 10px 10px;
}
.history__button_redo {
  padding: 10px 10px 10px 5px;
}
</style>
