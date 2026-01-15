<template>
  <ArchiveTable />
  <ArchiveVicoDialogView ref="archiveVicoDialogView" />
  <q-page-sticky
    class="my-button-group"
    position="bottom-left"
    :offset="[18, 18]">
    <q-btn-group push>
      <q-btn
        push
        class="my-button"
        color="brown-5"
        text-color="grey-9"
        @click="archiveVicoDialogView.dialogOpen()">
        <i class="fa-duotone fa-eye">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle">
            Посмотреть
          </q-tooltip>
        </i>
      </q-btn>
    </q-btn-group>
  </q-page-sticky>
</template>

<script setup>
defineOptions({
  name: 'ArchivePage',
})

import { ref } from 'vue'

import ArchiveTable from 'components/archive/Table.vue'
import ArchiveVicoDialogView from 'components/archive/vico/dialog/View.vue'

const archiveVicoDialogView = ref(null)
</script>

<style lang="sass">
.my-button-group
  z-index: 999
  opacity: 0.38

.my-button-group:hover
  opacity: 1

.my-button
  padding-left: 14px
  padding-right: 14px
  font-size: 22px
</style>
