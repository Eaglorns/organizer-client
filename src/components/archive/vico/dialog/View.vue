<script setup>
defineOptions({
  name: 'MainVicoDialogView',
})

import { api } from 'boot/axios'
import { ref, computed } from 'vue'
import { Loading, Notify } from 'quasar'
import { useStoreGlobal } from '../../../../stores/storeGlobal.js'
import { useStoreArchive } from '../../../../stores/storeArchive.js'

const storeGlobal = useStoreGlobal()
const storeArchive = useStoreArchive()

const dialog = ref(false)

const optionObject = computed(() => storeGlobal.optionObject)
const optionTypeVico = computed(() => storeGlobal.optionTypeVico)
const optionDepartament = computed(() => storeGlobal.optionDepartament)

const vico = ref()

const dialogOpen = () => {
  Loading.show()
  if (storeArchive.isSelect) {
    api({
      method: 'post',
      url: storeGlobal.getAjaxUri('archive/one'),
      data: { id: storeArchive.selectId },
      timeout: 10000,
      responseType: 'json',
    })
      .then((response) => {
        if (response.data.success) {
          vico.value = storeGlobal.getVicoTemplate()

          vico.value.date = storeGlobal.getDate(
            response.data.vico.dateTimeStart
          )
          vico.value.timeStart = storeGlobal.getTime(
            response.data.vico.dateTimeStart
          )
          vico.value.timeEnd = storeGlobal.getTime(
            response.data.vico.dateTimeEnd
          )

          vico.value.objectInitiator = response.data.vico.objectInitiator
          vico.value.objectInvited = response.data.vico.objectInvited
          vico.value.typeVico = response.data.vico.typeVico
          vico.value.objectInvited = response.data.vico.objectInvited
          vico.value.typeVico = response.data.vico.typeVico
          vico.value.topic = response.data.vico.topic
          vico.value.departamentInitiator =
            response.data.vico.departamentInitiator
          vico.value.departamentInvited = response.data.vico.departamentInvited
          vico.value.contactName = response.data.vico.contactName
          vico.value.contactPhone = response.data.vico.contactPhone

          dialog.value = true
          Loading.hide()
        } else {
          Notify.create({
            progress: true,
            color: 'negative',
            position: 'top',
            message: '<b>' + response.data.message + '</b>',
            icon: 'fa-solid fa-rectangle-xmark',
            timeout: storeGlobal.messagesErrorTime.high,
            textColor: 'black',
            html: true,
          })
          Loading.hide()
        }
      })
      .catch(function () {
        Notify.create({
          color: 'negative',
          position: 'top',
          message: '<b>Нет соединения с сервером.</b>',
          icon: 'fa-solid fa-rectangle-xmark',
          timeout: storeGlobal.messagesErrorTime.medium,
          textColor: 'black',
          html: true,
        })
        Loading.hide()
      })
  } else {
    Notify.create({
      color: 'warning',
      position: 'top',
      message: '<b>Отсутствует выделение записи ВКС</b>',
      icon: 'fa-solid fa-triangle-exclamation',
      timeout: storeGlobal.messagesErrorTime.low,
      textColor: 'black',
      html: true,
    })
    Loading.hide()
  }
}

const dialogClose = () => {
  dialog.value = false
}

defineExpose({
  dialogOpen,
})
</script>

<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 95vw" flat bordered>
      <q-card-section>
        <q-form class="q-gutter-md">
          <div class="row justify-evenly">
            <div class="col-3">
              <q-input
                v-model="vico.date"
                outlined
                mask="##.##.####"
                label-slot
                readonly>
                <template #label>
                  <span class="text-weight-bold text-indigo-10">Дата</span>
                </template>
                <template v-slot:append>
                  <i class="fa-duotone fa-calendar-days cursor-pointer" />
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input
                v-model="vico.timeStart"
                outlined
                mask="time"
                label-slot
                readonly>
                <template #label>
                  <span class="text-weight-bold text-indigo-10">
                    Дата окончания ВКС
                  </span>
                </template>
                <template v-slot:append>
                  <i class="fa-duotone fa-alarm-clock cursor-pointer" />
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input
                v-model="vico.timeEnd"
                outlined
                mask="time"
                label-slot
                readonly>
                <template #label>
                  <span class="text-weight-bold text-indigo-10">
                    Дата окончания ВКС
                  </span>
                </template>
                <template v-slot:#append>
                  <i class="fa-duotone fa-alarm-clock cursor-pointer" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-6">
              <q-select
                v-model="vico.objectInitiator"
                outlined
                :options="optionObject"
                readonly
                label-slot>
                <template #label>
                  <span class="text-weight-bold text-indigo-10">
                    Обособленное подразделение инцииатор ВКС
                  </span>
                </template>
              </q-select>
            </div>
            <div class="col-6">
              <q-select
                v-model="vico.objectInvited"
                outlined
                multiple
                use-chips
                stack-label
                :options="optionObject"
                readonly
                label-slot>
                <template #label>
                  <span class="text-weight-bold text-indigo-10">
                    Вызываемые обособленные подразделения
                  </span>
                </template>
              </q-select>
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-6">
              <q-select
                v-model="vico.departamentInitiator"
                outlined
                :options="optionDepartament"
                readonly
                label-slot>
                <template #label>
                  <span class="text-weight-bold text-indigo-10">
                    Отдел инициатор ВКС
                  </span>
                </template>
              </q-select>
            </div>
            <div class="col-6">
              <q-select
                v-model="vico.departamentInvited"
                outlined
                multiple
                use-chips
                stack-label
                :options="optionDepartament"
                readonly
                label-slot>
                <template #label>
                  <span class="text-weight-bold text-indigo-10">
                    Приглашенные отделы
                  </span>
                </template>
              </q-select>
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-4">
              <q-select
                v-model="vico.typeVico"
                outlined
                :options="optionTypeVico"
                readonly
                label-slot>
                <template #label>
                  <span class="text-weight-bold text-indigo-10">
                    Тип совещания
                  </span>
                </template>
              </q-select>
            </div>
            <div class="col-4">
              <q-input v-model="vico.topic" outlined readonly label-slot>
                <template #label>
                  <span class="text-weight-bold text-indigo-10">
                    Тема совещания
                  </span>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-4">
              <q-input v-model="vico.contactName" outlined readonly label-slot>
                <template #label>
                  <span class="text-weight-bold text-indigo-10">
                    ФИО инициатора ВКС
                  </span>
                </template>
              </q-input>
            </div>
            <div class="col-4">
              <q-input v-model="vico.contactPhone" outlined readonly label-slot>
                <template #label>
                  <span class="text-weight-bold text-indigo-10">
                    Контактный номер телефона инициатора ВКС
                  </span>
                </template>
              </q-input>
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn
          label="Закрыть"
          color="blue-2"
          text-color="black"
          @click="dialogClose" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="sass">
.q-field__label
  color: $red-4
</style>
