<template>
  <q-page class="admin-page q-pa-md">
    <div class="column q-gutter-md">
      <q-card class="admin-card" flat bordered>
        <q-card-section>
          <div class="text-h6">Управление пользователями</div>
          <div class="text-caption text-grey-6">
            Поиск, создание и управление ролями
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form ref="form">
            <div class="row q-col-gutter-md items-end">
              <div class="col-12 col-sm-4 col-md-2">
                <q-input
                  v-model="login.loginFirst"
                  filled
                  mask="2700"
                  fill-mask="#"
                  readonly />
              </div>
              <div class="col-12 col-sm-5 col-md-3">
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
              <div class="col-12 col-sm-3 col-md-3">
                <q-select
                  v-model="role"
                  outlined
                  :options="optionsRole"
                  label="Роль" />
              </div>
              <div class="col-12 col-md-4">
                <div class="admin-actions row q-col-gutter-sm">
                  <div class="col-12 col-sm-6 col-md-12">
                    <q-btn
                      push
                      color="warning"
                      class="my-button full-width"
                      @click="onClickButtonSelect">
                      <i class="fa-duotone fa-check fa-2x" />&nbsp;&nbsp;
                      <b>Выбрать</b>
                    </q-btn>
                  </div>
                  <div class="col-12 col-sm-6 col-md-12">
                    <q-btn
                      push
                      color="primary"
                      class="my-button full-width"
                      @click="onClickButtonCreate">
                      <i class="fa-duotone fa-plus fa-2x" />&nbsp;&nbsp;
                      <b>Создать</b>
                    </q-btn>
                  </div>
                  <div class="col-12 col-sm-6 col-md-12">
                    <q-btn
                      push
                      color="positive"
                      class="my-button full-width"
                      @click="onClickButtonSave">
                      <i class="fa-duotone fa-floppy-disk fa-2x" />&nbsp;&nbsp;
                      <b>Сохранить</b>
                    </q-btn>
                  </div>
                  <div class="col-12 col-sm-6 col-md-12">
                    <q-btn
                      push
                      color="negative"
                      class="my-button full-width"
                      @click="onClickButtonDelete">
                      <i class="fa-duotone fa-trash fa-2x" />&nbsp;&nbsp;
                      <b>Удалить</b>
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

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

<style lang="sass">
.my-button
  color: black !important

.admin-page
  min-height: 100%

.admin-card
  width: 100%

.admin-actions
  width: 100%
</style>
