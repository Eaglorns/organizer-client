<script setup>
defineOptions({
  name: 'App',
})

import { useStoreGlobal } from './stores/storeGlobal.js'
import { useStoreUser } from './stores/storeUser.js'

const storeGlobal = useStoreGlobal()
const storeUser = useStoreUser()

const data = window.userAPI.getData
storeUser.login = data.login
storeUser.computer = data.computer

storeGlobal.onSocket()
</script>

<template>
  <router-view />
</template>
