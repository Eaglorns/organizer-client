<template>
  <q-dialog v-model="dialog" position="top" persistent>
    <q-card style="min-width: 95vw; top: 10px" flat bordered>
      <q-card-section>
        <q-form ref="form" class="q-gutter-md">
          <div class="row justify-evenly">
            <div class="col-3">
              <q-input
                v-model="vico.date"
                outlined
                mask="##.##.####"
                label-slot
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.date.$invalid || 'Не корректно введена дата',
                ]">
                <template #label>
                  <span class="text-weight-bold text-indigo-10">Дата</span>
                </template>
                <template #append>
                  <i class="fa-duotone fa-calendar-days cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale">
                      <q-date v-model="vico.date" mask="DD.MM.YYYY">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Закрыть"
                            color="primary"
                            flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </i>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input
                v-model="vico.timeStart"
                outlined
                mask="time"
                label-slot
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.timeStart.$invalid ||
                    'Не корректно введено время',
                ]">
                <template #label>
                  <span class="text-weight-bold text-indigo-10">
                    Дата начала ВКС
                  </span>
                </template>
                <template #append>
                  <i class="fa-duotone fa-alarm-clock cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale">
                      <q-time v-model="vico.timeStart">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Закрыть"
                            color="primary"
                            flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </i>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input
                v-model="vico.timeEnd"
                outlined
                mask="time"
                label-slot
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.timeEnd.$invalid ||
                    'Не корректно введено время',
                ]">
                <template #label>
                  <span class="text-weight-bold text-indigo-10">
                    Дата окончания ВКС
                  </span>
                </template>
                <template #append>
                  <i class="fa-duotone fa-alarm-clock cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale">
                      <q-time v-model="vico.timeEnd">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Закрыть"
                            color="primary"
                            flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </i>
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
                label-slot
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.objectInitiator.$invalid ||
                    'Не выбрано подразделение инициатор',
                ]">
                <template #label>
                  <span class="text-weight-bold text-indigo-10">
                    Обособленное подразделение инцииатор ВКС
                  </span>
                </template>
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label
                        v-if="scope.selected"
                        class="text-weight-bold text-indigo-10">
                        {{ scope.opt.label }}
                      </q-item-label>
                      <q-item-label v-else>
                        {{ scope.opt.label }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-6">
              <q-select
                v-model="vico.objectInvited"
                outlined
                multiple
                :options="optionObject"
                label-slot
                style="
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.objectInvited.$invalid ||
                    'Не выбраны вызываемые обособленные подразделения',
                ]">
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label
                        v-if="scope.selected"
                        class="text-weight-bold text-indigo-10">
                        {{ scope.opt.label }}
                      </q-item-label>
                      <q-item-label v-else>
                        {{ scope.opt.label }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
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
                label-slot
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.departamentInitiator.$invalid ||
                    'Не выбран отдел инициатор',
                ]">
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label
                        v-if="scope.selected"
                        class="text-weight-bold text-indigo-10">
                        {{ scope.opt.label }}
                      </q-item-label>
                      <q-item-label v-else>
                        {{ scope.opt.label }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
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
                :options="optionDepartament"
                label-slot
                style="
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.departamentInvited.$invalid ||
                    'Не выбраны приглашённые отделы',
                ]">
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label
                        v-if="scope.selected"
                        class="text-weight-bold text-indigo-10">
                        {{ scope.opt.label }}
                      </q-item-label>
                      <q-item-label v-else>
                        {{ scope.opt.label }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
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
                label-slot
                lazy-rules
                :rules="[
                  () => !formValidate.typeVico.$invalid || 'Не выбран тип ВКС',
                ]">
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label
                        v-if="scope.selected"
                        class="text-weight-bold text-indigo-10">
                        {{ scope.opt.label }}
                      </q-item-label>
                      <q-item-label v-else>
                        {{ scope.opt.label }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template #label>
                  <span class="text-weight-bold text-indigo-10"> Тип ВКС </span>
                </template>
              </q-select>
            </div>
            <div class="col-4">
              <q-input
                v-model="vico.topic"
                outlined
                label-slot
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.topic.$invalid ||
                    'Не заполнена тема совещания',
                ]">
                <template #label>
                  <span class="text-weight-bold text-indigo-10">
                    Тема ВКС
                  </span>
                </template>
              </q-input>
            </div>
            <div class="col-1">
              <q-checkbox
                class="text-weight-bold text-indigo-10"
                left-label
                v-model="vico.videoRecord"
                outlined
                label="Запись ВКС"
                size="xl"
                val="xl"
                color="indigo-10"
                checked-icon="fa-duotone fa-video"
                unchecked-icon="fa-duotone fa-video-slash"
                keep-color />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-4">
              <q-input
                v-model="vico.contactName"
                outlined
                label-slot
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.contactName.$invalid ||
                    'Не заполнено ФИО инициатора',
                ]">
                <template #label>
                  <span class="text-weight-bold text-indigo-10">
                    ФИО инициатора ВКС
                  </span>
                </template>
              </q-input>
            </div>
            <div class="col-4">
              <q-input
                v-model="vico.contactPhone"
                outlined
                label-slot
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.contactPhone.$invalid ||
                    'Не заполнен контактный номер',
                ]">
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
      <q-card-actions align="right">
        <q-btn
          label="Отмена"
          color="red-3"
          text-color="black"
          @click="dialogClose" />
        <q-btn
          label="Создать"
          color="positive"
          text-color="black"
          @click="dialogSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineOptions({
  name: 'MainVicoDialogCreate',
})

