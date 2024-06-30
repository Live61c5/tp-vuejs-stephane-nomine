<template>
  <table class="table">
    <thead>
      <tr>
        <slot name="thead">
          <th>Nom</th>
          <th>Entreprise</th>
          <th class="text-end">Date d'ajout</th>
          <th class="text-end">Action</th>
        </slot>
      </tr>
    </thead>
    <tbody>
      <slot />
    </tbody>
  </table>
</template>

<script>
export default {}
</script>

<style scoped></style>
