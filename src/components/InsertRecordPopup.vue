<template>
    <div id="popups" class="gamepopup" v-if="this.insertPopup"> 
        <div class="popupContainer">
            <p style="color: white; display: inline-block;">Update a {{ this.insertingGameName }} record</p>
            <div class="players">
                <div class="playerSection">
                    <label for="winnerName">Winner</label>
                    <AutoComplete v-model="winnerName" :suggestions="filteredNames"  optionLabel="name"
                        @complete="searchName" @item-select="updateName($event, 'winner')" id="winnerName"
                        class="custom-autocomplete" optionValue="name" @change="inputName($event, 'winner')"  @keydown="handleKeyDown($event, 'winner')"
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
                <div v-if="this.insertingGameName != 'Heat'" class="playerSection">
                    <label for="winnerScore">Score</label>
                    <Input v-model.number="winnerScore" id="winnerScore"></Input>
                </div>
            </div>
            <div class="players">
                <div class="playerSection">
                    <label for="secondName">Second</label>
                    <AutoComplete v-model="secondName" :suggestions="filteredNames" optionLabel="name"
                        @complete="searchName" @item-select="updateName($event, 'second')" id="secondName"
                        class="custom-autocomplete" optionValue="name" @change="inputName($event, 'second')"  @keydown="handleKeyDown($event, 'second')"
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
                <div v-if="this.insertingGameName != 'Heat'" class="playerSection">
                    <label for="secondScore">Score</label>
                    <Input v-model.number="secondScore" id="secondScore"></Input>
                </div>
            </div>
            <div v-if="this.calculatedPlayerCount > 2" class="players">
                <div class="playerSection">
                    <label for="thirdName">Third</label>
                    <AutoComplete v-model="thirdName" :suggestions="filteredNames" optionLabel="name"
                        @complete="searchName" @item-select="updateName($event, 'third')" id="thirdName"
                        class="custom-autocomplete" optionValue="name" @change="inputName($event, 'third')"  @keydown="handleKeyDown($event, 'third')"
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
                <div v-if="this.insertingGameName != 'Heat'" class="playerSection">
                    <label for="secondScore">Score</label>
                    <Input v-model.number="thirdScore" id="thirdScore"></Input>
                </div>
            </div>
            <div v-if="this.calculatedPlayerCount > 3" class="players">
                <div class="playerSection">
                    <label for="fourthName">Fourth</label>
                    <AutoComplete v-model="fourthName" :suggestions="filteredNames" optionLabel="name"
                        @complete="searchName" @item-select="updateName($event, 'fourth')" id="fourthName"
                        class="custom-autocomplete" optionValue="name" @change="inputName($event, 'fourth')" @keydown="handleKeyDown($event, 'fourth')"
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
                <div v-if="this.insertingGameName != 'Heat'" class="playerSection">
                    <label for="secondScore">Score</label>
                    <Input v-model.number="fourthScore" id="fourthScore"></Input>
                </div>
            </div>
            <div v-if="this.calculatedPlayerCount > 4" class="players">
                <div class="playerSection">
                    <label for="fifthName">Fifth</label>
                    <AutoComplete v-model="fifthName" :suggestions="filteredNames" optionLabel="name"
                        @complete="searchName" @item-select="updateName($event, 'fifth')" id="fifthName"
                        class="custom-autocomplete" optionValue="name" @change="inputName($event, 'fifth')" @keydown="handleKeyDown($event, 'fifth')"
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
                <div v-if="this.insertingGameName != 'Heat'" class="playerSection">
                    <label for="fifthScore">Score</label>
                    <Input v-model.number="fifthScore" id="fifthScore"></Input>
                </div>
            </div>
            <div v-if="this.insertingPlayerCount > 5" class="players">
                <div class="playerSection">
                    <label for="sixthName">Sixth</label>
                    <AutoComplete v-model="sixthName" :suggestions="filteredNames" optionLabel="name"
                        @complete="searchName" @item-select="updateName($event, 'sixth')" id="sixthName"
                        class="custom-autocomplete" optionValue="name" @change="inputName($event, 'sixth')" @keydown="handleKeyDown($event, 'sixth')"
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
                <div v-if="this.insertingGameName != 'Heat'" class="playerSection">
                    <label for="sixthScore">Score</label>
                    <Input v-model.number="sixthScore" id="sixthScore"></Input>
                </div>
            </div>
            <button class="btn-primary" @click="submitRecord" :disabled="isVisitor">Submit Record</button>
        </div>
    </div>
</template>


<script>
import axios from "axios"
import RecentGame from './RecentGame.vue'
import { userState } from "@/state/userState"

