<script setup>
defineOptions({
  name: 'App',
})

import { Cookies } from 'quasar'

import { useStoreGlobal } from './stores/storeGlobal.js'
import { useStoreUser } from './stores/storeUser.js'

const storeGlobal = useStoreGlobal()
const storeUser = useStoreUser()

if (Cookies.has('login') && Cookies.has('password')) {
  storeUser.login = Cookies.get('login')
  storeUser.password = Cookies.get('password')
}

storeGlobal.onSocket()
</script>

<template>
  <router-view />
</template>
