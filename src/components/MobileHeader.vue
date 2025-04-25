<template>
    <div id="mobileHeader">
        <div style="display: flex; flex-direction: row;">
            <img :src="profileImageSrc" id="profile" @click="navigateToProfile(follower.username)">
            <p>{{ this.userName }}</p>
        </div>
        <img src="/src/assets/icons/logout-512.webp" id="logout" @click="logUserOut">
    </div>
</template>

<script>
import { userState } from '/src/state/userState'

export default {
    name: "Home",
    data(){
        return{
            userName: userState.username
        }
    },
    computed: {
        profileImageSrc() {
            let profilePictures = ['josh', 'john', 'ethangambles', 'Hibby']
            if(!profilePictures.includes(this.userName)) {
                let name = 'Guest'
                return new URL(`../assets/profilepictures/${name}.png`, import.meta.url).href
            }
            return new URL(`../assets/profilepictures/${this.userName}.png`, import.meta.url).href
        },
        scrolling() {
            return window.scrollY > 0
        }
    },
    methods: {
        logUserOut(){
            userState.userID = null;
            userState.username = null;
            userState.isLoggedIn = false;
            this.$router.push(`/login`);
        },
        navigateToProfile(name) {
            this.$router.push(`/profile/${name}`);
            let searchName = name;
            if(searchName == 'Guest') {
                searchName = 'josh'
                this.isVisitor = true;
            }
            this.recentGames = [];
            this.fetchGames(searchName);
            this.fetchUserStats(searchName);
            this.userName = name;
            this.showDialog = false;
        },
    },
}
</script>

<style>
#mobileHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 92%;
    margin-top: 45px;
}
#mobileHeader img {
    margin-top: 10px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-bottom: 8px;
}
#mobileHeader p {
    color: white;
    margin-top: 15px;
    margin-bottom: 10px;
    margin-left: 8px;
    font-size: larger;
}

#logout {
    border-radius: 0% !important;
}
#logout::hover {
    cursor: pointer;
}
</style>