export default {
    inheritAttrs: false,
    name: "Add Record",
    props: {
        scrolledToBottom: {
            type: Boolean
        },
        gameName: {
            type: String,
            required: true
        },
        insertingPlayerCount : {
            type: Number,
            required: true
        },
        insertPopup: {
            type: Boolean,
            required: true
        },
        gameInformationObject: {
            type: Object,
            required: true
        }
    },
    data(){
        return{
            userName: userState.username,
            userID: userState.userID,
            isVisitor: false,
            insertingGameName: this.gameName || '',
            filteredNames: [],
            supportedGames: ['Dominion', 'Moonrakers', 'Clank', 'Lords of Waterdeep', 'Race for the Galaxy', 'Heat', 
                'Space Base', 'Dune Imperium', 'Puerto Rico', 'Cosmic Encounter', 'Catan', 'Munchkin'],
        }
    },
    components: {
        RecentGame,
    },
    methods: {
        createMapping(){
            this.gamePlayerCounts = {
                'Dominion': '2 - 4 Players', 'Moonrakers': '1 - 5 Players', 'Clank': '2 - 4 Players', 'Lords of Waterdeep': '2 - 4 Players', 
                'Race for the Galaxy': '2 - 4 Players', 'Heat': '1 - 6 Players', 'Space Base': '2 - 5 Players', ' Puerto Rico' : '3 - 5 Players',
                'Cosmic Encounter': '3 - 5 Players', 'Catan': '2 - 4 Players', 'Munchkin': '3 - 6 Players',  'Dune Imperium': '1 - 4 Players'
            }
            this.positionMapping = {
                'winner': this.winnerName, 'second': this.secondName, 'third': this.thirdName, 'fourth': this.fourthName, 'fifth': this.fifthName, 'sixth': this.sixthName,
            }
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
        submitRecord(){
            if (this.insertingGameName === "Heat") {
                this.winnerScore = 0;
                this.secondScore = 0;
            }
            
            let insertObject = {
                "posterid": this.userID,
                "gamename": this.insertingGameName,
                "winnername": this.winnerName,
                "winnerscore": this.winnerScore,
                "secondname": this.secondName,
                "secondscore": this.secondScore,
                "thirdname": this.thirdName,
                "thirdscore": this.thirdScore,
                "fourthname": this.fourthName,
                "fourthscore": this.fourthScore,
                "fifthname": this.fifthName,
                "fifthscore": this.fifthScore,
                "sixthname": this.sixthName,
                "sixthscore": this.sixthScore,
                date: null
            }

            fetch(`${import.meta.env.VITE_API_URL}/insertgame`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(insertObject)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.winnerName = null;
                this.winnerScore = null;
                this.secondName = null;
                this.secondScore = null;
                this.thirdName = null;
                this.thirdScore = null;
                this.fourthName = null;
                this.fourthScore = null;
                this.fifthName = null;
                this.fifthScore = null;
                this.sixthName = null;
                this.sixthScore = null;
                this.$emit('gameInserted')
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
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
    },
    computed: {
        calculatedPlayerCount: {
            get() {
                return this.insertingPlayerCount !== null ? this.insertingPlayerCount : null;
            }
        },
        winnerName() {
            return this.gameInformationObject.winnername;
        },
        winnerScore() {
            return this.gameInformationObject.winnerscore;
        },
        secondName() {
            return this.gameInformationObject.secondname;
        },
        secondScore() {
            return this.gameInformationObject.secondscore;
        },
        thirdName() {
            return this.gameInformationObject.thirdname;
        },
        thirdScore() {
            return this.gameInformationObject.thirdscore;
        },
        fourthName() {
            return this.gameInformationObject.fourthname;
        },
        fourthScore() {
            return this.gameInformationObject.fourthscore;
        },
        fifthName() {
            return this.gameInformationObject.fifthname;
        },
        fifthScore() {
            return this.gameInformationObject.fifthscore;
        },
        sixthName() {
            return this.gameInformationObject.sixthname;
        },
        sixthScore() {
            return this.gameInformationObject.sixthscore;
        }
    },
    created(){
        let searchName = this.userName;
        if(searchName == 'Guest') {
            this.isVisitor = true;
        }
        this.createMapping();
        this.fetchUsersPlayedWith('josh');
    }
}
</script>

<style scoped>
.text {
    margin-left: 15px;
}
.text p:first-of-type {
    margin-top: 14px;
    font-family: 'Manolo Mono', sans-serif !important;
}
.text p:nth-of-type(2) {
    margin-top: 35px;
    margin-bottom: 4px;
}

.custom-dialog {
  background-color: black !important;
}

.players{
    display: flex;
    justify-content: space-evenly;
    width: 420px;
}
.playerSection {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 40%;
    align-items: start;
    margin-bottom: 17px;
}
.playerSection label {
    color: white;
    margin-bottom: 8px;
}
input {
    background-color: #404040;
    padding: 5px;
    border: #404040;
    border-radius: 5px;
    height: 32px;
    width: 140px;
    color: white;
}

.btn-primary{
    color: #fff;
    background-color: #337ab7;
    border-color: #2e6da4;
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    border: 1px solid transparent;
    border-radius: 4px;
    width: 150px;
    cursor: poNumberer;
}

#overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
    z-index: 1000;
}

.gamepopup {
    width: 450px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #242526;
    border-radius: 8%;
    text-align: center;
    z-index: 1001;
}
.popupContainer {
    width: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 25px;
}

.customAutocomplete {
    background-color: #404040;
    border: 1px solid #404040;
    color: white;
    padding: 6px;
    border-radius: 5px;
    width: 90%;
}

@media (max-width: 	420px) {
    .MobileHide {
        display: none !important;
    }

    .gamepopup {
        width: 385px;
    }
    .popupContainer {
        width: 410px;
    }
}
</style>