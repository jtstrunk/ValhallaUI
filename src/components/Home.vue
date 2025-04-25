<template>
    <div id="content" @scroll="handleScroll">
        <div class="section MobileHide" style="display: flex; flex-direction: column; align-items: center; height: 530px; position: sticky; top: 60px;">
            <div>
                <img :src="profileImageSrc" id="profile" @click="navigateToProfile(follower.username)">
            </div>
            <p style="color: white; margin-top: 5px; margin-bottom: 8px;">{{ this.userName }}</p>
            <div>
                <div class="stat">
                    <img class="icon" src="/src/assets/icons/mostplayed.png">
                    <p style="margin-top: 14px;">Most Played Game</p>
                    <p style="font-family: 'Manolo Mono', sans-serif !important;">{{ this.userStats.mostplayed }}</p>
                </div>
                <div class="stat">
                    <img class="icon" src="/src/assets/icons/mostwon.png" style="width: 35px;">
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
            <div @click="$router.push('/gamerecords')" class="quickLink">
                <span style="color: white;">View Your Games</span>
                <img src="/src/assets/icons/arrow.png" class="arrow">
            </div>
            <div class="quickLink" >
                <span style="color: white;">Dominion Selector</span>
                <img src="/src/assets/icons/arrow.png" class="arrow">
            </div>
        </div>
        <div class="section" id="recentGamesSection">
            <div :style="headerWidth" id="mobileContainer" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div id="recentGamesContainer" class="MobileHide" style="display: flex; flex-direction: row; justify-content: space-between;">
                    <h2 style="margin: 0px;">Recent Games</h2>
                    <!-- <div :style="headerMargin">
                        <img src="/src/assets/icons/listblue.png" @click="swapView('list')" id="listView" style="width: 25px; height: 25px; margin-right: 5px;">
                        <img src="/src/assets/icons/gridblue.png" @click="swapView('grid')" id="gridView" style="width: 25px; height: 25px;">
                    </div> -->
                    <div style="display: flex; flex-direction: row;">
                        <p style="margin: 0px; margin-top: 2px; margin-right: 10px; font-family: 'Manolo Mono', sans-serif !important;">Following Games</p>
                        <VueToggles v-model="followingGames" :width="50" checkedBg="#17a2b8"/>
                    </div>
                    
                </div>
                <!-- <div v-if="showGrid" style="display: flex; flex-direction: row; flex-wrap: wrap;">
                    <div v-for="game in recentGames.slice(0, 9)">
                        <RecentGame :gameData="game" :isVisitor="isVisitor" :suggestedNames="suggestedNames" 
                            :showingGames="showingGames" :themeGames="themeGames" :typeGames="typeGames" 
                            :searchType="searchType" :startDate="startDate" :endDate="endDate"/>
                    </div>
                </div> -->
                <div v-if="showList" id="showListContainer" style="display: flex; justify-content: center; flex-direction: row; flex-wrap: wrap;">
                    <div v-for="game in recentGames">
                        <RecentGameCard :gameData="game" :isVisitor="isVisitor" :suggestedNames="suggestedNames" :users="users"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="section MobileHide" style="width: 290px; height: 530px; position: sticky; top: 60px;">
            <div id="quickadd">
                <h2 style="color: white; margin-top: 0px; margin-bottom: 14px;">Quick Features</h2>
                <div class="quickgame">
                    <div style="margin-left: 5px; margin-top: 3px;">
                        <p class="gameTitle">Dominion</p>
                        <button id="addDominion" class="btn btn-outline quickadd">Quick Add</button>
                    </div>
                    <img src="/src/assets/addgame/Dominion.webp">
                </div>

                <div class="quickgame">
                    <div style="margin-left: 5px; margin-top: 3px;">
                        <p class="gameTitle">Heat</p>
                        <button id="addHeat" style="width: 160px; outline: none;" class="btn btn-outline quickadd">Quick Add</button>
                    </div>
                    <img src="/src/assets/addgame/Heat.webp">
                </div>

                <div class="quickgame">
                    <div style="margin-left: 5px; margin-top: 3px;">
                        <p class="gameTitle">Clank</p>
                        <button id="addClank" style="width: 160px; outline: none;" class="btn btn-outline quickadd">Quick Add</button>
                    </div>
                    <img src="/src/assets/addgame/Clank.webp">
                </div>

                <div class="quickgame">
                    <div style="margin-left: 5px; margin-top: 3px;">
                        <p class="gameTitle">Lords of Waterdeep</p>
                        <button id="addLords" style="width: 160px; outline: none;" class="btn btn-outline quickadd">Quick Add</button>
                    </div>
                    <img src="/src/assets/addgame/LordsofWaterdeep.webp">
                </div>

                <div class="quickgame">
                    <div style="margin-left: 5px; margin-top: 3px;">
                        <p class="gameTitle">Race for the Galaxy</p>
                        <button id="addRace" style="width: 160px; outline: none;" class="btn btn-outline quickadd">Quick Add</button>
                    </div>
                    <img src="/src/assets/addgame/RacefortheGalaxy.webp">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import RecentGame from './RecentGame.vue'
import RecentGameCard from './RecentGameCard.vue'
import { userState } from '/src/state/userState'
import VueToggles from "vue-toggles";

