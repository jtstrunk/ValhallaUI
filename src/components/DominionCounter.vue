<template>
    <div v-if="!showCounters" class="section" style="width: 400px; display: flex; flex-direction: column; align-items: center;">
        <h2>Dominion Counter</h2>
        <h3>Select a Player Count</h3>
        <div style="width: 350px; display: flex; flex-direction: row; justify-content: space-around;">
            <button @click="this.playerCount = 2"  :class="{ 'btn': playerCount === 2, 'btn-outline': playerCount !== 2 }">Two</button>
            <button @click="this.playerCount = 3"  :class="{ 'btn': playerCount === 3, 'btn-outline': playerCount !== 3 }">Three</button>
            <button @click="this.playerCount = 4"  :class="{ 'btn': playerCount === 4, 'btn-outline': playerCount !== 4 }">Four</button>
        </div>
        <div>
            <div style="display: flex; flex-direction: row;">
                <div style="padding: 8px; display: flex; flex-direction: column;">
                    <label for="playerOneName">First Name</label>
                    <AutoComplete v-model="playerOneName" :suggestions="filteredNames" optionLabel="name"
                        @complete="searchName" @item-select="updateName($event, 'fifth')" id="playerOneName"
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
                                style: { backgroundColor: '#404040', transform: 'translateY(8px)',
                                borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'}
                            },
                            pcInputText: {
                                style: { '::placeholder': { color: '#2e6da4' } }
                            }
                        }"></AutoComplete>
                </div>
                <div style="padding: 8px; display: flex; flex-direction: column;">
                    <label for="playerTwoName">Second Name</label>
                    <AutoComplete v-model="playerTwoName" :suggestions="filteredNames" optionLabel="name"
                        @complete="searchName" @item-select="updateName($event, 'fifth')" id="playerTwoName"
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
                                style: { backgroundColor: '#404040', transform: 'translateY(8px)',
                                borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'}
                            },
                            pcInputText: {
                                style: { '::placeholder': { color: '#2e6da4' } }
                            }
                        }"></AutoComplete>
                </div>
            </div>
            <div v-if="playerCount > 2" style="display: flex; flex-direction: row;">
                <div style="padding: 8px; display: flex; flex-direction: column;">
                    <label for="playerThreeName">Third Name</label>
                    <AutoComplete v-model="playerThreeName" :suggestions="filteredNames" optionLabel="name"
                        @complete="searchName" @item-select="updateName($event, 'fifth')" id="playerThreeName"
                        class="custom-autocomplete" optionValue="name" @change="inputName($event, 'three')" @keydown="handleKeyDown($event, 'three')"
                        :pt="{
                            root: {
                                class: 'customAutocomplete',
                            },
                            option:
                            {
                                style: { color: 'white', padding: '4px 8px'}
                            },
                            overlay: {
                                style: { backgroundColor: '#404040', transform: 'translateY(8px)',
                                borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'}
                            },
                            pcInputText: {
                                style: { '::placeholder': { color: '#2e6da4' } }
                            }
                        }"></AutoComplete>
                </div>
                <div v-if="playerCount > 3" style="padding: 8px; display: flex; flex-direction: column;">
                    <label for="playerFourName">Fourth Name</label>
                    <AutoComplete v-model="playerFourName" :suggestions="filteredNames" optionLabel="name"
                        @complete="searchName" @item-select="updateName($event, 'fifth')" id="playerFourName"
                        class="custom-autocomplete" optionValue="name" @change="inputName($event, 'four')" @keydown="handleKeyDown($event, 'four')"
                        :pt="{
                            root: {
                                class: 'customAutocomplete',
                            },
                            option:
                            {
                                style: { color: 'white', padding: '4px 8px'}
                            },
                            overlay: {
                                style: { backgroundColor: '#404040', transform: 'translateY(8px)',
                                borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'}
                            },
                            pcInputText: {
                                style: { '::placeholder': { color: '#2e6da4' } }
                            }
                        }"></AutoComplete>
                </div>
            </div>
        </div>
        <h3>Select altername VP cards present</h3>
            <div style="width: 380px; display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center;">
                <button :class="{'btn': selectedAltVPCards.includes(button), 'btn-dark': !selectedAltVPCards.includes(button)}"
                    v-for="button in altVPCards" @click="addCard(button)" style="margin: 4px;">{{ button }}</button>
            </div>

        <button class="btn-outline" @click="startGame">Start Game</button>
    </div>
    <div v-if="showCounters" style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center;">
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
    <ScoreCounter v-if="showCounters" :playerName="playerOneName" :playerNumber="1" :selectedAltVPCards="regularArray"></ScoreCounter>
    <ScoreCounter v-if="showCounters" :playerName="playerTwoName" :playerNumber="2" :selectedAltVPCards="regularArray"></ScoreCounter>
    <ScoreCounter v-if="showCounters && playerCount > 2" :playerName="playerThreeName" :playerNumber="3" :selectedAltVPCards="regularArray"></ScoreCounter>
    <ScoreCounter v-if="showCounters && playerCount > 3" :playerName="playerFourName" :playerNumber="4" :selectedAltVPCards="regularArray"></ScoreCounter>
</template>

<script>
import axios from "axios"
import { userState } from '/src/state/userState'
import ScoreCounter from './ScoreCounter.vue'

export default {
    name: "Home",
    props: {

    },
    data(){
        return{
            userName: userState.username,
            isDark: true,
            showCounters: false,
            suggestedNames: [],
            filteredNames: [],
            playerCount: 2,
            playerOneName: null,
            playerOneScore: 3,
            playerTwoName: null,
            playerTwoScore: 3,
            playerThreeName: null,
            playerThreeScore: 3,
            playerFourName: null,
            playerFourScore: 3,
            altVPCards: ['Colony', 'Tokens', 'Gardens', 'Duke', 'Farm', 'Mill', 'Nobles', 'Island'],
            selectedAltVPCards: [],
            regularArray: []
        }
    },
    components: {
        ScoreCounter
    },
    methods: {
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
        addCard(cardName){
            console.log(cardName);
            if(this.selectedAltVPCards.includes(cardName)) {
                this.selectedAltVPCards = this.selectedAltVPCards.filter(card => card !== cardName);
            } else {
                this.selectedAltVPCards.push(cardName);
            }
        },
        startGame(){
            console.log('starting game with player count of', this.playerCount);
            console.log(this.selectedAltVPCards)
            this.regularArray = [...this.selectedAltVPCards];
            console.log(this.regularArray)
            this.showCounters = true;
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
        fixedPlayerOneName() {
            const name = typeof this.playerOneName === 'string' ? this.playerOneName : this.playerOneName.name || '';
            return name.length > 12 ? name.slice(0, 12) : name;
        },
        fixedPlayerTwoName() {
            const name = typeof this.playerTwoName === 'string' ? this.playerTwoName : this.playerTwoName.name || '';
            return name.length > 12 ? name.slice(0, 12) : name;
        },
        fixedPlayerThreeName() {
            const name = typeof this.playerThreeName === 'string' ? this.playerThreeName : this.playerThreeName.name || '';
            return name.length > 12 ? name.slice(0, 12) : name;
        },
        fixedPlayerFourName() {
            const name = typeof this.playerFourName === 'string' ? this.playerFourName : this.playerFourName.name || '';
            return name.length > 12 ? name.slice(0, 12) : name;
        }

    },
    created() {
        this.fetchUsersPlayedWith(this.userName);
        this.positionMapping = {
            'one': this.playerOneName, 'two': this.playerTwoName, 'three': this.playerThreeName, 'four': this.playerFourName
        }
    }
}
</script>

<style scoped>
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