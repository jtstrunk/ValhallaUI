<template>
    <div style="display: flex; flex-direction: column; align-items: center; overflow-x: hidden;">
        <div v-if="!showCounters" class="section" style="width: 400px; display: flex; flex-direction: column; align-items: center;">
            <h2>7 Wonders Duel Counter</h2>
            <div>
                <div style="display: flex; flex-direction: row;">
                    <div style="padding: 8px; display: flex; flex-direction: column;">
                        <label for="playerOneName">First Name</label>
                        <AutoComplete v-model="playerOneName" :suggestions="filteredNames" optionLabel="name" ref="autoCompleteOne"
                            @complete="searchName" @item-select="updateName($event, 'fifth')" id="playerOneName" @focus="showSuggestionsOne"
                            class="custom-autocomplete" optionValue="name" @change="inputName($event, 'one')" @keydown="handleKeyDown($event, 'one')"
                            :pt="{
                                root: {
                                    class: 'customAutocomplete',
                                },
                                option:
                                {
                                    style: { color: 'white', padding: '4px 8px'}
                                },
                                overlay: {
                                    style: { backgroundColor: '#404040', transform: 'translateY(8px) translateX(-6px)',
                                    borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'}
                                },
                                pcInputText: {
                                    style: { '::placeholder': { color: '#2e6da4' } }
                                }
                            }"></AutoComplete>
                    </div>
                    <div style="padding: 8px; display: flex; flex-direction: column;">
                        <label for="playerTwoName">Second Name</label>
                        <AutoComplete v-model="playerTwoName" :suggestions="filteredNames" optionLabel="name" ref="autoCompleteTwo"
                            @complete="searchName" @item-select="updateName($event, 'fifth')" id="playerTwoName" @focus="showSuggestionsTwo"
                            class="custom-autocomplete" optionValue="name" @change="inputName($event, 'two')" @keydown="handleKeyDown($event, 'two')"
                            :pt="{
                                root: {
                                    class: 'customAutocomplete',
                                },
                                option:
                                {
                                    style: { color: 'white', padding: '4px 8px'}
                                },
                                overlay: {
                                    style: { backgroundColor: '#404040', transform: 'translateY(8px) translateX(-6px)',
                                    borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'}
                                },
                                pcInputText: {
                                    style: { '::placeholder': { color: '#2e6da4' } }
                                }
                            }"></AutoComplete>
                    </div>
                </div>
            </div>
            <button class="btn-outline" @click="startGame" style="margin-top: 8px;">Start Game</button>
        </div>
        <div v-if="showCounters" id="counterList" style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center;">
            <div class="playerScore">
                <p :style="{ fontSize: fixedPlayerOneName.length > 8 ? '23px' : '30px' }">{{ fixedPlayerOneName }} - {{ playerOneScore }}</p>
            </div>
            <div class="playerScore">
                <p :style="{ fontSize: fixedPlayerTwoName.length > 8 ? '23px' : '30px' }">{{ fixedPlayerTwoName }} - {{ playerTwoScore }}</p>
            </div>
            <div v-if="playerCount > 2" class="playerScore">
                <p :style="{ fontSize: fixedPlayerThreeName.length > 8 ? '23px' : '30px' }">{{ fixedPlayerThreeName }} - {{ playerThreeScore }}</p>
            </div>
            <div v-if="playerCount > 3" class="playerScore">
                <p :style="{ fontSize: fixedPlayerFourName.length > 8 ? '23px' : '30px' }">{{ fixedPlayerFourName }} - {{ playerFourScore }}</p>
            </div>
        </div>
        <button v-if="showCounters" class="btn-outline" style="width: 160px; margin-top: 10px; margin-bottom: 10px;" @click="endGame">Submit Current Scores</button>
        <div id="counterContainer">
            <ScoreCounter7Wonders v-if="showCounters" :playerName="playerOneName" :playerNumber="1" @updateScore="updatePlayerScore"></ScoreCounter7Wonders>
            <ScoreCounter7Wonders v-if="showCounters" :playerName="playerTwoName" :playerNumber="2" @updateScore="updatePlayerScore"></ScoreCounter7Wonders>
        </div>
        <div id="overlay" v-if="this.showPopup" @click="this.showPopup=!this.showPopup"></div>
        <InsertRecordPopup :insertPopup="showPopup" :gameInformationObject="insertObject" :gameName="'7 Wonders Duel'"
            :insertingPlayerCount="playerCount" @gameInserted="resetGameState" ></InsertRecordPopup>
    </div>