export default {
    name: "Home",
    props: {
        scrolledToBottom: {
            type: Boolean,
            required: true,
        },
    },
    data(){
        return{
            userName: userState.username,
            currentProfile: 'josh',
            followingGames: true,
            showGrid: false,
            showList: true,
            isVisitor: false,
            recentGamesIndex: 1,
            recentGames: [],
            showingGames: [],
            suggestedNames: [],
            users: [],
            showingThemes: [],
            themeGames: [],
            showingTypes: [],
            typeGames: [],
            startDate: '2023-06-13',
            endDate: new Date().toISOString().slice(0, 10),
            userStats: Object,
        }
    },
    components: {
        RecentGame,
        RecentGameCard,
        VueToggles
    },
    watch: {
        scrolledToBottom() {
            let searchName = this.userName;
            if(searchName == 'Guest') {
                searchName = 'josh'
            }
            if(this.followingGames == true) {
                this.fetchUserandFollowingGames(searchName);
            } else {
                this.fetchUserGames(searchName);
            }
        },
        followingGames: {
            handler(newValue) {
                let searchName = this.userName;
                if(searchName == 'Guest') {
                    searchName = 'josh'
                }
                if(newValue == true) {
                    this.recentGamesIndex = 1;
                    this.recentGames = [];
                    this.fetchUserandFollowingGames(searchName);
                } else {
                    this.recentGamesIndex = 1;
                    this.recentGames = [];
                    this.fetchUserGames(searchName)
                }
            }
        }
    },
    methods: {
        swapView(type) {
            if (type === 'list') {
                if (!this.showList) {
                    this.showList = true;
                    this.showGrid = false;
                }
            } else if (type === 'grid') {
                if (!this.showGrid) {
                    this.showGrid = true;
                    this.showList = false;
                }
            }
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
        handleScroll() {
            const content = document.getElementById('content');
            if (content.scrollTop + content.clientHeight >= content.scrollHeight - 10) {
                this.fetchMoreGames(this.userName);
            }
        },
        async fetchUserandFollowingGames(user) {
            axios.get(`${import.meta.env.VITE_API_URL}/userfollowinggames/${user}/${this.recentGamesIndex}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log(response.data);
                const newGames = response.data.filter(newGame => 
                    !this.recentGames.some(existingGame => existingGame.gameid === newGame.gameid)
                );
                this.recentGames = [...this.recentGames, ...newGames];
                this.recentGamesIndex += 1;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
        async fetchUserGames(user) {
            axios.get(`${import.meta.env.VITE_API_URL}/usergames/${user}/${this.recentGamesIndex}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log(response.data)
                this.recentGames = [...this.recentGames, ...response.data];
                this.recentGamesIndex += 1;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
        async fetchUserStats(user) {
            axios.get(`${import.meta.env.VITE_API_URL}/getuserstats/${user}`, {
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
            axios.get(`${import.meta.env.VITE_API_URL}/getuseruniqueplayers/${user}`, {
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
        async fetchUsers() {
            axios.get(`${import.meta.env.VITE_API_URL}/getusers`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                this.users = response.data.map(user => ({
                    id: user.id,
                    username: user.username
                }));
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        }
    },
    computed: {
        headerWidth() {
            const isMobile = window.innerWidth <= 400;
            return {
                width: isMobile ? '400px' : (this.showList ? '500px' : '595px')
            };
        },
        headerMargin() {
        return {
            marginRight: this.showList == true ? '0px' : '10px'
            }
        },
        profileImageSrc() {
            let profilePictures = ['josh', 'john', 'ethangambles', 'Hibby']
            if(!profilePictures.includes(this.userName)) {
                let name = 'Guest'
                return new URL(`../assets/profilepictures/${name}.png`, import.meta.url).href
            }
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
        console.log("Mode:", import.meta.env.MODE);
        let searchName = this.userName;
        if(searchName == 'Guest') {
            searchName = 'josh'
            this.isVisitor = true;
        }
        this.fetchUserandFollowingGames(searchName);
        this.fetchUserStats(searchName);
        this.fetchUsersPlayedWith(this.userName);
        this.fetchUsers();
    }
}
</script>

<style scoped>
#profile {
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

.quickLink {
    display: flex; 
    flex-direction: row; 
    justify-content: space-between; 
    background-color: #3A3B3C; 
    padding: 10px; 
    border-radius: 5px; 
    margin-top: 10px; 
    width: 270px;
}

.quickLink:hover {
    transform: scale(1.02);
    transition: transform 0.2s;
    cursor: pointer;
}

.quickgame {
    display: flex;
    flex-direction: row;
    width: 270px;
    justify-content: space-between;
    margin-top: 10px;
    background-color: #3A3B3C;
    padding-left: 6px;
    border-radius:5px !important;
}
.quickgame:hover {
    transform: scale(1.02);
    transition: transform 0.2s;
}
.quickgame p {
    color: white;
    font-size: large;
    margin-bottom: 8px;
    margin-top: 6px;
    font-family: 'Manolo Mono', sans-serif !important;
}
.quickgame img {
    border-radius:0px 5px 5px 0px;
    width: 85px;
    height: 85px;
}
.btn-outline {
    color: #17a2b8 !important;
    background: transparent;
    border: 2px solid #17a2b8;
    outline: none;
    padding: 4px 7px;
    margin-top: 5px;
}

.quickadd {
    width: 160px;
    border-radius: 4px;
    outline: none;
    font-size: medium;
    cursor: pointer;
}

@media (max-width: 	420px) {
    .MobileHide {
        display: none !important;
    }

    .section {
        padding: 0px;
    }

    h2 {
        margin-top: 5px !important;
        margin-left: 5px !important;
    }

    #mobileContainer{
        width: 100% !important;
    }

    #showListContainer {
        width: 100%;
    }
    #recentGamesSection {
        padding: 0px;
        margin: 0px;
    }
    #content {
        width: 100%;
    }
}
</style>