<template>
    <div id="logIn" v-if="!showingForm">
      <h2>Login</h2>
      <form @submit.prevent="loginUser">
        <div>
          <label for="username">username</label>
          <input type="text" v-model="username" placeholder="username" required>
        </div>
        <div>
          <label for="password">password</label>
          <input type="password" v-model="password" placeholder="password" required>
        </div>
        <button type="submit" class="btn-primary">Login</button>
        <label for="signup" style="margin-top: 20px;">Don't have an account?</label>
        <button type="button" id="signup" class="btn-link" @click="toggleForm()">Sign Up</button>

        <label for="visiting" style="margin-top: 15px;">Just Visiting?</label>
        <button type="button" id="visiting" class="btn-link" @click="redirectToVisitor()">Visiting Mode</button>
      </form>
    </div>
    <div id="register" v-if="showingForm">
      <h2>Register</h2>
      <form @submit.prevent="registerUser">
        <div>
          <label for="username">username</label>
          <input type="text" v-model="username" placeholder="username" required>
        </div>
        <div>
          <label for="password">password</label>
          <input type="password" v-model="password" placeholder="password" required>
        </div>
        <button type="submit" class="btn-primary">Register</button>
        <label for="signup" style="margin-top: 20px;">Already have an account?</label>
        <button type="button" id="signup" class="btn-link" @click="toggleForm()">Log In</button>
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
        password: '',
        showingForm: false,
      }
    },
    methods: {
      async loginUser() {
        try {
          await axios.post('https://api.valhallatable.top/login', {username: this.username, password: this.password}, {
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
            userState.isLoggedIn = true;

            console.log(userState.userID);
            console.log(userState.username);
            this.$router.push('/');
          } else {
            console.log('no matchig user')
          }
        } catch (error) {
          console.error('Login failed:', error)
        }
      },
      async registerUser() {
        try {
          await axios.post('https://api.valhallatable.top/register', {username: this.username, password: this.password}, {
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

          await this.loginUser();

        } catch (error) {
          console.error('Login failed:', error)
        }
      },
      redirectToVisitor(){
        userState.userID = 0;
        userState.username = 'Guest';
        userState.isLoggedIn = true;
        this.$router.push('/');
      },
      toggleForm() {
        this.showingForm = !this.showingForm
      }
    }
  }
  </script>

  <style>
  #logIn, #register {
    margin-top: 55px;
    background-color: #333333;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 8px;
  }

  form {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0px 60px 50px 60px; 
  }
  form div {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
  }
  form label {
    color: white;
  }
  label:nth-child(-n+2) {
    margin-bottom: 3px;
  }

  input {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid white;
  }

  .btn-primary{
    color: #fff;
    background-color: #337ab7;
    border-color: #2e6da4;
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    border: 1px solid transparent;
    border-radius: 4px;
    width: 100%;
    cursor: pointer;
  }

  .btn-link {
    color: #fff;
    background-color: #333333;
    border: 1px solid #fff;
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    border-radius: 4px;
    width: 100%;
    margin-top: 5px;
    cursor: pointer;
  }

  </style>