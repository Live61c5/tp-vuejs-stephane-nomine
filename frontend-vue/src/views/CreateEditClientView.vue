<template>
  <div v-if="client">
    <div class="row border-bottom pb-3 mb-3">
      <div class="col">
        <h1 v-if="isNewClient" class="h3">
          <i class="fa-solid fa-angle-down me-2" />Créer un client
        </h1>
        <h1 v-else class="h3"><i class="fa-solid fa-angle-down me-2" />Editer un client</h1>
      </div>
      <div class="col text-end">
        <button
          v-if="!isNewClient"
          @click="deleteClient(client)"
          class="btn btn-outline-danger me-2"
        >
          <i class="fa-solid fa-trash me-2" />
          Supprimer le client
        </button>
        <button @click="$router.back()" class="btn btn-outline-primary" to="/clients">
          <i class="fa-solid fa-chevron-left me-2"></i>
          Retour
        </button>
      </div>
    </div>
    <h5 class="mb-3">Contact :</h5>
    <div class="row mb-3">
      <div class="col-md-8">
        <div class="row mb-3">
          <div class="col-md mb-3 mb-md-0">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                id="firstName"
                v-model="client.firstName"
                :class="{ 'is-invalid': !client.firstName }"
              />
              <label for="firstName" class="form-label">Prénom :</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                id="lastName"
                v-model="client.lastName"
                :class="{ 'is-invalid': !client.lastName }"
              />
              <label for="lastName" class="form-label">Nom :</label>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md mb-3 mb-md-0">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                id="jobTitle"
                v-model="client.jobTitle"
                :class="{ 'is-invalid': !client.jobTitle }"
              />
              <label for="jobTitle" class="form-label">Fonction :</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input
                type="tel"
                class="form-control"
                id="phoneNumber"
                v-model="client.phoneNumber"
                :class="{ 'is-invalid': !client.phoneNumber }"
              />
              <label for="phoneNumber" class="form-label">Téléphone :</label>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md">
            <div class="form-floating">
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="client.email"
                :class="{ 'is-invalid': !client.email }"
              />
              <label for="email" class="form-label">Email :</label>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                id="company"
                v-model="client.company"
                :class="{ 'is-invalid': !client.company }"
              />
              <label for="company" class="form-label">Entreprise :</label>
            </div>
          </div>
        </div>
        <h5 class="mb-3">Coordonnées :</h5>
        <div class="row mb-3">
          <div class="col-md">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                id="address1"
                v-model="client.address1"
                :class="{ 'is-invalid': !client.address1 }"
              />
              <label for="address1" class="form-label">Adresse 1 :</label>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="address2" v-model="client.address2" />
              <label for="address2" class="form-label">Adresse 2 :</label>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md mb-3 mb-md-0">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                id="zip"
                v-model="client.zipCode"
                :class="{ 'is-invalid': !client.zipCode }"
              />
              <label for="zip" class="form-label">Code postal :</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                id="city"
                v-model="client.city"
                :class="{ 'is-invalid': !client.city }"
              />
              <label for="city" class="form-label">Ville :</label>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md">
            <div class="form-floating">
              <select
                class="form-select"
                id="country"
                v-model="client.country"
                :class="{ 'is-invalid': !client.country }"
              >
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
              </select>
              <label for="country" class="form-label">Pays :</label>
            </div>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="form-floating">
          <input
            type="date"
            format="yyyy-MM-dd"
            class="form-control"
            id="date"
            v-model="client.dateAdded"
            :class="{ 'is-invalid': !client.dateAdded }"
          />
          <label for="date" class="form-label">Date d'ajout :</label>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col text-end">
        <button
          @click="submitForm()"
          type="submit"
          class="btn btn-outline-primary btn-lg px-5"
          :disabled="formInvalid"
        >
          <i class="fa-solid fa-save me-2" />Enregistrer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useClientStore } from '@/stores/client.js'
import { mapActions, mapWritableState } from 'pinia'
export default {
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    ...mapWritableState(useClientStore, ['client']),
    isNewClient() {
      return this.id == '-1'
    },
    formInvalid() {
      return (
        !this.client ||
        !this.client.firstName ||
        !this.client.lastName ||
        !this.client.jobTitle ||
        !this.client.phoneNumber ||
        !this.client.email ||
        !this.client.company ||
        !this.client.address1 ||
        !this.client.zipCode ||
        !this.client.city ||
        !this.client.country ||
        !this.client.dateAdded
      )
    }
  },
  mounted() {
    this.setClient(this.id)
  },
  methods: {
    ...mapActions(useClientStore, [
      'setClient',
      'onCreateClient',
      'onUpdateClient',
      'onDeleteClient'
    ]),
    submitForm() {
      if (this.isNewClient) {
        this.onCreateClient(this.client)
      } else {
        this.onUpdateClient(this.client)
      }
      this.$router.back()
    },
    deleteClient() {
      this.onDeleteClient(this.client)
      this.$router.back()
    }
  }
}
</script>

<style scoped></style>
