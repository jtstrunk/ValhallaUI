<template>
    <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 350px; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow-x: hidden; background-color: #333333; padding-bottom: 20px; border-radius: 5px; margin-top: 15px;">
        <h2>Check Head to Head Stats</h2>
        <div style="display: flex; flex-direction: column; margin-bottom: 8px;">
                <label style="color: white; margin-left: 3px;" for="gamename">Game Name</label>
                <Select v-model="gameName" :options="twoPlayerGames" placeholder="Select a Game" @change="this.showStatistics = false"
                    style="background-color: #404040; width: 250px; padding: 7px 10px; color: white; border-radius: 5px; margin-bottom: 10px;"
                    :pt="{
                        overlay: { style: { backgroundColor: '#404040' } },
                        option: {style: { color: 'white', padding: '4px 8px' } } 
                    }" 
                />
            </div>
        <div style="display: flex; flex-direction: row;">    
            <div style="display: flex; flex-direction: column; margin-bottom: 8px;">
                <label style="color: white; margin-left: 12px;" for="playerOneName">First Player</label>
                <AutoComplete v-model="playerOneName" :suggestions="filteredNamesPlayerOne" optionLabel="name"
                    @complete="searchName($event, 'PlayerOne')" @item-select="updateName($event, 'playerOne')"
                    @change="inputName($event, 'playerOne')" @keydown="handleKeyDown($event, 'playerOne')"
                    :pt="{
                        root: {
                            class: 'customAutocomplete'
                        },
                        option: 
                        { 
                            style: { color: 'white', padding: '4px 8px'}
                        },
                        overlay: {
                            style: { backgroundColor: '#404040', transform: 'translateY(8px)', 
                            borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'}
                        }
                            
                    }"></AutoComplete>
            </div>
            <div style="display: flex; flex-direction: column; margin-bottom: 8px;">
                <label style="color: white; margin-left: 12px;" for="playerTwoName">Second Player</label>
                <AutoComplete v-model="playerTwoName" :suggestions="filteredNamesPlayerTwo" optionLabel="name"
                    @complete="searchName($event, 'PlayerTwo')" @item-select="updateName($event, 'playerTwo')"
                    @change="inputName($event, 'playerTwo')" @keydown="handleKeyDown($event, 'playerTwo')"
                    :pt="{
                        root: {
                            class: 'customAutocomplete'
                        },
                        option: 
                        { 
                            style: { color: 'white', padding: '4px 8px'}
                        },
                        overlay: {
                            style: { backgroundColor: '#404040', transform: 'translateY(8px)', 
                            borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'}
                        }
                            
                    }"></AutoComplete>
            </div>            
        </div>
        <div>
            <button class="btn-customlist" @click="fetchGeneralInformation()">Get General Stats</button>
            <button class="btn-customlist" @click="fetchSpecificInformation()">Get Specific Stats</button>
        </div>
    </div>
    <div v-if="showStatistics && headtoheadGames.length < 1" style="width: 350px; background-color: #333333; border-radius: 5px; display: flex; flex-direction: column; margin-top: 10px;">
        <h2 style="margin-left: 15px;">No Games Found</h2>
        <div class="centered-message">
            {{ noGamesMessage }}
        </div>
    </div>
    <div v-if="showSpecific && headtoheadGames.length > 0" style="width: 350px; background-color: #333333; border-radius: 5px; display: flex; flex-direction: column; align-items: center; margin-top: 10px; padding-bottom: 20px">
        <p style="margin-bottom: 6px;">Player's {{ gameName}} Statistics</p>
        <div style="display: flex; flex-direction: row; width: 80%; justify-content: space-between;">
            <div class="statInfo">
                <p>{{ playerOneName }}</p>
                <p>{{ playerOneWins }}</p>
                <p>{{ playerOneScore }}</p>
                <p>{{ playerOneScore + playerTwoScore === 0 ? '0.00'
                    : (playerOneScore / (playerOneWins + playerTwoWins)).toFixed(0)}}
                </p>
            </div>
            <div class="statInfo">
                <p>Player</p>
                <p>Wins</p>
                <p>Points</p>
                <p>Average Points</p>
            </div>
            <div class="statInfo">
                <p>{{ playerTwoName }}</p>
                <p>{{ playerTwoWins }}</p>
                <p>{{ playerTwoScore }}</p>
                <p>{{ playerTwoScore + playerTwoScore === 0 ? '0.00'
                    : (playerTwoScore / (playerOneWins + playerTwoWins)).toFixed(0)}}
                </p>
            </div>
        </div>
    </div>
    <div v-if="showSpecific && headtoheadGames.length > 0" style="width: 350px; background-color: #333333; border-radius: 5px; display: flex; flex-direction: column; align-items: center; margin-top: 10px; padding-bottom: 20px">
        <p style="margin-bottom: 6px;">In Wins</p>
        <div style="display: flex; flex-direction: row; justify-content: space-between; width: 80%;">
            <div class="statInfo">
                <p>{{ playerOneStats.averageScore.toFixed(2) }}</p>
                <p>{{ showZeroIfInvalid(playerOneStats.highestScore) }}</p>
                <p>{{ showZeroIfInvalid(playerOneStats.lowestScore) }}</p>
                <p>{{ playerOneStats.averageDifference.toFixed(2) }}</p>
                <p>{{ showZeroIfInvalid(playerOneStats.highestDifference) }}</p>
                <p>{{ showZeroIfInvalid(playerOneStats.lowestDifference) }}</p>
            </div>
            <div class="statInfo">
                <p>Average Score</p>
                <p>Highest Score</p>
                <p>Lowest Score</p>
                <p>Average Difference</p>
                <p>Highest Difference</p>
                <p>Lowest Difference</p>
            </div>
            <div class="statInfo">
                <p>{{ playerTwoStats.averageScore.toFixed(2) }}</p>
                <p>{{ showZeroIfInvalid(playerTwoStats.highestScore) }}</p>
                <p>{{ showZeroIfInvalid(playerTwoStats.lowestScore) }}</p>
                <p>{{ playerTwoStats.averageDifference.toFixed(2) }}</p>
                <p>{{ showZeroIfInvalid(playerTwoStats.highestDifference) }}</p>
                <p>{{ showZeroIfInvalid(playerTwoStats.lowestDifference) }}</p>
            </div>
        </div>
    </div>
    <div v-if="showGeneral && showStatistics && headtoheadGames.length > 0" style="width: 350px; background-color: #333333; border-radius: 5px; display: flex; flex-direction: column; align-items: center; margin-top: 10px; padding-bottom: 20px">
        <p style="margin-bottom: 6px;">Any Game Statistics</p>
        <div style="display: flex; flex-direction: row; justify-content: space-between; width: 80%;">
            <div class="statInfo">
                <p>{{ playerOneName }}</p>
                <p>{{ playerOneWins }}</p>
                <p>{{ playerOneMostWonGame }}</p>
            </div>
            <div class="statInfo">
                <p>Player</p>
                <p>Wins</p>
                <p>Most Won</p>
            </div>
            <div class="statInfo">
                <p>{{ playerTwoName }}</p>
                <p>{{ playerTwoWins }}</p>
                <p>{{ playerTwoMostWonGame }}</p>
            </div>
        </div>
    </div>
    <div v-if="showStatistics && headtoheadGames.length > 0 && !isMobile" style="background-color: #333333; border-radius: 5px; display: flex; flex-direction: column; align-items: center; margin-top: 15px; margin-bottom: 120px;">
        <button @click="this.showAdvGame=!this.showAdvGame" class="btn-customlist" :style="{ textAlign: 'center', width: '350px', margin: showAdvGame ? '10px 0 0 0' : '0px' }">Toggle Games</button>
        <div v-if="showStatistics && showAdvGame" style="width: 800px;">
            <div class="game-table" st>
                <div class="game-row game-header">
                    <span>GameID</span>
                    <span>GameName</span>
                    <span>Winner</span>
                    <span>Score</span>
                    <span>Second</span>
                    <span>Score</span>
                    <span>Difference</span>
                    <span>Date</span>
                </div>
                <div class="game-row" v-for="game in headtoheadGames" :key="game.gameid">
                    <span>{{ game.gameid }}</span>
                    <span>{{ game.gamename }}</span>
                    <span>{{ game.winnername }}</span>
                    <span>{{ game.winnerscore }}</span>
                    <span>{{ game.secondname }}</span>
                    <span>{{ game.secondscore }}</span>
                    <span>{{ game.difference }}</span>
                    <span>{{ game.date }}</span>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import axios from "axios"
