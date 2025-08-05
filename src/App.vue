<template>
  <ag-grid-vue
    :theme = "myTheme"
    :rowData="tree.getAll()"
    :columnDefs
    :treeData="true"
    :treeDataParentIdField="treeDataParentIdField"
    :getRowId="getRowId"
    :autoGroupColumnDef="autoGroupColumnDef"
    :groupDefaultExpanded="-1"
    style="height: 500px"
  >
  </ag-grid-vue>
</template>

  <!-- <ag-grid-vue
    :rowData="items"
    :columnDefs="cols"
    :defaultColDef="defaultColDef"
    :autoGroupColumnDef="autoGroupColumnDef"
    :groupDefaultExpanded="-1"
    :suppressRowClickSelection="true"
    :treeData="true"
    style="height: 500px"
  >
  </ag-grid-vue> -->

<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3"; // Vue Grid Logic

import {
  AllEnterpriseModule,
  colorSchemeDarkWarm,
  LicenseManager,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
} from "ag-grid-enterprise";
import { ref } from "vue";
import { TreeStore, type guid } from "./lib/treeStore";
ModuleRegistry.registerModules([AllEnterpriseModule]);
LicenseManager.setLicenseKey("[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-090576}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{31 August 2025}____[v3]_[0102]_MTc1NjU5NDgwMDAwMA==055771d37eabf862ce4b35dbb0d2a1df");

const items = [
{id: 1, parent: null, label: 'Айтем 1' },
{id: '2'
, parent: 1, label: 'Айтем 2' },
{id: 3, parent: 1, label: 'Айтем 3' },
{id: 4, parent: '2'
, label: 'Айтем 4' },
{id: 5, parent: '2'
, label: 'Айтем 5' },
{id: 6, parent: '2'
, label: 'Айтем 6' },
{id: 7, parent: 4, label: 'Айтем 7' },
{id: 8, parent: 4, label: 'Айтем 8' }
];

const treeDataParentIdField = ref('parent');
const getRowId = (params:any) => params.data.id.toString();
const autoGroupColumnDef = {
    headerName: "Категория", valueGetter: (p:any) => getCategory(p.node.data.id) ?  'Группа' :'Элемент' , flex: 1, cellRendererParams: {
        suppressCount: true,
      }, 
};

const tree = ref(new TreeStore(items));

const columnDefs = ref<ColDef[]>([
  { headerName: "№ п/п", valueGetter: (p:any) => p.node.rowIndex + 1, width: 100},
  { headerName: "Наименование", field: "label", flex: 1 },
])

const getCategory = (id: guid) => {
    console.log(tree.value.getChildren(id))

    return !!tree.value.getChildrenArray(id)?.length;
}
// const isEdited = ref(false)

// const statusBar = {
//   statusPanels: [
//     {
//       statusPanel: "agTotalAndFilteredRowCountComponent",
//       align: "left",
//     },
//   ],
// };

// const getCategory = (params: any) => {
//   console.log(params);
//   return 'Элемент'
// }

// const cols = computed(() => {
//   return [
//     { headerName: "№ п/п", valueGetter: (params: any) => params.node.rowIndex + 1, width: 80 },
//     { field: "label", headerName: "Наименование", editable: isEdited.value },
//   ]
// })

// const autoGroupColumnDef = ref<ColDef>({
//   headerName: "Категория",
//   minWidth: 350,
//   valueGetter: (params: any) => params?.data ? getCategory(params.node.data) : '',
//   cellRendererParams: { suppressCount: true }
// })

// const defaultColDef = ref({
//   flex: 1,
//   minWidth: 150,
//   resizable: true,
// })


const myTheme = themeQuartz.withPart(colorSchemeDarkWarm);

</script>
<style scoped>
</style>
