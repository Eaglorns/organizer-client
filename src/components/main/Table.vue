<template>
  <div class="q-pa-md">
    <q-table
      v-model:selected="selected"
      v-model:pagination="pagination"
      selection="single"
      class="my-sticky-table my-table-border"
      flat
      bordered
      row-key="id"
      :rows="rows"
      :columns="columns"
      :separator="separator"
      :wrap-cells="true"
      :hide-bottom="true">
      <template v-slot:header-cell="props">
        <q-th :props="props" style="font-size: medium">
          <span class="text-weight-bold text-indigo-10">
            {{ props.col.label }}
          </span>
        </q-th>
      </template>
      <template v-slot:body="props">
        <q-tr
          class="my-table-border"
          :props="props"
          @click="preSelectAction(props)">
          <q-td class="my-table-border">
            <q-checkbox
              v-model="props.selected"
              @click="selectAction(props.row.id)" />
          </q-td>
          <q-td key="id" :props="props" class="my-table-border">
            {{ props.row.id }}
          </q-td>
          <q-td key="date" :props="props" class="my-table-border">
            {{ getDate(props.row.dateTimeStart) }}
          </q-td>
          <q-td key="timeStart" :props="props" class="my-table-border">
            {{ getTime(props.row.dateTimeStart) }}
          </q-td>
          <q-td key="timeEnd" :props="props" class="my-table-border">
            {{ getTime(props.row.dateTimeEnd) }}
          </q-td>
          <q-td
            key="objectInitiator"
            :props="props"
            class="my-table-border"
            style="min-width: 250px">
            <div>
              {{ props.row.objectInitiator }}
            </div>
          </q-td>
          <q-td
            key="objectInvited"
            :props="props"
            class="my-table-border text-center"
            style="min-width: 300px">
            <div class="column">
              <div
                class="col"
                v-for="item in props.row.objectInvited"
                v-bind:key="item">
                <div style="border: 1px solid grey; margin: 2px; padding: 2px">
                  {{ item }}
                </div>
              </div>
            </div>
          </q-td>
          <q-td
            key="typeVico"
            :props="props"
            class="my-table-border"
            style="min-width: 100px">
            {{ props.row.typeVico }}
          </q-td>
          <q-td key="topic" :props="props" class="my-table-border">
            {{ props.row.topic }}
          </q-td>
          <q-td
            key="departamentInitiator"
            :props="props"
            class="my-table-border"
            style="min-width: 170px">
            {{ props.row.departamentInitiator }}
          </q-td>
          <q-td
            key="departamentInvited"
            :props="props"
            class="my-table-border"
            style="min-width: 240px">
            <div class="column">
              <div
                class="col"
                v-for="item in props.row.departamentInvited"
                v-bind:key="item">
                <div style="border: 1px solid grey; margin: 2px; padding: 2px">
                  {{ item }}
                </div>
              </div>
            </div>
          </q-td>
          <q-td key="contactName" :props="props" class="my-table-border">
            {{ props.row.contactName }}
          </q-td>
          <q-td key="contactPhone" :props="props" class="my-table-border">
            {{ props.row.contactPhone }}
          </q-td>
          <q-td key="videoRecord" :props="props" class="my-table-border">
            <span v-if="props.row.videoRecord">
              <i class="fa-duotone fa-video fa-xl" />
            </span>
            <span v-else>
              <i class="fa-duotone fa-video-slash fa-xl" />
            </span>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
defineOptions({
  name: 'MainVicoTable',
})

import { ref, computed } from 'vue'
import { useStoreMain } from '../../stores/storeMain'
import { useStoreGlobal } from '../../stores/storeGlobal'

const storeMain = useStoreMain()
const storeGlobal = useStoreGlobal()

const columns = [
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'left',
    field: (row) => row.id,
    format: (val) => `${val}`,
    style: 'display: none; font-size: 12px;',
  },
  {
    name: 'date',
    align: 'center',
    label: 'Дата',
    field: 'date',
  },
  {
    name: 'timeStart',
    align: 'center',
    label: 'Время начала ВКС',
    field: 'timeStart',
  },
  {
    name: 'timeEnd',
    align: 'center',
    label: 'Время окончания ВКС',
    field: 'timeEnd',
  },
  {
    name: 'objectInitiator',
    align: 'center',
    label: 'Обособленное подразделение инцииатор ВКС',
    field: 'objectInitiator',
  },
  {
    name: 'objectInvited',
    align: 'center',
    label: 'Вызываемые обособленные подразделения',
    field: 'objectInvited',
  },
  {
    name: 'typeVico',
    align: 'center',
    label: 'Тип ВКС',
    field: 'typeVico',
  },
  {
    name: 'topic',
    align: 'center',
    label: 'Тема ВКС',
    field: 'topic',
  },
  {
    name: 'departamentInitiator',
    align: 'center',
    label: 'Отдел инициатор ВКС',
    field: 'departamentInitiator',
  },
  {
    name: 'departamentInvited',
    align: 'center',
    label: 'Приглашенные отделы',
    field: 'departamentInvited',
  },
  {
    name: 'contactName',
    align: 'center',
    label: 'ФИО инициатора ВКС',
    field: 'contactName',
  },
  {
    name: 'contactPhone',
    align: 'center',
    label: 'Контактный номер телефона инициатора ВКС',
    field: 'contactPhone',
  },
  {
    name: 'videoRecord',
    align: 'center',
    label: 'Запись ВКС',
    field: 'videoRecord',
  },
]

const rows = computed(() => storeMain.vicos)

const selected = ref([])

const preSelectAction = (props) => {
  props.selected = !props.selected
  selectAction(props.row.id)
}

const selectAction = (rowId) => {
  if (storeMain.selectId === rowId && storeMain.isSelect === true) {
    storeMain.selectId = -1
    storeMain.isSelect = false
  } else {
    storeMain.selectId = rowId
    storeMain.isSelect = true
  }
}
const getDate = storeGlobal.getDate
const getTime = storeGlobal.getTime

const separator = 'cell'
const pagination = ref({
  descending: false,
  page: 1,
  rowsPerPage: 999,
})
</script>

<style lang="sass">
.my-sticky-table
  tr th
    position: sticky
    z-index: 2
    background: #afc7be
  thead
    tr:last-child th
      top: 14px
      z-index: 3
    tr:first-child th
      top: 0
      z-index: 1
    tr:first-child th:first-child
      background-color: #afc7be
  tr:first-child th:first-child
    z-index: 3
  td:first-child, th:first-child
    position: sticky
    left: 0
    z-index: 1
    background-color: #afc7be
  tbody
    scroll-margin-top: 14px
  li
    list-style-type: none
  td, tr, th
    padding: 1px
    margin: 1px
    border: solid black 1px
    align-items: center
  .q-item--active
    color: #21BA45
  .text-left
    display: none

.my-table-border
  border: solid black 1px

.selected
  background-color: $green-1
</style>