import RecentGame from './RecentGame.vue'
import { userState } from "@/state/userState"

export default {
    name: "Profile",
    data(){
        return{
            logginUser: userState.username,
            logginUserID: userState.userID,
            playerOneName: userState.username,
            playerTwoName: null,
            gameName: null,
            showStatistics: false,
            showSpecific: false,
            showGeneral: false,
            showGameRows: false,
            showAdvGame: false,
            playerOneWins: 0,
            playerTwoWins: 0,
            playerOneScore: 0,
            playerTwoScore: 0,
            playerOneMostWonGame: '',
            playerTwoMostWonGame: '',
            playerOneWinScores: [],
            playerOneWinDiffs: [],
            playerTwoWinScores: [],
            playerTwoWinDiffs: [],
            filteredNamesPlayerOne: [],
            filteredNamesPlayerTwo: [],
            playerOneStats: {},
            playerTwoStats: {},
            twoPlayerGames: ['Dominion', 'Clank', 'Moonrakers', 'Heat', 'Race for the Galaxy', 'Lords of Waterdeep', 'Space Base', '7 Wonders', 'Root', 'Dune Imperium', 'Stratego'],
            headtoheadGames: []
        }
    },
    components: {
        RecentGame
    },
    methods: {
        showZeroIfInvalid(value) {
            if (value == null || value === Infinity || value === -Infinity || isNaN(value)) {
                return 0;
            }
            return value;
        },
        showpopup(term) {
            this.showingList = term;
            this.showDialog = true;
        },
        fetchGeneralInformation() {
            this.fetchGeneralHeadtoHeadStats(this.playerOneName, this.playerTwoName);
        },
        fetchSpecificInformation() {
            this.fetchSpecificHeadtoHeadStats(this.playerOneName, this.playerTwoName, this.gameName);
        },
        searchName(event, placement) {
            const query = (event && typeof event.query === 'string') ? event.query.toLowerCase() : '';
            this[`filteredNames${placement}`] = this.suggestedNames.filter(x => {
                const name = (x && typeof x.name === 'string') ? x.name.toLowerCase() : '';
                return name.includes(query);
            });
        },
        updateName(selectedName, placement) {
            const name = selectedName.value?.name || selectedName.value;
            this[`${placement}Name`] = name;
        },
        inputName(input, placement) {
            this.showStatistics = false;
            this.showSpecific = false;
            this.showGeneral = false;
            this[`${placement}Name`] = input.value;
        },
        handleKeyDown(event, placement) {
            if (event.key === ' ' && !this.overlayVisible) {
            event.preventDefault();
            const input = event.target;
            const newValue = input.value + ' ';
            this[`${placement}Name`] = newValue;
            this.$nextTick(() => {
                input.setSelectionRange(newValue.length, newValue.length);
            });
            }
        },
        reorderGames(method) {
            if(method === 'gameid') {
                this.headtoheadGames
            }
        },
        async fetchGeneralHeadtoHeadStats(userone, usertwo) {
            axios.get(`${import.meta.env.VITE_API_URL}/getanygameheadtohead/${userone}/${usertwo}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log(response.data)
                this.showSpecific = false;
                this.showGeneral = true;
                this.showStatistics = true;
                this.headtoheadGames = response.data;
                this.playerOneWins = 0;
                this.playerTwoWins = 0;
                const playerOneGameWins = {};
                const playerTwoGameWins = {};

                this.headtoheadGames.forEach(game => {
                    if (game.winnername === this.playerOneName) {
                        this.playerOneWins++;
                        playerOneGameWins[game.gamename] = (playerOneGameWins[game.gamename] || 0) + 1;
                    } else {
                        this.playerTwoWins++;
                        playerTwoGameWins[game.gamename] = (playerTwoGameWins[game.gamename] || 0) + 1;
                    }
                });

                function getMostWonGame(gameWinsObj) {
                    let max = 0;
                    let mostWonGame = null;
                    for (const [gamename, count] of Object.entries(gameWinsObj)) {
                        if (count > max) {
                            max = count;
                            mostWonGame = gamename;
                        }
                    }
                    return mostWonGame;
                }

                this.playerOneMostWonGame = getMostWonGame(playerOneGameWins);
                this.playerTwoMostWonGame = getMostWonGame(playerTwoGameWins);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
        async fetchSpecificHeadtoHeadStats(userone, usertwo, gamename) {
            axios.get(`${import.meta.env.VITE_API_URL}/getspecificgameheadtohead/${gamename}/${userone}/${usertwo}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log(response.data)
                this.showStatistics = true;
                this.showSpecific = true;
                this.showGeneral = false;
                this.headtoheadGames = response.data;
                this.playerOneScore = 0;
                this.playerTwoScore = 0;
                this.playerOneWins = 0;
                this.playerTwoWins = 0;
                this.playerOneWinScores = [];
                this.playerOneWinDiffs = [];
                this.playerTwoWinScores = [];
                this.playerTwoWinDiffs = [];

                this.headtoheadGames.forEach(game => {
                    if (game.winnername === this.playerOneName) {
                        this.playerOneScore += game.winnerscore;
                        this.playerOneWins++;
                        this.playerOneWinScores.push(game.winnerscore);
                        this.playerOneWinDiffs.push(game.difference);
                    } else {
                        this.playerOneScore += game.secondscore;
                    }

                    if (game.winnername === this.playerTwoName) {
                        this.playerTwoScore += game.winnerscore;
                        this.playerTwoWins++;
                        this.playerTwoWinScores.push(game.winnerscore);
                        this.playerTwoWinDiffs.push(game.difference);
                    } else {
                        this.playerTwoScore += game.secondscore;
                    }
                });
                function average(arr) {
                    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
                }

                this.playerOneStats = {
                    averageScore: average(this.playerOneWinScores),
                    highestScore: Math.max(...this.playerOneWinScores),
                    lowestScore: Math.min(...this.playerOneWinScores),
                    averageDifference: average(this.playerOneWinDiffs),
                    highestDifference: Math.max(...this.playerOneWinDiffs),
                    lowestDifference: Math.min(...this.playerOneWinDiffs),
                };
                this.playerTwoStats = {
                    averageScore: average(this.playerTwoWinScores),
                    highestScore: Math.max(...this.playerTwoWinScores),
                    lowestScore: Math.min(...this.playerTwoWinScores),
                    averageDifference: average(this.playerTwoWinDiffs),
                    highestDifference: Math.max(...this.playerTwoWinDiffs),
                    lowestDifference: Math.min(...this.playerTwoWinDiffs),
                };

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
                if (!this.suggestedNames.some(item => item.name === user)) {
                    this.suggestedNames.unshift({ name: user });
                }

                if (this.isVisitor == true) {
                    this.suggestedNames = [
                        { name: 'Player 1' }, { name: 'Player 2' }, { name: 'Player 3' }, { name: 'Player 4' }, { name: 'Player 5' }, { name: 'Player 6' }];
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        }
    },
    computed: {
        noGamesMessage() {
            let message = `No 1v1 games were found between ${this.playerOneName} and ${this.playerTwoName}`;
            if (this.showSpecific) {
                message += ` playing ${this.gameName}`;
            }
            return message;
        },
        isMobile() {
            return window.innerWidth < 420;
        },
    },
    created() {
        let searchName = this.logginUser;
        if(searchName == 'Guest') {
            this.isVisitor = true;
        }

        this.fetchUsersPlayedWith(searchName);
    }
}
</script>

<style scoped>
.customAutocomplete {
    background-color: #404040;
    border: 1px solid #404040;
    color: white;
    padding: 6px;
    border-radius: 5px;
    width: 140px;
    margin: 4px 6px;
}
.btn-customlist {
    width: 140px;
    height: 32px;
    color: #618B4A !important;
    background-color: #404040;
    border: 2px solid #618B4A;
    outline: none;
    padding: 4px 7px;
    border-radius: 5px;
    margin: 4px 6px;
}
.btn-customlist:hover {
    cursor: pointer;
}

.centered-message {
  font-family: 'Manolo Mono', sans-serif !important;
  margin: 15px auto;
  text-align: center;
  max-width: 500px;   /* Adjust as needed for your layout */
  word-break: break-word;
  color: white;
}

.statInfo {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.statInfo p {
    margin: 10px 0;
}

.game-table {
  width: fit-content;     /* Shrinks to fit the grid's contents */
  margin: 0 auto;         /* Centers the table horizontally */
  margin-top: 20px;       /* Optional: vertical spacing */
  padding-bottom: 15px;
}

.game-row {
  display: grid;
  grid-template-columns:
    80px      /* GameID: wider for full word */
    170px     /* GameName */
    90px      /* Winner */
    70px      /* Score: wider for header */
    90px      /* Second */
    70px      /* Score: wider for header */
    90px      /* Difference */
    110px;    /* Date */
  align-items: center;
  color: white;
}

.game-header {
  font-weight: bold;
  border-bottom: 2px solid #fff;
}

.game-row span {
  padding: 4px 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>