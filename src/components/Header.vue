<template>
    <nav>
        <h2 @click="$router.push('/')">Valhalla's Tabletop Games</h2>
        <div style="display: flex; flex-direction: row;" >
            <router-link :class="['nav-link']" to="/" class="">Return Home</router-link>
            <router-link :class="['nav-link']" to="/addrecord" class="">Add Record</router-link>
            <div class="dropdown MobileHide">
                <button class="dropbtn" style="width: 85px !important;">View Tools</button>
                <div class="dropdown-content">
                    <router-link to="/gamerecords">View Records</router-link>
                    <!-- <router-link to="/dominionselect">Dominion Selector</router-link> -->
                </div>
            </div>
            <router-link :class="['nav-link']" :to="`/profile/${this.userName}`" class="">Your Profile</router-link>
            <router-link :class="['nav-link']" to="/login" @click="logUserOut" class="">Log Out</router-link>
        </div>
    </nav>
</template>

<script>
import { userState } from '/src/state/userState'

export default {
    name: "Home",
    data(){
        return{
            userName: userState.username,
            posterID: 1
        }
    },
    methods: {
        logUserOut(){
            console.log("logging user out");
            userState.userID = null;
            userState.username = null;
            userState.isLoggedIn = false
        },
    },
}
</script>

<style>
nav{
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: #333333;
    width: 100%;
    position: sticky;
    top: 0px;
    z-index: 1000;
}
nav a {
    margin: 10px;
    text-decoration: none;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 6px;
    padding-right: 6px;
    border: 1px solid black;
    border-radius: 8px;
    text-align: center;
    color: black;
    background-color: white;
}
nav h2 {
    margin-top: 10px;
    margin-bottom: 12px;
    margin-right: 100px;
    color: white;
    cursor: pointer;
}

.dropbtn {
    margin: 10px;
    height: 30px;
    text-decoration: none;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 6px;
    padding-right: 6px;
    border: 1px solid black;
    border-radius: 8px;
    text-align: center;
    color: black;
    background-color: white;
    display: block;
    cursor: pointer;
    font-size: 15px;
}
.dropbtn:hover {
    margin: 10px;
    height: 30px;
    text-decoration: none;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 6px;
    padding-right: 6px;
    border: 1px solid black;
    border-radius: 8px;
    text-align: center;
    color: black;
    background-color: white;
    display: block;
    cursor: pointer;
    font-size: 15px;
}
.dropdown-content {
    display: none;
    position: absolute;
    z-index: 1;
}
.dropdown:hover a {
    width: 130px;
    display: block;
    margin: 0 10px;
    margin-bottom: 2px;
}
.dropdown:hover .dropdown-content {
    display: block;
    width: 90px;
}


@media (max-width: 	420px) {
    .MobileHide {
        display: none !important;
    }

    nav{
        flex-direction: column;
        justify-content: center;
    }
    nav h2 {
        font-size: 30px;
        margin-bottom: 0px;
        margin-right: 0px;
        text-align: center;
    }
    .nav-link {
        font-size: 14px; /* Smaller font size for screens <= 420px */
    }
}
</style>