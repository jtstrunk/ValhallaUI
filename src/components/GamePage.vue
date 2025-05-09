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
            <p style="margin-left: 8px; margin-bottom: 0px; font-family: 'Manolo Mono', sans-serif !important;">Your Stats</p>
            <div id="gameInformation">
                <div class="stat">
                    <p>{{ userPlays }}</p>
                    <p>Plays</p>
                </div>
                <div class="stat">
                    <p>{{ userWins }}</p>
                    <p>Wins</p>
                </div>
                <div class="stat">
                    <p>{{ (userWinPercent * 100).toFixed(2) }}%</p>
                    <p>Win Rate</p>
                </div>
            </div>
        </div>
        <div class="section" id="gamesHeader" >
            <div id="winPercentHeader">
                <p style="margin-left: 8px; font-size: 18px;">Highest Win Percent</p>
                <p style="margin: 0 8px;"> - </p>
                <p id="highestWinPercentName">{{ this.highestWinPercent.name }}</p>
            </div>
            <div style="display: flex; flex-direction: row; justify-content: space-around;">
                <div class="stat">
                    <p>{{ this.highestWinPercent.plays }}</p>
                    <p>Plays</p>
                </div>
                <div class="stat">
                    <p>{{ this.highestWinPercent.wins }}</p>
                    <p>Wins</p>
                </div>
                <div class="stat">
                    <p>{{ this.highestWinPercent.percent }}%</p>
                    <p>Win Rate</p>
                </div>
            </div>

            <div style="display: flex; flex-direction: row; justify-content: space-around; margin-top: 10px;">
                <div class="stat">
                    <p>Most Games Played</p>
                    <span>{{ mostPlayedName }} - {{ mostPlayedGames }}</span><span></span>
                </div>
                <div class="stat">
                    <p>Most Games Won</p>
                    <span>{{ mostWonName }} - {{ mostWonGames }}</span><span></span>
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
            gameName: this.$route.params.gamename,
            gameData: null,
            userName: userState.username,
            userID: userState.userID,
            userPlays: null,
            userWins: null,
            userWinPercent: null,
            isVisitor: false,
            gameContext: null,
            gameContextTwo: null,
            highestWinPercent: {
                name: null,
                plays: null,
                wins: null,
                percent: null
            },
            mostPlayedName: null,
            mostPlayedGames: null,
            mostWonName: null,
            mostWonGames: null
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
                this.userPlays = this.gameData.userinformation[0].plays;
                this.userWins = this.gameData.userinformation[0].wins;
                this.userWinPercent = this.userWins / this.userPlays;

                if(this.gameData.gameplaycount > 5) {
                    let miniumCountGames = this.gameData.winpercent
                        .filter(obj => obj.total_games > 2);
                    this.highestWinPercent.name = miniumCountGames[0].name
                    this.highestWinPercent.plays = miniumCountGames[0].total_games
                    this.highestWinPercent.wins = miniumCountGames[0].win_count
                    this.highestWinPercent.percent = miniumCountGames[0].win_percent.toFixed(2)
                } else {
                    this.highestWinPercent.name = this.gameData.winpercent[0].name
                    this.highestWinPercent.plays = this.gameData.winpercent[0].total_games
                    this.highestWinPercent.wins = this.gameData.winpercent[0].win_count
                    this.highestWinPercent.percent = this.gameData.winpercent[0].win_percent.toFixed(2)
                }

                this.mostWonName = this.gameData.wincounts[0].name
                this.mostWonGames = this.gameData.wincounts[0].win_count
                this.mostPlayedName = this.gameData.playcounts[0].name
                this.mostPlayedGames = this.gameData.playcounts[0].win_count
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

#gameInformation {
    display: flex;
    flex-direction: row;
    width: 480px;
    justify-content: space-around;
}

#gamesHeader {
    width: 500px;
}
#gameContext {
    font-size: larger;
}
.stat {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.stat p {
    font-size: larger;
    font-family: 'Manolo Mono', sans-serif !important;
    margin: 4px 0;
}
.stat span {
    color: white;
    font-size: 20px;
    font-family: 'Manolo Mono', sans-serif !important;
    margin: 4px 0;
}

#winPercentHeader {
    display: flex;
    flex-direction: row;
    align-items: center;
}
#winPercentHeader p { 
    margin-top: 0px;
    margin-bottom: 0px;
}
#highestWinPercentName {
    font-size: 20px;
}

@media (max-width: 	420px) {
    .MobileHide {
        display: none !important;
    }

    .section{
        padding: 5px;
    }

    #profileHeader {
        display: flex;
        flex-direction: row;
        width: 380px;
    }
    #gameInformation {
        width: 380px;
    }
    #gamesHeader {
        width: 400px;
    }
    #gameContext {
        font-size: 16px;
    }
    #winPercentHeader {
        margin-top: 5px;
    }
    #highestWinPercentName {
        font-size: 18px;
    }


    .stat p {
        font-size: 18;
    }
    .stat span {
        font-size: 18px;
    }
}
</style>