<template>
  <v-container>
    <accordion-section
      v-if="accordionData"
      :accordion-data="accordionData"
      :panel="panel"
      :update-panel="updateLocalPanel"
      :image-uri="imageUri"
    />
    <error-alert v-if="error" :message="error.message" />
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AccordionSection from '@/components/AccordionSection.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'

export default {
  name: 'IndexPage',
  components: {
    AccordionSection,
    ErrorAlert,
  },
  async asyncData({ store }) {
    await store.dispatch('accordion/fetchAndCacheAccordionData')
    return {
      accordionData: store.getters['accordion/getAccordionData'],
    }
  },
  data() {
    return {
      error: '',
      panel: 0,
      imageUri: '',
      accordionData: null,
    }
  },
  computed: {
    ...mapGetters('accordion', ['getAccordionData']),
    firstImageUri() {
      if (
        this.getAccordionData &&
        this.getAccordionData.items &&
        this.getAccordionData.items.length > 0
      ) {
        return this.getAccordionData.items[0].image
      }
      return ''
    },
  },
  async created() {
    await this.fetchAndCacheAccordionData()
    this.imageUri = this.firstImageUri
  },

  methods: {
    updateLocalPanel(newValue) {
      this.panel = newValue
    },
    ...mapActions('accordion', ['fetchAndCacheAccordionData']),
  },
}
</script>
