import { defineStore } from 'pinia'
import { _sort } from 'boot/radash'

export const useStoreMain = defineStore('main', {
  state: () => ({
    vicos: [],
    selectId: 0,
    isSelect: false,
  }),
  getters: {
    getVicoById: (state) => {
      return (vicoId) => state.vicos.find((vico) => vico.id === vicoId)
    },
  },
  actions: {
    async vicosSort() {
      this.vicos = _sort(this.vicos, (item) => item.dateTimeStart, false)
    },
    async setVico(vico) {
      this.vicos.forEach((item, index) => {
        if (vico.id === item.id) {
          this.vicos.splice(index, 1, vico)
        }
      })
    },
    async addVico(vico) {
      this.vicos.push(vico)
      this.vicosSort()
    },
  },
})
