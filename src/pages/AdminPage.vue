<script setup>
defineOptions({
  name: 'AdminPage',
})

import { api } from 'boot/axios'
import { Loading, Notify, useTimeout } from 'quasar'
import { ref, computed } from 'vue'
import { useStoreUser } from '../stores/storeUser.js'
import { useStoreGlobal } from '../stores/storeGlobal.js'
import { useVuelidate, required, minLength } from 'boot/vuelidate'

const storeUser = useStoreUser()
const storeGlobal = useStoreGlobal()

const { registerTimeout } = useTimeout()

const buttonTechWork = ref(false)

const loginValidate = (value) => {
  const regex = /^\d{2}-\d{3}$/

  return regex.test(value)
}

const login = ref({
  loginFirst: '2700-',
  loginLast: '',
})

const rules = computed(() => ({
  loginLast: {
    required,
    min: minLength(ref(6)),
    loginValidate,
  },
}))

const techWork = computed(() => storeGlobal.techWork)

const form = ref()

const formValidate = useVuelidate(rules, login)

const numberTechWork = ref(0)

const role = ref(null)
const optionsRole = ref(['Гость', 'Пользователь'])
if (storeUser.role > 2) {
  optionsRole.value.push('Модератор')
}
if (storeUser.role > 3) {
  optionsRole.value.push('Администратор')
}
if (storeUser.role === 4) {
  optionsRole.value.push('Суперадминистратор')
}

const onClickButtonSelect = () => {
  console.log('admin')
  Loading.show()
  if (formValidate.value.$invalid) {
    form.value.submit()
    Notify.create({
      progress: true,
      color: 'warning',
      position: 'top',
      message: 'Неправильно заполнены поля в форме',
      icon: 'fa-solid fa-triangle-exclamation',
      timeout: storeGlobal.messagesErrorTime.low,
      textColor: 'black',
    })
    Loading.hide()
  } else {
    api({
      method: 'post',
      url: storeGlobal.getAjaxUri('admin/one'),
      data: {
        login: login.value.loginFirst + login.value.loginLast,
        user: {
          computer: storeUser.computer,
          login: storeUser.login,
        },
      },
      timeout: 10000,
      responseType: 'json',
    })
  }
}

const onClickButtonCreate = () => {}

