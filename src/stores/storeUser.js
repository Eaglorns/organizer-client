import { defineStore } from 'pinia'

export const useStoreUser = defineStore('user', {
  state: () => ({
    computer: '',
    login: '',
    role: 0,
  }),
  getters: {},
  actions: {},
})