</template>

<script>
import axios from "axios"
import { userState } from '/src/state/userState'
import ScoreCounter7Wonders from './ScoreCounter7Wonders.vue'
import InsertRecordPopup from './InsertRecordPopup.vue'
export default {
    inheritAttrs: false,
    name: "Home",
    props: {

    },
    data(){
        return{
            userName: userState.username,
            showPopup: false,
            showCounters: false,
            suggestedNames: [],
            filteredNames: [],
            playerCount: 2,
            playerOneName: userState.username || null,
            playerOneScore: 0,
            playerTwoName: null,
            playerTwoScore: 0,
            regularArray: [],
            insertObject: {
                winnername: null,
                winnerscore: null,
                secondname: null,
                secondscore: null,
                thirdname: null,
                thirdscore: null,
                fourthname: null,
                fourthscore: null,
                fifthname: null,
                fifthscore: null,
                sixthname: null,
                sixthscore: null,
                seventhname: null,
                seventhscore: null
            }
        }
    },
    components: {
        ScoreCounter7Wonders,
        InsertRecordPopup
    },
    methods: {
        updatePlayerScore(score, playerNumber) {           
            switch(playerNumber) {
                case 1:
                    this.playerOneScore = score;
                    break;
                case 2:
                    this.playerTwoScore = score;
                    break;
                default:
                    console.warn('Invalid player number:', playerNumber);
            }
        },
        showSuggestionsOne() {
            this.$refs.autoCompleteOne.search(null, '');
        },
        showSuggestionsTwo() {
            this.$refs.autoCompleteTwo.search(null, '');
        },
        searchName(event) {
            this.filteredNames = this.suggestedNames.filter(x => x.name.toLowerCase().includes(event.query.toLowerCase()));
        },
        updateName(selectedName, placement) {
            const name = typeof selectedName.value === 'object' ? selectedName.value.name : selectedName.value;
            this.positionMapping[placement] = name;
            this[placement + 'Name'] = name;
        },
        inputName(input, placement) {
            this.positionMapping[placement] = input.value;
            this[placement + 'Name'] = input.value;
        },
        handleKeyDown(event, placement) {
            if (event.key === ' ' && !this.overlayVisible) {
                event.preventDefault();
                const input = event.target;
                const newValue = input.value + ' ';
                this.positionMapping[placement] = newValue;
                this[placement + 'Name'] = newValue;
                this.$nextTick(() => {
                    input.setSelectionRange(newValue.length, newValue.length);
                });
            }
        },
        startGame() {
            this.showCounters = true;
        },
        endGame() {
            let players = [
                { name: this.getPlayerName(this.playerOneName), score: this.playerOneScore },
                { name: this.getPlayerName(this.playerTwoName), score: this.playerTwoScore }
            ];
            if (this.playerCount > 2) {
                players.push({ name: this.getPlayerName(this.playerThreeName), score: this.playerThreeScore });
            }
            if (this.playerCount > 3) {
                players.push({ name: this.getPlayerName(this.playerFourName), score: this.playerFourScore });
            }
            if (this.playerCount > 4) {
                players.push({ name: this.getPlayerName(this.playerFiveName), score: this.playerFiveScore });
            }

            players.sort((a, b) => b.score - a.score);
            this.insertObject = {
                winnername: players[0].name,
                winnerscore: players[0].score,
                secondname: players[1].name,
                secondscore: players[1].score,
                thirdname: players[2]?.name || null,
                thirdscore: players[2]?.score || null,
                fourthname: players[3]?.name || null,
                fourthscore: players[3]?.score || null,
                fifthname: players[4]?.name || null,
                fifthscore: players[4]?.score || null,
                sixthname: players[5]?.name || null,
                sixthscore: players[5]?.score || null,
                seventhname: players[6]?.name || null,
                seventhscore: players[6]?.score || null
            };

            this.showPopup = true;
        },
        getPlayerName(player) {
            return typeof player === 'string' ? player : player.name || '';
        },
        resetGameState(){
            this.showPopup = false;
            this.showCounters = false;
            this.playerOneName = null;
            this.playerOneScore = 0;
            this.playerTwoName = null;
            this.playerTwoScore = 0;
            this.playerCount = 2;
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
    },
    computed: {
        fixedPlayerOneName() {
            const name = typeof this.playerOneName === 'string' ? this.playerOneName : this.playerOneName.name || '';
            return name.length > 11 ? name.slice(0, 11) : name;
        },
        fixedPlayerTwoName() {
            const name = typeof this.playerTwoName === 'string' ? this.playerTwoName : this.playerTwoName.name || '';
            return name.length > 11 ? name.slice(0, 11) : name;
        }
    },
    created() {
        this.fetchUsersPlayedWith(this.userName);
        this.positionMapping = {
            'one': this.playerOneName, 'two': this.playerTwoName
        }      
    }
}
</script>

<style scoped>
#overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Adjust the alpha value for transparency */
    backdrop-filter: blur(3px); /* Apply the blur effect to the overlay */
    z-index: 1000; /* Ensure the overlay is behind the popup */
}

