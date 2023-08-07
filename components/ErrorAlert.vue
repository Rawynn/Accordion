<template>
  <v-row v-if="error">
    <div class="error-alert">{{ message }}</div>
  </v-row>
</template>

<script>
export default {
  name: 'ErrorAlert',
  props: {
    message: String,
  },
}
</script>
