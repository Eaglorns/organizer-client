import { io } from 'boot/socket'
import { defineStore } from 'pinia'
import { _clone } from 'boot/radash'
import { DateTime } from 'boot/luxon'
import { useStoreUser } from '../stores/storeUser.js'
import { useStoreMain } from '../stores/storeMain.js'

export const useStoreGlobal = defineStore('global', {
  state: () => ({
    version: '0.1.1',
    server: 'http://127.0.0.1:3000/',
    optionObject: [],
    optionTypeVico: [],
    optionDepartament: [],
    templateVico: {
      date: '',
      timeStart: '',
      timeEnd: '',
      objectInitiator: [],
      objectInvited: [],
      typeVico: '',
      topic: '',
      departamentInitiator: [],
      departamentInvited: [],
      contactName: '',
      contactPhone: '',
      videoRecord: false,
    },
    socket: null,
    page: 'main',
    messagesErrorTime: {
      low: 2000,
      medium: 3000,
      high: 3500,
    },
    pageLoadFirst: {
      main: {
        value: true,
        delay: 1,
      },
      admin: {
        value: true,
        delay: 1,
      },
      profile: {
        value: true,
        delay: 1,
      },
      archive: {
        value: true,
        delay: 1,
      },
    },
  }),
  getters: {
    getAjaxUri(state) {
      return (response) => state.server + response
    },
    getOptionObjectByName: (state) => {
      return (objectName) =>
        state.optionObject.find((item) => item.label === objectName)
    },
    getOptionTypeVicoByName: (state) => {
      return (typeVicoName) =>
        state.optionTypeVico.find((item) => item.label === typeVicoName)
    },
    getOptionDepartamentByName: (state) => {
      return (departamentName) =>
        state.optionDepartament.find((item) => item.label === departamentName)
    },
  },
  actions: {
    getVicoTemplate() {
      return _clone(this.templateVico)
    },
    getDate(seconds) {
      return DateTime.fromSeconds(seconds).toFormat('dd.LL.yyyy')
    },
    getTime(seconds) {
      return DateTime.fromSeconds(seconds).toFormat('HH:mm')
    },
    getSeconds(date, time) {
      return DateTime.fromFormat(date + '-' + time, 'dd.LL.yyyy-HH:mm', {
        numberingSystem: '',
      }).toSeconds()
    },
    async onSocket() {
      try {
        const storeUser = useStoreUser()
        const storeMain = useStoreMain()

        const socket = io(this.server, {
          transports: ['websocket'],
          query: {
            login: storeUser.login,
            version: this.version,
          },
        })

        socket.on('load', (data) => {
          this.optionObject = []
          this.optionTypeVico = []
          this.optionDepartament = []

          let i = 0

          data.optionObject.forEach((item) => {
            this.optionObject.push({
              label: item,
              value: i,
            })
            i++
          })

          i = 0
          data.optionTypeVico.forEach((item) => {
            this.optionTypeVico.push({
              label: item,
              value: i,
            })
            i++
          })

          i = 0
          data.optionDepartament.forEach((item) => {
            this.optionDepartament.push({
              label: item,
              value: i,
            })
            i++
          })
        })

        socket.on('vicoAll', (data) => {
          storeMain.vicos = data.vicos
          storeMain.vicosSort()
        })

        socket.on('vicoCreate', (data) => {
          storeMain.addVico(data)
        })

        socket.on('vicoUpdate', (data) => {
          storeMain.setVico(data.vico)
          storeMain.vicosSort()
        })

        socket.on('vicoDelete', (data) => {
          storeMain.vicos = storeMain.vicos.filter((vico) => vico.id != data.id)
          if (storeMain.selectId === data.id) {
            storeMain.selectId = -1
            storeMain.isSelect = false
          }
        })

        this.socket = socket
      } catch (err) {
        console.log(err)
      }
    },
  },
})
