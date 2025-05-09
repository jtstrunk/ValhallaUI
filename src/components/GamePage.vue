<template>
    <div style="display: flex; flex-direction: column; align-items: center; overflow-x: hidden;">
        <div class="section">
            <div id="profileHeader">
                <img class="gamePicture" :src="gameImage">
                <div>
                    <h2 class="font" style="width: 245px; margin-top: 10px; margin-bottom: 10px;">{{ gameName }}</h2>
                    <h3 class="font" style="margin-top: 10px; margin-bottom: 8px;">{{ this.gamePlayerCounts[gameName] }}</h3>
                    <p id="gameContext">{{ gameContext }}</p>
                </div>
            </div>
            <p style="margin-bottom: 0px;">Your Stats</p>
            <div style="display: flex; flex-direction: row; width: 480px; justify-content: space-around;">
                <div>
                    <p>{{ userPlays }}</p>
                    <p>Plays</p>
                </div>
                <div>
                    <p>{{ userWins }}</p>
                    <p>Wins</p>
                </div>
                <div>
                    <p>{{ (userWinPercent * 100).toFixed(2) }}%</p>
                    <p>Win Rate</p>
                </div>
            </div>
        </div>
       
        <!-- <div class="section" id="gamesHeader" >
            <p>Most Won</p>
        </div> -->
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
            gameName: this.$route.params.gamename,
            gameData: null,
            userName: userState.username,
            userID: userState.userID,
            userPlays: null,
            userWins: null,
            userWinPercent: null,
            isVisitor: false,
            gameContext: null,
            gameContextTwo: null
        }
    },
    components: {

    },
    methods: {
        async fetchGameInformation(user, game) {
            axios.get(`${import.meta.env.VITE_API_URL}/getgameinformation/${user}/${game}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log(response.data)
                this.gameData = response.data;
                this.gameContext = `Played ${this.gameData.gameplaycount} times by ${this.gameData.playercount} unique players`;
                // this.gameContextTwo = `You've played ${this.gameData.userinformation[0].plays} times and have won ${this.gameData.userinformation[0].wins} times`;
                this.userPlays = this.gameData.userinformation[0].plays;
                this.userWins = this.gameData.userinformation[0].wins;
                this.userWinPercent = this.userWins / this.userPlays;
                console.log(this.gameContext)
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
    },
    computed: {
        gameImage() {
            const cleanedGameName = this.gameName.replace(/\s+/g, '');
            return new URL(`../assets/addgame/${cleanedGameName}.webp`, import.meta.url).href;
        },
    },
    created() {
        let searchName = this.userName;
        if (searchName == 'Guest') {
            searchName = 'josh'
            this.isVisitor = true;
        }
        console.log(searchName)
        this.fetchGameInformation(searchName, this.gameName);
        this.gamePlayerCounts = {
            'Dominion': '2 - 4 Players', 'Moonrakers': '1 - 5 Players', 'Clank': '2 - 4 Players', 'Lords of Waterdeep': '2 - 6 Players', 
            'Race for the Galaxy': '2 - 4 Players', 'Heat': '1 - 6 Players', 'Space Base': '2 - 5 Players', 'Root' : '2 - 4 Players', 'Puerto Rico' : '3 - 5 Players',
            'Cosmic Encounter': '3 - 5 Players', 'Catan': '2 - 4 Players', 'Munchkin': '3 - 6 Players',  'Dune Imperium': '1 - 4 Players'
        }
    }
}
</script>

<style scoped>
.font {
    font-family: 'Manolo Mono', sans-serif !important;
    color: white;
}

#profileHeader {
    display: flex;
    flex-direction: row;
    width: 480px;
}
.gamePicture {
    width: 130px; 
    height: 130px;
    margin-right: 15px;
    border-radius: 5px;
}

#gamesHeader {
    width: 480px;
}
#gameContext {
    font-size: larger;
}

@media (max-width: 	420px) {
    .MobileHide {
        display: none !important;
    }

    .section{
        padding: 5px;
    }
}
</style>