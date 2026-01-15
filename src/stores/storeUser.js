import { defineStore } from 'pinia'

export const useStoreUser = defineStore('user', {
  state: () => ({
    isAuth: false,
    login: '',
    role: 0,
  }),
  getters: {},
  actions: {},
})
