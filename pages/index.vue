<template>
  <v-container>
    <v-row class="columns--two d-flex flex-row align-center justify-center">
      <v-col class="column column--left d-flex justify-center">
        <v-lazy
          :min-height="200"
          :options="{ threshold: 0.5 }"
          transition="fade-transition"
        >
          <v-img
            class="column__image"
            :lazy-src="imageUri"
            min-height="150"
            :src="imageUri"
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
        <h2 class="font-weight-regular">{{ accordionData.tag }}</h2>
        <h1 class="font-weight-medium-bold">{{ accordionData.title }}</h1>
        <v-lazy
          :min-height="200"
          :options="{ threshold: 0.5 }"
          transition="fade-transition"
        >
          <v-expansion-panels v-model="panel">
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
    <v-row v-if="error">
      <ErrorAlert :message="error.message" />
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'IndexPage',
  async asyncData() {
    try {
      const api = 'https://eoyge3duj7xtdqd.m.pipedream.net/'
      const response = await axios.get(api)
      const accordionData = response.data
      const imageUri = accordionData.items[0].image
      return { accordionData, imageUri }
    } catch (error) {
      return { error }
    }
  },
  data() {
    return {
      error: '',
      loading: false,
      panel: 0,
    }
  },

  methods: {
    async onPanelExpansionClick(event) {
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
            this.imageUri = imageElement.style.backgroundImage.split('"')[1]
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
