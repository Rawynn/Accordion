import { fetchAccordionData } from '@/services/api'

export const state = () => ({
  cachedAccordionData: null,
})

export const getters = {
  getAccordionData: (state) => {
    return state.cachedAccordionData
  },
}

export const actions = {
  async fetchAndCacheAccordionData({ commit }) {
    if (!this.state.cachedAccordionData) {
      try {
        const accordionData = await fetchAccordionData()
        commit('setAccordionData', accordionData)
      } catch (error) {
        console.error('Error fetching accordion data:', error)
      }
    }
  },
}

export const mutations = {
  setAccordionData(state, data) {
    state.cachedAccordionData = data
  },
}
