<template>
    <!-- <button @click="handleLogout">Logout</button> -->
    <div id="content">
        <div class="section MobileHide" style="display: flex; flex-direction: column; align-items: center; height: 530px; position: sticky; top: 60px;">
            <div>
                <img src="/src/assets/profilepictures/joshpfp.png" id="profile" onclick="location.href='/profile?name=current'">
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
                    <span style="font-size: large;">{{ game.gamename }}</span><span style="color: white;"> - </span>
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
        <div class="section">
            <div :style="headerWidth" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; flex-direction: row; justify-content: space-between;">
                    <h2 style="margin: 0px; ">Recent Games</h2>
                    <div :style="headerMargin">
                        <img src="/src/assets/icons/listblue.png" @click="swapView('list')" id="listView" style="width: 25px; height: 25px; margin-right: 5px;">
                        <img src="/src/assets/icons/gridblue.png" @click="swapView('grid')" id="gridView" style="width: 25px; height: 25px;">
                    </div>
                </div>
                <div v-if="showGrid" style="display: flex; flex-direction: row; flex-wrap: wrap;">
                    <div v-for="game in recentGames.slice(0, 9)">
                        <RecentGame :gameData="game" :showingGames="showingGames" :suggestedNames="suggestedNames"/>
                    </div>
                </div>

                <div v-if="showList" style="display: flex; justify-content: center; flex-direction: row; flex-wrap: wrap;">
                    <div v-for="game in recentGames">
                        <RecentGameCard :gameData="game" :suggestedNames="suggestedNames"/>
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
                    <img src="/src/assets/addgame/Dominion.png">
                </div>

                <div class="quickgame">
                    <div style="margin-left: 5px; margin-top: 3px;">
                        <p class="gameTitle">Heat</p>
                        <button id="addHeat" style="width: 160px; outline: none;" class="btn btn-outline quickadd">Quick Add</button>
                    </div>
                    <img src="/src/assets/addgame/Heat.png">
                </div>

                <div class="quickgame">
                    <div style="margin-left: 5px; margin-top: 3px;">
                        <p class="gameTitle">Clank</p>
                        <button id="addClank" style="width: 160px; outline: none;" class="btn btn-outline quickadd">Quick Add</button>
                    </div>
                    <img src="/src/assets/addgame/Clank.png">
                </div>

                <div class="quickgame">
                    <div style="margin-left: 5px; margin-top: 3px;">
                        <p class="gameTitle">Lords of Waterdeep</p>
                        <button id="addLords" style="width: 160px; outline: none;" class="btn btn-outline quickadd">Quick Add</button>
                    </div>
                    <img src="/src/assets/addgame/LordsofWaterdeep.png">
                </div>

                <div class="quickgame">
                    <div style="margin-left: 5px; margin-top: 3px;">
                        <p class="gameTitle">Race for the Galaxy</p>
                        <button id="addRace" style="width: 160px; outline: none;" class="btn btn-outline quickadd">Quick Add</button>
                    </div>
                    <img src="/src/assets/addgame/RacefortheGalaxy.png">
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

export default {
    name: "Home",
    data(){
        return{
            userName: 'Josh',
            showGrid: false,
            showList: true,
            recentGamesIndex: 1,
            recentGames: [],
            showingGames: [],
            suggestedNames: [],
            userStats: Object,
        }
    },
    components: {
        RecentGame,
        RecentGameCard
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
        async fetchGames(user) {
            console.log('index', this.recentGamesIndex)
            axios.get(`http://127.0.0.1:8000/homepagegames/${user}/${this.recentGamesIndex}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log(response.data)
                this.recentGames = [...this.recentGames, ...response.data];
                this.recentGamesIndex = this.recentGamesIndex + 1;
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
        // async fetchCards(cardType) {
        //     let res = await fetch(`http://127.0.0.1:5000/type?cardType=${cardType}`);
        //     let cards = await res.json();
        //     return cards;
        // }
    },
    computed: {
        headerWidth() {
        return {
            width: this.showList == true ? '500px' : '595px'
            }
        },
        headerMargin() {
        return {
            marginRight: this.showList == true ? '0px' : '10px'
            }
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
        this.fetchGames('josh');
        this.fetchUserStats('josh');
        this.fetchUsersPlayedWith('josh');
        console.log(userState.userID)
        console.log(userState.username)
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
</style>