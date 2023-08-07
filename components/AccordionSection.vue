<template>
  <v-row
    v-if="hasAccordionData"
    class="columns--two d-flex flex-row align-center justify-center"
  >
    <v-col class="column column--left d-flex justify-center">
      <v-lazy
        :min-height="200"
        :options="{ threshold: 0.5 }"
        transition="fade-transition"
      >
        <v-img
          class="column__image"
          :lazy-src="activeImageUri"
          min-height="150"
          :src="activeImageUri"
          max-width="650"
          width="100%"
        >
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey-lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-lazy>
    </v-col>
    <v-col class="column column--right">
      <div class="column__headers d-flex flex-wrap">
        <h1 class="font-weight-medium-bold order-2">
          {{ accordionData.title }}
        </h1>
        <h2 class="font-weight-regular order-1">{{ accordionData.tag }}</h2>
      </div>
      <v-lazy
        :min-height="200"
        :options="{ threshold: 0.5 }"
        transition="fade-transition"
      >
        <v-expansion-panels v-model="localPanel">
          <v-expansion-panel
            v-for="(item, i) in accordionData.items"
            :key="i"
            class="rounded"
            @click="onPanelExpansionClick"
          >
            <v-expansion-panel-header>
              <h3 class="font-weight-medium">{{ item.title }}</h3>
              <template #actions>
                <v-icon x-small> mdi-triangle </v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>{{ item.text }}</p>

              <v-img
                class="panel__image"
                :lazy-src="item.image"
                min-height="150"
                max-width="250"
                :src="item.image"
                contain
              >
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey-lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-lazy>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'AccordionSection',
  props: {
    accordionData: {
      type: Object,
      default: null,
    },
    panel: {
      type: Number,
      default: 0,
    },
    updatePanel: {
      type: Function,
      default: () => {},
    },
    imageUri: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      localPanel: this.panel,
      localImageUri: this.imageUri,
    }
  },
  computed: {
    hasAccordionData() {
      return this.accordionData && this.accordionData.items
    },
    activeImageUri() {
      if (this.localImageUri) {
        return this.localImageUri
      } else if (this.imageUri) {
        return this.imageUri
      } else {
        return ''
      }
    },
  },
  created() {
    this.localImageUri = this.imageUri
  },

  methods: {
    async onPanelExpansionClick(event) {
      this.$emit('updatePanel', this.panel + 1)
      const panelHeader = event.currentTarget
      const isActive = panelHeader.classList.contains(
        'v-expansion-panel-header--active'
      )

      if (!isActive) {
        await this.waitForPanelContent(panelHeader)

        const panelContent = panelHeader.nextElementSibling
        if (
          panelContent &&
          panelContent.classList.contains('v-expansion-panel-content')
        ) {
          const imageElement = panelContent.querySelector('.v-image__image')
          if (imageElement) {
            this.localImageUri =
              imageElement.style.backgroundImage.split('"')[1]
          }
        }
      }
    },

    async waitForPanelContent(panelHeader, maxAttempts = 10) {
      let attempts = 0
      while (attempts < maxAttempts) {
        const panelContent = panelHeader.nextElementSibling
        if (
          panelContent &&
          panelContent.classList.contains('v-expansion-panel-content')
        ) {
          return
        }
        await this.$nextTick()
        attempts++
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
      console.error('Panel content not found.')
    },
  },
}
</script>