h2 {
    margin: 0px;
}
h3{
    color: #fff;
    font-family: 'Manolo Mono', sans-serif !important;
}

.btn-dark {
    width: 100px;
    color: #fff !important;
    background-color: #404040;
    border: 2px solid #404040;
    outline: none;
    padding: 4px 7px;
    border-radius: 5px;
    width: 100px;
}
.btn-dark:hover {
    cursor: pointer;
}
.btn {
    width: 100px;
    color: #fff !important;
    background-color: #17a2b8;
    border: 2px solid #17a2b8;
    outline: none;
    padding: 4px 7px;
    border-radius: 5px;
    width: 100px;
}
.btn:hover {
    cursor: pointer;
}
.btn-outline {
    width: 100px;
    color: #17a2b8 !important;
    background: transparent;
    border: 2px solid #17a2b8;
    outline: none;
    padding: 4px 7px;
    border-radius: 5px;
}
.btn-outline:hover {
    cursor: pointer;
}

label {
    color: white;
    margin-bottom: 8px;
}
.customAutocomplete {
    background-color: #404040;
    border: 1px solid #404040;
    color: white;
    padding: 6px;
    border-radius: 5px;
    width: 175px;
}

#counterContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    width: 50%;
}

.playerScore {
    width: 180px;
    background-color: #242526;
    margin: 8px 4px 0px 4px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
}
.playerScore p {
    margin: 0px;
    padding: 6px 10px;
    /* font-size: 23px; */
}
@media (max-width: 	420px) {
    /* .section {
        margin-top: 45px;
    } */

    #counterContainer {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }
    #counterList {
        margin-top: 45px;
    }
}

/* .counter{
    display: flex;
    flex-direction: column;
}
.counter span {
    color: #fff;
    font-size: 26px;
}
.counter p {
    margin: 0px;
}
.type {
    margin: 10px;
}
.cardCounter {
    display: flex;
    flex-direction: row;
}
.cardCounter p {
    margin: 0px;
}
.score {
    padding: 0px 4px;
    width: 30px;
    text-align: center;
    font-size: 20px;
    margin-top: 5px !important;
}
.subtracting {
    font-size: 24px;
}
.adding {
    font-size: 24px;
} */
</style>