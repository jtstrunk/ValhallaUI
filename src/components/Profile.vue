<template>
    <!-- <button @click="handleLogout">Logout</button> -->
    <div id="content">
        <div class="section MobileHide" style="display: flex; flex-direction: column; align-items: center; height: 545px; position: sticky; top: 60px;">
            <div>
                <img :src="profileImageSrc" @error="setDefaultImage" id="profilePicture" onclick="location.href='/profile?name=current'">
            </div>
            <p style="color: white; margin-top: 5px; margin-bottom: 8px;">{{ this.userName }}</p>
            <div>
                <div class="stat">
                    <img class="icon" src="/src/assets/icons/bestfriend.png" style="width: 40px; height: 40px;">
                    <div style="display: flex; flex-direction: row; justify-content: space-around; width: 100%;">
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <p style="margin-top: 14px;">Games Played</p>
                            <p style="font-family: 'Manolo Mono', sans-serif !important;">{{ this.userStats.gamesplayed }}</p>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <p style="margin-top: 14px;">Games Won</p>
                            <p style="font-family: 'Manolo Mono', sans-serif !important;">{{ this.userStats.gameswon }}</p>
                        </div>
                    </div>
                    
                </div>
                <div class="stat">
                    <img class="icon" src="/src/assets/icons/mostplayed.png">
                    <p style="margin-top: 14px;">Most Played Game</p>
                    <p style="font-family: 'Manolo Mono', sans-serif !important;">{{ this.userStats.mostplayed }}</p>
                </div>
                <div class="stat">
                    <img class="icon" src="/src/assets/icons/mostwon.png" style="width: 40px; padding: 6px 7px;">
                    <p style="margin-top: 14px;">Most Won Game</p>
                    <p style="font-family: 'Manolo Mono', sans-serif !important;">{{ this.userStats.mostwon }}</p>
                </div>
            </div>
            <div>
                <div id="latestGame" v-for="game in recentGames.slice(0, 1)">
                    <p>Latest Game</p>
                    <span style="font-size: large;">{{ game.gamename.slice(0, 13) }}{{ game.gamename.length > 14 ? '...' : '' }}</span>
                    <span style="color: white;"> - </span>
                    <span style="font-size: medium;">{{ formattedDate }}</span>
                </div>
            </div>
        </div>
        <div class="section">
            <div :style="headerWidth" style="display: flex; flex-direction: column; justify-content: space-between;">
                <h2 style="margin: 0px; ">Recent Games</h2>
                <div style="display: flex; flex-direction: row; flex-wrap: wrap;" :key="refeshGames">
                    <div v-for="game in recentGames.slice(0, 9)">
                        <RecentGame :gameData="game" :isVisitor="isVisitor" :suggestedNames="suggestedNames" 
                            :showingGames="showingGames" :themeGames="themeGames" :typeGames="typeGames" 
                            :searchType="searchType" :startDate="startDate" :endDate="endDate"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="section MobileHide" style="width: 290px; height: 530px; position: sticky; top: 60px;">
            <div>
                <div style="display: flex; flex-direction: row; justify-content: space-between;">
                    <h2 style="color: white; margin-top: 0px; margin-bottom: 14px;">Friends</h2>
                    <button v-if="logginUser != userName" id="addFriendBtn">Add Friend</button>
                </div>
                <div v-for="name in friendNames">
                    <p class="friendName" @click="navigateToProfile(name)">{{ name }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import RecentGame from './RecentGame.vue'
import { userState } from '/src/state/userState'

export default {
    name: "Profile",
    data(){
        return{
            userName: this.$route.params.username,
            logginUser: userState.username,
            isVisitor: false,
            refeshGames: 0,
            recentGamesIndex: 1,
            recentGames: [],
            showingGames: [],
            suggestedNames: [],
            showingThemes: [],
            themeGames: [],
            showingTypes: [],
            typeGames: [],
            friendNames: ['josh', 'thetwinmeister', 'ethangambles', 'jimmneyswift11', 'john'],
            startDate: '2023-06-13',
            searchType: 'exclusive',
            endDate: new Date().toISOString().slice(0, 10),
            userStats: Object,
        }
    },
    components: {
        RecentGame
    },
    methods: {
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
        },
        setDefaultImage(event) {
            event.target.src = new URL('../assets/profilepictures/Guest.png', import.meta.url).href;
        },
        async fetchGames(user) {
            axios.get(`http://127.0.0.1:8000/homepagegames/${user}/${this.recentGamesIndex}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log(response.data)
                this.recentGames = [...this.recentGames, ...response.data];
                this.refeshGames = this.refeshGames + 1;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
        async fetchUserStats(user) {
            axios.get(`http://127.0.0.1:8000/getuserstats/${user}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log(response.data)
                this.userStats = response.data;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
        async fetchUsersPlayedWith(user) {
            axios.get(`http://127.0.0.1:8000/getuseruniqueplayers/${user}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                this.suggestedNames = response.data;
                console.log(response.data)

                if (!this.suggestedNames.some(item => item.name === user)) {
                    this.suggestedNames.unshift({ name: user });
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
    },
    computed: {
        headerWidth() {
        return {
            width: '595px'
            }
        },
        profileImageSrc() {
            return new URL(`../assets/profilepictures/${this.userName}.png`, import.meta.url).href
        },
        formattedDate(){
            let parts = this.recentGames[0].date.split('-');
            let year = parts[0];
            let month = parts[1];
            let day = parts[2];
            const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            const monthName = months[month - 1];
            return `${monthName} ${day}, ${year}`
        }
    },
    created() {
        let searchName = this.userName;
        if(searchName == 'Guest') {
            searchName = 'josh'
            this.isVisitor = true;
        }
        this.fetchGames(searchName);
        this.fetchUserStats(searchName);
    }
}
</script>

<style scoped>
#profilePicture {
    width: 60px;
    height: 60px;
    border-radius: 50%;
}
.arrow {
    width: 20px;
    height: 20px;
}
.stat {
    width: 270px;
    height: 80px;
    background-color: #3A3B3C;
    margin-top: 35px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    border-radius: 8px;

}
.stat p {
    color: white;
    font-size: larger;
    z-index: 200;
    margin-top: 0px;
    margin-bottom: 10px;
}
.icon {
    background-color: #3A3B3C;
    z-index: 199;
    width: 40px;
    height: 40px;
    position: absolute;
    top: -25px;
    border-radius: 50%;
    border-bottom-right-radius: 0px !important;
    border-bottom-left-radius: 0px !important;
    padding: 6px;
}
#latestGame{
    background-color: #3A3B3C; 
    padding: 10px; 
    border-radius: 5px; 
    margin-top: 25px; 
    width: 270px;
}
#latestGame p {
    color: white;
    font-size: medium;
    margin-top: 0px;
    margin-bottom: 0px;
}
#latestGame span {
    color: white;
}

#addFriendBtn {
    margin-top: 2px;
    margin-right: 3px;
    height: 70%;
    color: #17a2b8 !important;
    background: transparent;
    border: 2px solid #17a2b8;
    outline: none;
    padding: 4px 7px;
    border-radius: 5px;
}
.friendName {
    font-family: 'Manolo Mono', sans-serif !important;
    margin-top: 0px;
}
</style>