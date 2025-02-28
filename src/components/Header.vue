<template>
    <nav>
        <h2 @click="$router.push('/')">Valhalla's Tabletop Games</h2>
        <div style="display: flex; flex-direction: row;" >
            <router-link to="/" class="">Return Home</router-link>
            <router-link to="/addrecord" class="">Add Record</router-link>
            <div class="dropdown MobileHide">
                <button class="dropbtn" style="width: 85px !important;">View Tools</button>
                <div class="dropdown-content">
                    <router-link to="/gamerecords">View Records</router-link>
                    <!-- <router-link to="/DominionSelect">Dominion Selector</router-link> -->
                </div>
            </div>
            <!-- <router-link to="/profile?name=current" class="">Your Profile</router-link>
            <router-link to="/logout" class="">Log Out</router-link> -->
        </div>
    </nav>
</template>

<script>
import axios from "axios"

export default {
    name: "Home",
    data(){
        return{
            userName: 'Josh',
            posterID: 1
        }
    },
    methods: {
        test(){
            console.log("ADD GAME SCREEN");
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
</style>