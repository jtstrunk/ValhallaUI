import { createStore } from 'vuex'

export default createStore({
    state: {
      selectedCards: [],
      colonyGame: false
    },
    mutations: {
      SET_SELECTED_CARDS(state, cards) {
        state.selectedCards = cards
      },
      SET_COLONY_GAME(state, bool) {
        state.colonyGame = bool
      }
    },
    actions: {
      updateSelectedCards({ commit }, cards) {
        commit('SET_SELECTED_CARDS', cards)
      },
      updateColonyGame({ commit }, bool) {
        commit('SET_COLONY_GAME', bool)
      }
    },
    getters: {
      getSelectedCards: state => state.selectedCards,
      getColonyGame: state => state.colonyGame
    }
})