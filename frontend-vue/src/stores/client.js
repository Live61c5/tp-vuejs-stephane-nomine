import { defineStore } from 'pinia'

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: null,
    client: null
  }),
  getters: {},
  actions: {
    async getAllClients() {
      const response = await this.$http.get('/clients')
      this.clients = response.data
    },
    async setClient(id) {
      if (id == '-1') {
        this.client = {
          id: '-1',
          firstName: '',
          lastName: '',
          jobTitle: '',
          phoneNumber: '',
          email: '',
          company: '',
          address1: '',
          address2: '',
          zipCode: '',
          city: '',
          country: '',
          dateAdded: new Date().toISOString().split('T')[0]
        }
      } else {
        const response = await this.$http.get('/clients/' + id)
        this.client = response.data
      }
    },
    async onUpdateClient(client) {
      const response = await this.$http.patch('/clients/' + client.id, client)
      this.client = null
      await this.getAllClients()
    },
    async onCreateClient(client) {
      const response = await this.$http.post('/clients', client)
      this.client = null
      await this.getAllClients()
    },
    async onDeleteClient(client) {
      const response = await this.$http.delete('/clients/' + client.id)
      this.client = null
      await this.getAllClients()
    }
  }
})
