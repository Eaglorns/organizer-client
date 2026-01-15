import { defineStore } from 'pinia'

export const useStoreUser = defineStore('user', {
  state: () => ({
    isAuth: false,
    login: '',
    password: '',
    role: 0,
  }),
  getters: {},
  actions: {},
})
