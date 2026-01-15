<template>
  <q-card class="auth__card" flat bordered>
    <q-card-section class="auth__header">
      <div class="text-h6">Вход</div>
      <div class="text-caption text-grey-6">
        Авторизуйтесь, чтобы получить права доступа к управлению записями ВКС.
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form class="q-gutter-md" @submit.prevent="handleSubmit">
        <q-input
          v-model.trim="form.login"
          type="text"
          label="Логин"
          :rules="rules.login"
          autofocus
          dense
          outlined />

        <q-input
          v-model="form.password"
          :type="isPwd ? 'password' : 'text'"
          label="Пароль"
          :rules="rules.password"
          dense
          outlined>
          <template #append>
            <i
              :class="isPwd ? 'fa-duotone fa-eye-slash' : 'fa-duotone fa-eye'"
              class="cursor-pointer"
              @click="isPwd = !isPwd" />
          </template>
        </q-input>

        <div class="row items-center justify-between">
          <q-btn color="primary" label="Войти" type="submit" unelevated />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useStoreUser } from 'src/stores/storeUser'
import { useStoreGlobal } from 'src/stores/storeGlobal'
import { reactive, ref } from 'vue'
import { Loading, Notify } from 'quasar'
import { api } from 'boot/axios'

const storeUser = useStoreUser()
const storeGlobal = useStoreGlobal()

const emit = defineEmits(['submit', 'forgot'])

const isPwd = ref(true)

const form = reactive({
  login: '',
  password: '',
})

const rules = {
  login: [(v) => !!v || 'Введите логин'],
  password: [(v) => !!v || 'Введите пароль'],
}

const handleSubmit = async () => {
  Loading.show()
  api({
    method: 'post',
    url: storeGlobal.getAjaxUri('profile/auth'),
    data: {
      login: form.login,
      password: form.password,
    },
    timeout: 10000,
    responseType: 'json',
  })
    .then((response) => {
      if (response.data.success) {
        storeUser.isAuth = true
        storeUser.ip = response.data.ip
        storeUser.role = response.data.role
        Loading.hide()
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
</script>

<style scoped>
.auth__card {
  width: 100%;
  max-width: 420px;
  border: 1px solid #7fb6ff;
  background: #ffffff;
  box-shadow: 0 10px 26px rgba(30, 136, 229, 0.14);
  border-radius: 12px;
}

.auth__header {
  padding-bottom: 12px;
}

.auth__header .text-h6 {
  color: #1565c0;
}

.auth__header .text-caption {
  color: #4f83cc;
}

:deep(.q-field--outlined .q-field__control) {
  border-color: #90caf9;
  background: #ffffff;
}

:deep(.q-field--outlined.q-field--focused .q-field__control) {
  border-color: #1e88e5;
  box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.15);
}
</style>