const onClickButtonSave = () => {
  Loading.show()
  if (formValidate.value.$invalid) {
    form.value.submit()
    Notify.create({
      progress: true,
      color: 'warning',
      position: 'top',
      message: 'Неправильно заполнены поля в форме',
      icon: 'fa-solid fa-triangle-exclamation',
      timeout: storeGlobal.messagesErrorTime.low,
      textColor: 'black',
    })
    Loading.hide()
  } else {
    api({
      method: 'post',
      url: storeGlobal.getAjaxUri('admin/add'),
      data: {
        login: login.value.loginFirst + login.value.loginLast,
        computer: storeUser.computer,
        login: storeUser.login,
      },
      timeout: 10000,
      responseType: 'json',
    })
      .then((response) => {
        if (response.data.success) {
          //
        } else {
          Notify.create({
            progress: true,
            color: 'warning',
            position: 'top',
            message: '<b>' + response.data.message + '</b>',
            icon: 'fa-solid fa-triangle-exclamation',
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
          icon: 'fa-solid fa-rectangle-xmark',
          timeout: storeGlobal.messagesErrorTime.low,
          textColor: 'black',
        })
        Loading.hide()
      })
  }
}

const onClickButtonTechWork = () => {
  buttonTechWork.value = true
  api({
    method: 'post',
    url: storeGlobal.getAjaxUri('admin/techWork'),
    data: {
      computer: storeUser.computer,
      login: storeUser.login,
      type: numberTechWork.value,
    },
    timeout: 10000,
    responseType: 'json',
  })
    .then((response) => {
      if (response.data.success) {
        let message = ''
        if (response.data.result) {
          message = 'Выполнен ввод приложения в режим технических работ.'
        } else {
          message = 'Выполнен вывод приложения из режима технических работ.'
        }

        registerTimeout(() => {
          Notify.create({
            progress: true,
            color: 'positive',
            position: 'top',
            message: '<b>' + message + '</b>',
            icon: 'fa-solid fa-check',
            textColor: 'black',
            html: true,
            timeout: storeGlobal.messagesErrorTime.low,
          })
          buttonTechWork.value = false
        }, 2000)
      } else {
        Notify.create({
          progress: true,
          color: 'warning',
          position: 'top',
          message: '<b>' + response.data.message + '</b>',
          icon: 'fa-solid fa-triangle-exclamation',
          textColor: 'black',
          html: true,
          timeout: storeGlobal.messagesErrorTime.medium,
        })
        buttonTechWork.value = false
      }
    })
    .catch(function () {
      Notify.create({
        color: 'negative',
        position: 'top',
        html: true,
        message: '<b>Нет соединения с сервером.</b>',
        icon: 'fa-solid fa-rectangle-xmark',
        timeout: storeGlobal.messagesErrorTime.low,
        textColor: 'black',
      })
      buttonTechWork.value = true
    })
}
const onClickButtonDelete = () => {}
</script>

<template>
  <div class="q-pa-md items-start">
    <q-card>
      <q-form ref="form">
        <div class="row">
          <div class="col-1">
            <q-input
              v-model="login.loginFirst"
              filled
              mask="2700"
              fill-mask="#"
              readonly />
          </div>
          <div class="col-2">
            <q-input
              v-model="login.loginLast"
              filled
              label="Логин"
              mask="##-###"
              fill-mask="#"
              lazy-rules
              :rules="[
                () =>
                  !formValidate.loginLast.$invalid ||
                  'Не корректно введён логин',
              ]" />
          </div>
          <div class="col-1"></div>
          <div class="col-2">
            <q-select
              v-model="role"
              outlined
              :options="optionsRole"
              label="Роль" />
          </div>
          <div class="col-1"></div>
          <div class="col-5">
            <q-btn-group style="min-height: 75%; height: 75%; max-height: 75%">
              <q-btn
                push
                color="warning"
                class="my-button"
                @click="onClickButtonSelect">
                <i class="fa-solid fa-check fa-2x" />&nbsp;&nbsp;
                <b>Выбрать</b>
              </q-btn>
              <q-btn
                push
                color="primary"
                class="my-button"
                @click="onClickButtonCreate">
                <i class="fa-solid fa-plus fa-2x" />&nbsp;&nbsp;
                <b>Создать</b>
              </q-btn>
              <q-btn
                push
                color="positive"
                class="my-button"
                @click="onClickButtonSave">
                <i class="fa-solid fa-floppy-disk fa-2x" />&nbsp;&nbsp;
                <b>Сохранить</b>
              </q-btn>
              <q-btn
                push
                color="negative"
                class="my-button"
                @click="onClickButtonDelete">
                <i class="fa-solid fa-trash fa-2x" />&nbsp;&nbsp;
                <b>Удалить</b>
              </q-btn>
            </q-btn-group>
          </div>
        </div>
      </q-form>
    </q-card>
    <q-card>
      <q-btn-group style="min-height: 75%; height: 75%; max-height: 75%">
        <q-btn
          push
          color="warning"
          class="my-button"
          @click="onClickButtonTechWork"
          :disable="buttonTechWork">
          <i class="fa-solid fa-check fa-2x" />&nbsp;&nbsp;
          <b>
            <span v-if="techWork">Закончить технические работы</span>
            <span v-else>Начать технические работы</span>
          </b>
        </q-btn>
        <q-input
          v-if="!techWork"
          v-model.number="numberTechWork"
          type="number"
          outlined
          label-slot
          style="max-width: 300px">
          <template #label>
            <span class="text-weight-bold text-indigo-10">
              Тип выполняемой технической работы
            </span>
          </template>
        </q-input>
      </q-btn-group>
    </q-card>
  </div>
</template>

<style lang="sass">
.my-button
  color: black !important
</style>
