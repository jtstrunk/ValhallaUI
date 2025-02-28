import { reactive, watch } from 'vue'

const storedState = localStorage.getItem('userState')
const initialState = storedState ? JSON.parse(storedState) : {
  userID: null,
  username: '',
  isLoggedIn: false
}

export const userState = reactive(initialState)

// Watch for changes and update localStorage
watch(userState, (state) => {
  localStorage.setItem('userState', JSON.stringify(state))
}, { deep: true })
