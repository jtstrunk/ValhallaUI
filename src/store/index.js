import { createStore } from 'vuex'

export default createStore({
    state: {
      selectedCards: [],
      colonyGame: false,
      landmarkName: "",
      eventName: []
    },
    mutations: {
      SET_SELECTED_CARDS(state, cards) {
        state.selectedCards = cards
      },
      SET_COLONY_GAME(state, bool) {
        state.colonyGame = bool
      },
      SET_LANDMARK_NAME(state, name) {
        state.landmarkName = name
      },
      SET_EVENT_NAME(state, names) {
        state.eventName = names
      }
    },
    actions: {
      updateSelectedCards({ commit }, cards) {
        commit('SET_SELECTED_CARDS', cards)
      },
      updateColonyGame({ commit }, bool) {
        commit('SET_COLONY_GAME', bool)
      },
      updateLandmarkName({ commit }, name) {
        commit('SET_LANDMARK_NAME', name)
      },
      updateEventName({ commit }, name) {
        commit('SET_EVENT_NAME', name)
      }
    },
    getters: {
      getSelectedCards: state => state.selectedCards,
      getColonyGame: state => state.colonyGame,
      getLandmarkName: state => state.landmarkName,
      getEventName: state => state.eventName,
    }
})