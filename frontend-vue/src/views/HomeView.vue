<template>
  <div>
    <div class="row border-bottom pb-3 mb-3">
      <div class="col">
        <h1 class="h3"><i class="fa-solid fa-angle-down me-2" />Dashboard</h1>
      </div>
      <div class="col">
        <div class="d-flex gap-2 justify-content-end">
          <router-link to="/edit-client/-1" class="btn btn-outline-primary">
            <i class="fa-solid fa-plus-circle me-2" />
            Ajouter un client
          </router-link>
          <router-link to="/edit-bill/-1" class="btn btn-outline-primary">
            <i class="fa-solid fa-plus-circle me-2" />
            Ajouter une facture
          </router-link>
        </div>
      </div>
    </div>
    <div class="row">
      
      <div class="col-6 ps-lg-5">
        <div v-if="bills" class="card p-2 mb-4">
          <h5 class="ps-2">Factures en cours</h5>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">N°</th>
                  <th scope="col">Client</th>
                  <th class="text-end" scope="col">Montant HT</th>
                  <th class="text-end" scope="col">Montant TTC</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="bill in bills.slice(0, 10)" class="align-middle">
                  <td scope="row">{{ bill.billnum }}</td>
                  <td>{{ bill.client.firstName }} {{ bill.client.lastName }}</td>
                  <td class="text-end">{{ bill.totalHT }}</td>
                  <td class="text-end">{{ bill.totalTTC }}</td>
                  <td class="text-end">
                    <button @click="onEditBill(bill)" class="btn btn-outline-info">
                      <i class="fa-solid fa-pen me-2" />Editer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        

      </div>
      <div v-if="clients" class="col-6 card p-2">
          <h5 class="ps-2">Clients</h5>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Nom du contact</th>
                  <th scope="col">Entreprise</th>
                  <th class="text-end" scope="col">Date d'ajout</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="client in clients.slice(0, 10)" class="align-middle">
                  <td>{{ client.firstName }} {{ client.lastName }}</td>
                  <td>{{ client.company }}</td>
                  <td class="text-end">{{ client.dateAdded }}</td>
                  <td class="text-end">
                    <button @click="onEditClient(client)" class="btn btn-outline-info">
                      <i class="fa-solid fa-pen me-2" />Editer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { useBillStore } from '@/stores/bill'
import { useClientStore } from '@/stores/client'
import { mapState, mapActions } from 'pinia'
// filtre les factures par année
function filterBillsByYear(bills, year) {
  return bills.filter((bill) => new Date(bill.date).getFullYear() === year)
}

// calcule le pourcentage d'une partie par rapport à un total
function calculatePercentage(part, total) {
  return ((part / total) * 100).toFixed(2)
}

export default {
  components: {
  },
  data() {
    return {
      year: new Date().getFullYear()
    }
  },
  computed: {
    ...mapState(useBillStore, ['bills']),
    ...mapState(useClientStore, ['clients'])
  },
  async mounted() {
    await this.getAllBills()
    await this.getAllClients()
  },
  methods: {
    ...mapActions(useBillStore, ['getAllBills']),
    ...mapActions(useClientStore, ['getAllClients']),
    onEditBill(bill) {
      this.$router.push({
        name: 'edit-bill',
        params: {
          id: bill.id
        }
      })
    },
    onEditClient(client) {
      this.$router.push({
        name: 'edit-client',
        params: {
          id: client.id
        }
      })
    },
    // obtient le nombre de factures de l'année en cours
    billsFromCurrentYear() {
      return this.bills.filter((bill) => new Date(bill.date).getFullYear() === this.year).length
    },
    // obtient le total des factures encaissées pour l'année donnée
    totalCollected(year) {
      const bills = filterBillsByYear(this.bills, year)
      return bills.reduce((acc, bill) => acc + bill.paid, 0)
    },
    // obtient le total des factures facturées pour l'année donnée
    totalBilled(year) {
      const bills = filterBillsByYear(this.bills, year)
      return bills.reduce((acc, bill) => acc + bill.totalTTC, 0)
    },
    // obtient le total des factures non payées depuis plus d'un mois
    totalOverdue(year) {
      const currentDate = new Date()
      const oneMonthAgo = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        currentDate.getDate()
      )
      return filterBillsByYear(this.bills, year)
        .filter((bill) => {
          const billDate = new Date(bill.date)
          return billDate <= oneMonthAgo && bill.paid < bill.totalTTC
        })
        .reduce((acc, bill) => acc + bill.totalTTC - bill.paid, 0)
    },
    // obtient le pourcentage du total encaissé pour l'année donnée
    totalCollectedPercentage(year) {
      const collected = this.totalCollected(year)
      const total = collected + this.totalBilled(year) + this.totalOverdue(year)
      return calculatePercentage(collected, total)
    },
    // obtient le pourcentage du total facturé pour l'année donnée
    totalBilledPercentage(year) {
      const billed = this.totalBilled(year)
      const total = this.totalCollected(year) + billed + this.totalOverdue(year)
      return calculatePercentage(billed, total)
    },
    // obtient le pourcentage du total dû depuis plus d'un mois pour l'année donnée
    totalOverduePercentage(year) {
      const overdue = this.totalOverdue(year)
      const total = this.totalCollected(year) + this.totalBilled(year) + overdue
      return calculatePercentage(overdue, total)
    },
    // obtient la variation du pourcentage du total encaissé par rapport à l'année précédente
    totalCollectedPercentageVariation(year) {
      const collected = this.totalCollected(year)
      const collected2 = this.totalCollected(year - 1)
      return calculatePercentage(collected - collected2, collected2)
    },
    // obtient la variation du pourcentage du total facturé par rapport à l'année précédente
    totalBilledPercentageVariation(year) {
      const billed = this.totalBilled(year)
      const billed2 = this.totalBilled(year - 1)
      return calculatePercentage(billed - billed2, billed2)
    },
    // obtient la variation du pourcentage du total dû depuis plus d'un mois par rapport à l'année précédente
    totalOverduePercentageVariation(year) {
      const overdue = this.totalOverdue(year)
      const overdue2 = this.totalOverdue(year - 1)
      return calculatePercentage(overdue - overdue2, overdue2)
    }
  }
}
</script>

<style scoped></style>
