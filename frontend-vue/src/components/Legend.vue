<template>
  <div class="d-flex align-items-center justify-content-between">
    <div class="d-flex align-items-center">
      <i class="fa-regular fa-circle me-2" :class="color" />
      <span class="small">{{ text }} - {{ safePercentage }}%</span>
    </div>
    <div class="d-flex align-items-center">
      <span class="small">{{ safePercentageVariation }}%</span>
      <i
        class="fa-solid ms-2"
        :class="
          safePercentageVariation > 0 ? 'fa-arrow-up text-success' : 'fa-arrow-down text-danger'
        "
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Legend',
  props: {
    text: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    percentage: {
      type: [Number, String],
      required: true
    },
    percentageVariation: {
      type: [Number, String],
      required: true
    }
  },
  computed: {
    safePercentage() {
      return isFinite(this.percentage) && !isNaN(this.percentage) ? this.percentage : 'N/A'
    },
    safePercentageVariation() {
      return isFinite(this.percentageVariation) && !isNaN(this.percentageVariation)
        ? this.percentageVariation
        : 'N/A'
    }
  }
}
</script>

<style scoped></style>
