<template>
    <div style="width: 350px; display: flex; flex-direction: column; align-items: center; overflow-x: hidden; background-color: #333333; padding-bottom: 20px; border-radius: 5px; margin-top: 15px;">
        <h2>Check Head to Head Stats</h2>
        <div style="display: flex; flex-direction: column; margin-bottom: 8px;">
                <label style="color: white; margin-left: 3px;" for="gamename">Game Name</label>
                <Select v-model="gameName" :options="twoPlayerGames" placeholder="Select a Game"
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
    <div v-if="headtoheadGames.length > 0" style="width: 350px; background-color: #333333; border-radius: 5px; display: flex; flex-direction: column; align-items: center; margin-top: 10px; padding-bottom: 20px">
        <p>Player's {{ gameName}} Statistics</p>
        <div style="display: flex; flex-direction: row; width: 80%; justify-content: space-between;">
            <div style="display: flex; flex-direction: column; align-items: center;">
                <p>{{ playerOneName }}</p>
                <p>{{ playerOneWins }}</p>
                <p>{{ playerOneScore }}</p>
                <p>{{ playerOneScore + playerTwoScore === 0 ? '0.00'
                    : (playerOneScore / (playerOneWins + playerTwoWins)).toFixed(0)}}
                </p>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; ">
                <p>Player</p>
                <p>Wins</p>
                <p>Points</p>
                <p>Average Points</p>

            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
                <p>{{ playerTwoName }}</p>
                <p>{{ playerTwoWins }}</p>
                <p>{{ playerTwoScore }}</p>
                <p>{{ playerTwoScore + playerTwoScore === 0 ? '0.00'
                    : (playerTwoScore / (playerOneWins + playerTwoWins)).toFixed(0)}}
                </p>
            </div>
        </div>
    </div>
    <div v-if="headtoheadGames.length > 0" style="background-color: #333333; border-radius: 5px; display: flex; flex-direction: column; align-items: center; margin-top: 10px; padding-bottom: 20px">
        <p>In Wins</p>

        <div style="display: flex; flex-direction: row; justify-content: space-between; width: 80%;">
            <div style="display: flex; flex-direction: column; align-items: center;">
                <p>{{ playerOneStats.averageScore.toFixed(2) }}</p>
                <p>{{ playerOneStats.highestScore }}</p>
                <p>{{ playerOneStats.lowestScore }}</p>
                <p>{{ playerOneStats.averageDifference.toFixed(2) }}</p>
                <p>{{ playerOneStats.highestDifference }}</p>
                <p>{{ playerOneStats.lowestDifference }}</p>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
                <p>Average Score</p>
                <p>Highest Score</p>
                <p>Lowest Score</p>
                <p>Average Difference</p>
                <p>Highest Difference</p>
                <p>Lowest Difference</p>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
                <p>{{ playerTwoStats.averageScore.toFixed(2) }}</p>
                <p>{{ playerTwoStats.highestScore }}</p>
                <p>{{ playerTwoStats.lowestScore }}</p>
                <p>{{ playerTwoStats.averageDifference.toFixed(2) }}</p>
                <p>{{ playerTwoStats.highestDifference }}</p>
                <p>{{ playerTwoStats.lowestDifference }}</p>
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
            playerOneName: 'josh',
            playerTwoName: 'john',
            gameName: 'Dominion',
            playerOneWins: 0,
            playerTwoWins: 0,
            playerOneScore: 0,
            playerTwoScore: 0,
            playerOneWinScores: [],
            playerOneWinDiffs: [],
            playerTwoWinScores: [],
            playerTwoWinDiffs: [],
            filteredNamesPlayerOne: [],
            filteredNamesPlayerTwo: [],
            playerOneStats: {},
            playerTwoStats: {},
            twoPlayerGames: ['Dominion', 'Clank', 'Moonrakers', 'Heat', 'Race for the Galaxy', 'Lords of Waterdeep', 'Space Base', '7 Wonders', 'Root', 'Dune Imperium'],
            headtoheadGames: []
        }
    },
    components: {
        RecentGame
    },
    methods: {
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
            console.log(this.suggestedNames)
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
        async fetchGeneralHeadtoHeadStats(userone, usertwo) {
            axios.get(`${import.meta.env.VITE_API_URL}/getanygameheadtohead/${userone}/${usertwo}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log(response.data)
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
                this.headtoheadGames = response.data;
                this.playerOneScore = 0;
                this.playerTwoScore = 0;
                this.playerOneWins = 0;
                this.playerTwoWins = 0;

                // For stats:
                this.playerOneWinScores = [];
                this.playerOneWinDiffs = [];
                this.playerTwoWinScores = [];
                this.playerTwoWinDiffs = [];

                // Your loop
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

                // After the loop, calculate stats:
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

                console.log("Player One Win Stats:", this.playerOneStats);

                this.playerTwoStats = {
                    averageScore: average(this.playerTwoWinScores),
                    highestScore: Math.max(...this.playerTwoWinScores),
                    lowestScore: Math.min(...this.playerTwoWinScores),
                    averageDifference: average(this.playerTwoWinDiffs),
                    highestDifference: Math.max(...this.playerTwoWinDiffs),
                    lowestDifference: Math.min(...this.playerTwoWinDiffs),
                };

                console.log("Player Two Win Stats:", this.playerTwoStats);


                console.log(this.playerOneName, 'has won', this.playerOneWins, 'games with a total score of', this.playerOneScore)
                console.log(this.playerTwoName, 'has won', this.playerTwoWins, 'games with a total score of', this.playerTwoScore)
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
        isMobile() {
            return window.innerWidth < 410;
        }
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
</style>