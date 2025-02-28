<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="loginUser">
        <input type="text" v-model="username" required>
        <input type="password" v-model="password" required>
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import { userState } from '/src/state/userState'
  
  export default {
    data() {
      return {
        userID: null,
        username: '',
        password: ''
      }
    },
    methods: {
      async loginUser() {

        try {
            await axios.post('http://127.0.0.1:8000/login', {username: this.username, password: this.password}, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log(response.data)
                this.userID = response.data.userid
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });

            
            if(this.userID > 0) {
                console.log('USER ID: ', this.userID)
                userState.userID = this.userID;
                userState.username = this.username;
                userState.isLoggedIn = true

                console.log(userState.userID)
                console.log(userState.username)
            } else {
                console.log('no matchig user')
            }

        //   if (response.data.token) {
        //     localStorage.setItem('token', response.data.token)
        //     this.$router.push('/dashboard')
        //   }
        } catch (error) {
          console.error('Login failed:', error)
        }
      }
    }
  }
  </script>
  