import { api } from 'boot/axios'
import { DateTime } from 'boot/luxon'
import { useVuelidate, required, minLength } from 'boot/vuelidate'
import { Loading, Notify } from 'quasar'
import { ref, computed } from 'vue'
import { useStoreGlobal } from '../../../../stores/storeGlobal.js'
import { useStoreUser } from '../../../../stores/storeUser.js'

const storeGlobal = useStoreGlobal()
const storeUser = useStoreUser()

const dialog = ref(false)

const optionObject = computed(() => storeGlobal.optionObject)
const optionTypeVico = computed(() => storeGlobal.optionTypeVico)
const optionDepartament = computed(() => storeGlobal.optionDepartament)

const vico = ref()

const dateValidate = (value) => {
  const date = DateTime.fromFormat(value, 'dd.LL.yyyy')
  return date.invalid == null
}

const timeValidate = (value) => {
  const date = DateTime.fromFormat(value, 'hh:mm')
  return date.invalid == null
}

const rules = computed(() => ({
  date: {
    required,
    min: minLength(ref(10)),
    dateValidate,
  },
  timeStart: { required, min: minLength(ref(5)), timeValidate },
  timeEnd: { required, min: minLength(ref(5)), timeValidate },
  objectInitiator: { required },
  objectInvited: { required },
  typeVico: { required },
  topic: { required },
  departamentInitiator: { required },
  departamentInvited: { required },
  contactName: { required },
  contactPhone: { required },
}))

const form = ref()

const formValidate = useVuelidate(rules, vico)

const dialogOpen = () => {
  Loading.show()
  const d = DateTime.now()
  vico.value = storeGlobal.getVicoTemplate()
  vico.value.date = d.toLocaleString()
  vico.value.timeStart = d.toLocaleString(DateTime.TIME_24_SIMPLE)
  vico.value.timeEnd = d.toLocaleString(DateTime.TIME_24_SIMPLE)
  dialog.value = true
  Loading.hide()
}

const dialogSave = () => {
  Loading.show()
  if (formValidate.value.$invalid) {
    form.value.submit()
    Notify.create({
      progress: true,
      color: 'warning',
      position: 'top',
      message: 'Неправильно заполнены поля в форме',
      icon: 'fa-duotone fa-triangle-exclamation',
      timeout: storeGlobal.messagesErrorTime.low,
      textColor: 'black',
    })
    Loading.hide()
  } else {
    const newVico = {
      dateTimeStart: storeGlobal.getSeconds(
        vico.value.date,
        vico.value.timeStart
      ),
      dateTimeEnd: storeGlobal.getSeconds(vico.value.date, vico.value.timeEnd),
      objectInitiator: vico.value.objectInitiator?.label ?? '',
      objectInvited: [],
      typeVico: vico.value.typeVico?.label ?? '',
      topic: vico.value.topic,
      departamentInitiator: vico.value.departamentInitiator?.label ?? '',
      departamentInvited: [],
      contactName: vico.value.contactName,
      contactPhone: vico.value.contactPhone,
      videoRecord: vico.value.videoRecord,
    }

    vico.value.objectInvited.forEach((item) => {
      newVico.objectInvited.push(item.label)
    })

    vico.value.departamentInvited.forEach((item) => {
      newVico.departamentInvited.push(item.label)
    })

    api({
      method: 'post',
      url: storeGlobal.getAjaxUri('vico/create'),
      data: {
        vico: newVico,
        login: storeUser.login,
      },
      timeout: 10000,
      responseType: 'json',
    })
      .then((response) => {
        if (response.data.success) {
          if (response.data.collision) {
            let textMessage = ''
            for (const item of response.data.message) {
              textMessage +=
                '<br />' +
                '<li>' +
                item.object +
                '&nbsp&nbsp&nbsp(<b>' +
                storeGlobal.getTime(item.timeStart) +
                '</b>--<b>' +
                storeGlobal.getTime(item.timeEnd) +
                '</b>)</li>'
            }
            Notify.create({
              progress: true,
              color: 'warning',
              position: 'top',
              message:
                '<b>В введённое время помещения для проведения ВКС заняты.</b>' +
                '<ul>' +
                textMessage +
                '</ul>',
              icon: 'fa-duotone fa-triangle-exclamation',
              html: true,
              timeout: storeGlobal.messagesErrorTime.high,
              textColor: 'black',
            })
            Loading.hide()
          } else {
            dialog.value = false
            Loading.hide()
          }
        } else {
          Notify.create({
            progress: true,
            color: 'warning',
            position: 'top',
            message: '<b>' + response.data.message + '</b>',
            icon: 'fa-duotone fa-triangle-exclamation',
            textColor: 'black',
            html: true,
            timeout: storeGlobal.messagesErrorTime.medium,
          })
          Loading.hide()
        }
      })
      .catch(function () {
        Notify.create({
          color: 'negative',
          position: 'top',
          html: true,
          message: '<b>Нет соединения с сервером.</b>',
          icon: 'fa-duotone fa-rectangle-xmark',
          timeout: storeGlobal.messagesErrorTime.low,
          textColor: 'black',
        })
        Loading.hide()
      })
  }
}

const dialogClose = () => {
  dialog.value = false
}

defineExpose({
  dialogOpen,
})
</script>

<style lang="sass"></style>
