<template>
  <q-layout view="lHh lpr lFf" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-bar class="q-electron-drag">
        <i class="fa-duotone fa-laptop" />
        <div>Органайзер (v{{ version }})</div>
        <q-space />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </q-bar>
      <q-toolbar class="bg-primary shadow-1 shadow-up-1">
        <q-btn-group push>
          <q-btn
            v-if="page != 'archive'"
            color="green-3"
            text-color="black"
            @click="onClickButtonNavigate('archive')">
            <i class="fa-duotone fa-box-archive fa-2x" />
            &nbsp;
            <b>Перейти в архив</b>
          </q-btn>
          <q-btn
            v-if="page != 'main'"
            color="green-3"
            text-color="black"
            @click="onClickButtonNavigate('main')">
            <i class="fa-duotone fa-sidebar-flip fa-2x" />
            &nbsp;
            <b>Перейти на главную страницу</b>
          </q-btn>
          <q-btn
            v-if="role > 1 && page != 'admin'"
            color="green-3"
            text-color="black"
            @click="onClickButtonNavigate('admin')">
            <i class="fa-duotone fa-screwdriver-wrench fa-2x" />
            &nbsp;
            <b>Перейти на страницу администрирования</b>
          </q-btn>
        </q-btn-group>
        <q-space />
        <div v-if="page === 'main'" class="text-h4">Главная страница</div>
        <div v-if="page === 'archive'" class="text-h4">Архив</div>
        <div v-if="page === 'admin'" class="text-h4">
          Страница Администратора
        </div>
        <div v-if="page === 'profile'" class="text-h4">Профиль</div>
        <q-space />
        <q-btn
          color="green-3"
          text-color="black"
          @click="openAuthDialog"
          v-if="!auth">
          <i class="fa-duotone fa-right-to-bracket fa-2x" />
          &nbsp;
          <b>Авторизация</b>
        </q-btn>
        <q-btn
          v-if="page != 'profile' && auth"
          color="green-3"
          text-color="black"
          @click="onClickButtonNavigate('profile')">
          <div v-if="role === 0">
            <i class="fa-duotone fa-person-circle-question fa-2x">
              <q-tooltip> Пользователь </q-tooltip>
            </i>
          </div>
          <div v-if="role === 1">
            <i class="fa-duotone fa-user fa-2x">
              <q-tooltip> Редактор </q-tooltip>
            </i>
          </div>
          <div v-if="role === 2">
            <i class="fa-duotone fa-user-bounty-hunter fa-2x">
              <q-tooltip> Модератор </q-tooltip>
            </i>
          </div>
          <div v-if="role === 3">
            <i class="fa-duotone fa-user-robot fa-2x">
              <q-tooltip> Администратор </q-tooltip>
            </i>
          </div>
          <div v-if="role === 4">
            <i class="fa-duotone fa-user-secret fa-2x">
              <q-tooltip> Суперадминистратор </q-tooltip>
            </i>
          </div>
          &nbsp;&nbsp;&nbsp;
          <b>Перейти в профиль</b>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="isAuthDialogOpen">
      <q-card class="q-pa-md" style="width: 100%; max-width: 480px">
        <Auth @submit="onAuthSubmit" @forgot="onAuthForgot" />
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
defineOptions({
  name: 'MainLayout',
})

import { useTimeout, Loading } from 'quasar'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStoreGlobal } from '../stores/storeGlobal.js'
import { useStoreUser } from '../stores/storeUser.js'
import Auth from 'components/Auth.vue'

const storeGlobal = useStoreGlobal()
const storeUser = useStoreUser()

const { registerTimeout } = useTimeout()

const page = computed(() => storeGlobal.page)

const router = useRouter()

const onClickButtonNavigate = (value) => {
  router.push(value)
  storeGlobal.page = value
  if (storeGlobal.pageLoadFirst[value].value) {
    Loading.show()
    storeGlobal.pageLoadFirst[value].value = false
    registerTimeout(() => {
      Loading.hide()
    }, storeGlobal.pageLoadFirst[value].delay)
  }
}

const version = computed(() => storeGlobal.version)
const role = computed(() => storeUser.role)
const auth = computed(() => storeUser.auth)

const isAuthDialogOpen = ref(false)

const openAuthDialog = () => {
  isAuthDialogOpen.value = true
}

const onAuthSubmit = () => {
  isAuthDialogOpen.value = false
}

const onAuthForgot = () => {
  isAuthDialogOpen.value = false
}
</script>

<style lang="sass"></style>
