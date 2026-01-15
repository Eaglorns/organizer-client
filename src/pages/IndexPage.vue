<template>
  <MainTable />
  <MainVicoDialogOne ref="mainVicoDialogOne" />
  <MainVicoDialogCreate ref="mainVicoDialogCreate" />
  <MainVicoDialogUpdate ref="mainVicoDialogUpdate" />
  <MainVicoDialogArchive ref="mainVicoDialogArchive" />
  <MainVicoDialogDelete ref="mainVicoDialogDelete" />
  <q-page-sticky
    class="my-button-group"
    position="bottom-left"
    :offset="[18, 18]">
    <div v-show="role == 0">
      <q-btn
        class="my-button"
        color="brown-5"
        text-color="grey-9"
        @click="mainVicoDialogOne.dialogOpen()">
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
    </div>
    <q-btn-group v-show="role > 0" push>
      <q-btn
        push
        class="my-button"
        color="brown-5"
        text-color="grey-9"
        @click="mainVicoDialogOne.dialogOpen()">
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
      <q-btn
        push
        class="my-button"
        color="green"
        text-color="grey-9"
        @click="mainVicoDialogCreate.dialogOpen()">
        <i class="fa-duotone fa-plus">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle">
            Создать
          </q-tooltip>
        </i>
      </q-btn>
      <q-btn
        push
        class="my-button"
        color="orange"
        text-color="grey-9"
        @click="mainVicoDialogUpdate.dialogOpen()">
        <i class="fa-duotone fa-pen">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle">
            Редактировать
          </q-tooltip>
        </i>
      </q-btn>
    </q-btn-group>
  </q-page-sticky>
  <q-page-sticky
    class="my-button-group"
    position="bottom-right"
    :offset="[18, 18]">
    <div v-show="role == 0">
      <q-btn
        push
        class="my-button"
        color="green"
        text-color="grey-9"
        @click="updateTable">
        <i class="fa-duotone fa-arrows-rotate">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle">
            Обновить страницу
          </q-tooltip>
        </i>
      </q-btn>
    </div>
    <q-btn-group v-show="role > 0" push>
      <q-btn
        push
        class="my-button"
        color="green"
        text-color="grey-9"
        @click="updateTable">
        <i class="fa-duotone fa-arrows-rotate">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle">
            Обновить страницу
          </q-tooltip>
        </i>
      </q-btn>
      <q-btn
        push
        class="my-button"
        color="blue"
        text-color="grey-9"
        @click="mainVicoDialogArchive.dialogOpen()">
        <i class="fa-duotone fa-box-archive">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle">
            Архивировать
          </q-tooltip>
        </i>
      </q-btn>
      <q-btn
        push
        class="my-button"
        color="red"
        text-color="grey-9"
        @click="mainVicoDialogDelete.dialogOpen()">
        <i class="fa-duotone fa-trash">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle">
            Удалить
          </q-tooltip>
        </i>
      </q-btn>
    </q-btn-group>
  </q-page-sticky>
</template>

<script setup>
defineOptions({
  name: 'IndexPage',
})

import { api } from 'boot/axios'
import { Loading, Notify } from 'quasar'
import { ref, computed } from 'vue'

import MainTable from 'components/main/Table.vue'
import MainVicoDialogOne from 'src/components/main/vico/dialog/One.vue'
import MainVicoDialogCreate from 'src/components/main/vico/dialog/Create.vue'
import MainVicoDialogUpdate from 'components/main/vico/dialog/Update.vue'
import MainVicoDialogArchive from 'components/main/vico/dialog/Archive.vue'
import MainVicoDialogDelete from 'components/main/vico/dialog/Delete.vue'

import { useStoreGlobal } from '../stores/storeGlobal.js'
import { useStoreUser } from '../stores/storeUser.js'
import { useStoreMain } from '../stores/storeMain.js'

const storeGlobal = useStoreGlobal()
const storeUser = useStoreUser()
const storeMain = useStoreMain()

const mainVicoDialogOne = ref(null)
const mainVicoDialogCreate = ref(null)
const mainVicoDialogUpdate = ref(null)

const mainVicoDialogArchive = ref(null)
const mainVicoDialogDelete = ref(null)

const role = computed(() => storeUser.role)

const updateTable = () => {
  Loading.show()
  api({
    method: 'post',
    url: storeGlobal.getAjaxUri('vico/all'),
    data: {},
    timeout: 10000,
    responseType: 'json',
  })
    .then((response) => {
      if (response.data.success === false) {
        Notify.create({
          progress: true,
          color: 'negative',
          position: 'top',
          message: response.data.message,
          icon: 'fa-solid fa-rectangle-xmark',
          timeout: storeGlobal.messagesErrorTime.low,
        })
      } else {
        if (
          !response.data.vicos.some((item) => item.id === storeMain.selectId)
        ) {
          storeMain.selectId = -1
          storeMain.isSelect = false
        }
        storeMain.vicos = response.data.vicos
        storeMain.vicosSort()
      }
      Loading.hide()
    })
    .catch(function () {
      Notify.create({
        color: 'negative',
        position: 'top',
        message: 'Нет соединения с сервером.',
        icon: 'fa-duotone fa-rectangle-xmark',
        timeout: storeGlobal.messagesErrorTime.medium,
      })
      Loading.hide()
    })
}
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
  font-size: 24px
</style>
