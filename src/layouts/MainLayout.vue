<script setup>
defineOptions({
  name: 'MainLayout',
})

import { useTimeout, Loading } from 'quasar'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStoreGlobal } from '../stores/storeGlobal.js'
import { useStoreUser } from '../stores/storeUser.js'

const storeGlobal = useStoreGlobal()
const storeUser = useStoreUser()

const { registerTimeout } = useTimeout()

const count = ref(0)

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

function minimize() {
  if (process.env.MODE === 'electron') {
    window.windowAPI.minimize()
  }
}

function toggleMaximize() {
  if (process.env.MODE === 'electron') {
    window.windowAPI.toggleMaximize()
    count.value = count.value + 1
  }
}

function closeApp() {
  if (process.env.MODE === 'electron') {
    window.windowAPI.close()
  }
}

const version = computed(() => storeGlobal.version)
const role = computed(() => storeUser.role)
</script>

<template>
  <q-layout view="lHh lpr lFf" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-bar class="q-electron-drag">
        <i class="fa-duotone fa-laptop" />
        <div>Органайзер (v{{ version }})</div>
        <q-space />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <q-btn dense flat @click="minimize">
          <i class="fa-regular fa-window-minimize fa-2x" />
        </q-btn>
        <q-btn dense flat @click="toggleMaximize">
          <i class="fa-regular fa-window-maximize fa-2x" />
        </q-btn>
        <q-btn dense flat @click="closeApp">
          <i class="fa-regular fa-rectangle-xmark fa-2x" />
        </q-btn>
      </q-bar>
      <q-toolbar class="bg-primary shadow-1 shadow-up-1">
        <q-btn-group push>
          <q-btn
            v-if="page != 'archive'"
            color="green-3"
            text-color="black"
            @click="onClickButtonNavigate('archive')">
            <i class="fa-solid fa-box-archive fa-2x" />
            &nbsp;
            <b>Перейти в архив</b>
          </q-btn>
          <q-btn
            v-if="page != 'main'"
            color="green-3"
            text-color="black"
            @click="onClickButtonNavigate('main')">
            <i class="fa-solid fa-sidebar-flip fa-2x" />
            &nbsp;
            <b>Перейти на главную страницу</b>
          </q-btn>
          <q-btn
            v-if="role > 1 && page != 'admin'"
            color="green-3"
            text-color="black"
            @click="onClickButtonNavigate('admin')">
            <i class="fa-solid fa-screwdriver-wrench fa-2x" />
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
          v-if="page != 'profile'"
          color="green-3"
          text-color="black"
          @click="onClickButtonNavigate('profile')">
          <div v-if="role === 0">
            <i class="fa-solid fa-person-circle-question fa-2x">
              <q-tooltip> Пользователь </q-tooltip>
            </i>
          </div>
          <div v-if="role === 1">
            <i class="fa-solid fa-user fa-2x">
              <q-tooltip> Редактор </q-tooltip>
            </i>
          </div>
          <div v-if="role === 2">
            <i class="fa-solid fa-user-bounty-hunter fa-2x">
              <q-tooltip> Модератор </q-tooltip>
            </i>
          </div>
          <div v-if="role === 3">
            <i class="fa-solid fa-user-robot fa-2x">
              <q-tooltip> Администратор </q-tooltip>
            </i>
          </div>
          <div v-if="role === 4">
            <i class="fa-solid fa-user-secret fa-2x">
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
  </q-layout>
</template>

<style lang="sass"></style>
