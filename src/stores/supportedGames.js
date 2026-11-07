import axios from 'axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSupportedGamesStore = defineStore('supportedGames', () => {
    const games = ref([])
    const loading = ref(false)
    const loaded = ref(false)
    const error = ref(null)
    let controller

    const supportedGames = computed(() => games.value.map(game => game.gamename))
    const gamesByName = computed(() => Object.fromEntries(
        games.value.map(game => [game.gamename, game])
    ))
    const gamePlayerCounts = computed(() => Object.fromEntries(
        games.value.map(game => [
            game.gamename,
            game.minimumplayercount === game.maximumplayercount
                ? `${game.minimumplayercount} Players`
                : `${game.minimumplayercount} - ${game.maximumplayercount} Players`
        ])
    ))

    async function fetchSupportedGames(username) {
        controller?.abort()
        const request = new AbortController()
        controller = request
        games.value = []
        loaded.value = false
        error.value = null
        loading.value = false

        if (!username) return

        loading.value = true
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/getsupportedgames/${encodeURIComponent(username)}`,
                {
                    signal: request.signal,
                    withCredentials: false,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            if (request.signal.aborted) return

            games.value = response.data
            loaded.value = true
        } catch (cause) {
            if (request.signal.aborted) return
            console.error('Error fetching supported games:', cause)
            error.value = 'Unable to load supported games. Please try again.'
        } finally {
            if (controller === request) loading.value = false
        }
    }

    return { games, supportedGames, gamesByName, gamePlayerCounts, loading, loaded, error, fetchSupportedGames }
})
