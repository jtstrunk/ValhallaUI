<template>
    <div style="display: flex; justify-content: center;">
        <div style="display: flex; flex-direction: column; align-items: center;">
            <label for="searchGameName" id="searchGameNameLabel">Search for a game to add</label>
            <input v-model="searchGameName" placeholder="Search Games" id="searchGameName">
        </div>
    </div>

    <div id="availableGames">
        <div v-for="game in filteredGames" class="card" @click="createPopup(game, this.gamePlayerCounts[game])">
            <img src="../assets/icons/newpage.webp" class="icon newpage-icon" @click="navigateToGamePage(game)"/>
            <div class="img">
                <img :src="getGameImage(game)">
            </div>
            <div class="text">
                <p style="font-size: 24px;">{{ game }}</p>
                <p style="font-size: large;">{{ this.gamePlayerCounts[game] }}</p>
                <div>
                    <span class="bottom">Add a</span>&nbsp;<span class="bottom" style="text-decoration: underline;">game</span>
                </div>
            </div>
        </div>
        <div class="card" @click="createPopup('', '1 - 6 Players')">
            <div class="img">
                <img :src="getGameImage('Unsupported')">
            </div>
            <div class="text">
                <p style="font-size: 24px;">Add Custom Game</p>
                <p style="font-size: large;">1 - 6 Players</p>
                <div>
                    <span class="bottom">Add a</span>&nbsp;<span class="bottom" style="text-decoration: underline;">game</span>
                </div>
            </div>
        </div>
    </div>
    <div id="overlay" v-if="this.showCoopGame" @click="this.showCoopGame=!this.showCoopGame"></div>
    <InsertCoopGamePopup v-if="this.showCoopGame" :Type="'Insert'" :gameName="'5 Minute Marvel'"
        @gameInserted="this.showCoopGame = false"></InsertCoopGamePopup>
    <div id="overlay" v-if="this.showSTS" @click="this.showSTS=!this.showSTS"></div>
    <InsertSlaytheSpirePopup v-if="this.showSTS" :Type="'Insert'"
        @gameInserted="this.showSTS = false"></InsertSlaytheSpirePopup>
    <div id="overlay" v-if="this.showRoot" @click="this.showRoot=!this.showRoot"></div>
    <InsertRootPopup v-if="this.showRoot" :Type="'Insert'"
        @gameInserted="this.showRoot = false"></InsertRootPopup>
    <div id="overlay" v-if="this.showBossMonster" @click="this.showBossMonster=!this.showBossMonster"></div>
    <InsertBossMonsterPopup v-if="this.showBossMonster" :Type="'Insert'"
        @gameInserted="this.showBossMonster = false"></InsertBossMonsterPopup>
    <div id="overlay" v-if="this.showDialog" @click="this.showDialog=!this.showDialog"></div>
    <div id="popups" class="gamepopup" v-if="this.showDialog"> 
        <div class="popupContainer">
            <p v-if="insertingGameName != ''" style="color: white; display: inline-block;">Add a {{ this.insertingGameName }} record</p>
            <div v-if="insertingGameName == ''" style="color: white; display: inline-block; margin: 16px 0;">
                <span>Add a </span>
                <input v-model="insertingCustomGameName" placeholder="Custom Game Name">
                <span> record</span>
            </div>
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
                <div v-if="this.insertingGameName != 'Heat' && this.insertingGameName != 'Stratego'" class="playerSection">
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
                <div v-if="this.insertingGameName != 'Heat' && this.insertingGameName != 'Stratego'" class="playerSection">
                    <label for="secondScore">Score</label>
                    <Input v-model.number="secondScore" id="secondScore"></Input>
                </div>
            </div>
            <div v-if="this.insertingPlayerCount > 2" class="players">
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
            <div v-if="this.insertingPlayerCount > 3" class="players">
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
            <div v-if="this.insertingPlayerCount > 4" class="players">
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
            <div v-if="this.insertingPlayerCount > 6" class="players">
                <div class="playerSection">
                    <label for="SeventhName">Seventh</label>
                    <AutoComplete v-model="seventhName" :suggestions="filteredNames" optionLabel="name"
                        @complete="searchName" @item-select="updateName($event, 'seventh')" id="SeventhName"
                        class="custom-autocomplete" optionValue="name" @change="inputName($event, 'seventh')" @keydown="handleKeyDown($event, 'seventh')"
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
                    <label for="seventhScore">Score</label>
                    <Input v-model.number="seventhScore" id="seventhScore"></Input>
                </div>
            </div>
            <button class="btn-primary" @click="submitRecord" :disabled="isVisitor">Submit Record</button>
        </div>
    </div>
</template>


<script>
import axios from "axios"
import RecentGame from './RecentGame.vue'
import Dialog from 'primevue/dialog'
import { userState } from "@/state/userState"
import InsertSlaytheSpirePopup from './InsertSlaytheSpirePopup.vue'
import InsertRootPopup from './InsertRootPopup.vue'
import InsertCoopGamePopup from './InsertCoopGamePopup.vue'
import InsertBossMonsterPopup from './InsertBossMonsterPopup.vue'

export default {
    name: "Add Record",
    data(){
        return{
            userName: userState.username,
            userID: userState.userID,
            showDialog: false,
            showSTS: false,
            showRoot: false,
            showBossMonster: false,
            showCoopGame: false,
            isVisitor: false,
            searchGameName: '',
            insertingGameName: '',
            insertingCustomGameName: '',
            insertingPlayerCount: null,
            filteredNames: [],
            supportedGames: ['Dominion', 'Clank', 'Slay the Spire', 'Moonrakers', 'Heat', 'Race for the Galaxy', 'Lords of Waterdeep', '7 Wonders Duel',
                'Space Base', 'Boss Monster', '5 Minute Marvel', '7 Wonders', 'Root', 'Stratego', 'Dune Imperium', 'Puerto Rico', 'Cosmic Encounter', 'Catan', 'Munchkin'],
            winnerName: null,
            winnerScore: null,
            secondName: null,
            secondScore: null,
            thirdName: null,
            thirdScore: null,
            fourthName: null,
            fourthScore: null,
            fifthName: null,
            fifthScore: null,
            sixthName: null,
            sixthScore: null,
            seventhName: null,
            seventhScore: null
        }
    },
    components: {
        Dialog,
        RecentGame,
        InsertSlaytheSpirePopup,
        InsertRootPopup,
        InsertCoopGamePopup,
        InsertBossMonsterPopup
    },
    computed: {
        filteredGames() {
            if (!this.searchGameName.trim()) {
                return this.supportedGames;
            }
            const search = this.searchGameName.trim().toLowerCase();
                return this.supportedGames.filter(game => game.toLowerCase().includes(search)
            );
        }
    },
    methods: {
        getGameImage(game) {
            const cleanedGameName = game.replace(/\s+/g, '');
            return new URL(`../assets/addgame/${cleanedGameName}.webp`, import.meta.url).href;
        },
        navigateToGamePage(name) {
            this.$router.push(`/game/${name}`);
        },
        createMapping(){
            this.gamePlayerCounts = {
                'Dominion': '2 - 4 Players', 'Moonrakers': '1 - 5 Players', 'Clank': '2 - 4 Players', 'Lords of Waterdeep': '2 - 6 Players', 'Slay the Spire': '1 - 4 Players',
                'Race for the Galaxy': '2 - 4 Players', 'Heat': '1 - 6 Players', 'Space Base': '2 - 5 Players', '7 Wonders' : '2 - 7 Players', 'Root' : '2 - 6 Players', 
                'Puerto Rico' : '3 - 5 Players', 'Cosmic Encounter': '3 - 5 Players', 'Catan': '3 - 4 Players', 'Munchkin': '3 - 6 Players',  'Dune Imperium': '1 - 4 Players',
                'Stratego' : '2 Players', '5 Minute Marvel': '2 - 5 Players', '7 Wonders Duel': '2 Players', 'Boss Monster': '1 - 4 Players'
            }
            this.positionMapping = {
                'winner': this.winnerName, 'second': this.secondName, 'third': this.thirdName, 'fourth': this.fourthName, 'fifth': this.fifthName,
            }
        },
        createPopup(gameName, playerCount){
            if (gameName == 'Slay the Spire') {
                this.showSTS = true;
                return;
            } else if (gameName == 'Root') {
                this.showRoot = true;
                return;
            } else if (gameName == '5 Minute Marvel') {
                this.showCoopGame = true;
                return;
            } else if (gameName == 'Boss Monster') {
                this.showBossMonster = true;
                return;
            }

            this.insertingPlayerCount = playerCount.charAt(4);
            this.showDialog = !this.showDialog
            this.insertingGameName = gameName;
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
            if(this.insertingCustomGameName != '') {
                this.insertingGameName = this.insertingCustomGameName
                this.winnerScore ??= 0;
                this.secondScore ??= 0;

            }
            if (this.insertingGameName === "Heat" || this.insertingGameName === "Stratego") {
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
                "seventhname": this.seventhName,
                "seventhscore": this.seventhScore,
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
                this.showDialog = false;
                this.showSTS = false;
                this.showRoot = false;
                this.showBossMonster = false;
                this.showCoopGame = false;
                this.insertingCustomGameName = ''
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
                this.seventhName = null;
                this.seventhScore = null;
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
#availableGames{
    width: 1350px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.card {
    display: flex;
    flex-direction: row;
    background-color: #3A3B3C;
    height: 160px;
    width: 430px;
    margin-top: 24px;
    border-radius: 5px;
    margin-left: 10px;
    margin-right: 10px;
    position: relative;
}
.card p, span {
    color: white;
}
.card {
    transition: transform 0.2s;
} 
.card:hover {
    transform: scale(1.04);
    cursor: pointer;
}

img {
    width: 160px;
    height: 160px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}

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
    cursor: pointer;
}

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

#searchGameName {
    width: 300px;
    font-size: 16px;
    font-family: 'Manolo Mono', sans-serif !important;
}
#searchGameNameLabel {
    color: white;
    margin-top: 16px;
    margin-bottom: 6px;
    font-family: 'Manolo Mono', sans-serif !important;
}

.icon {
    position: absolute;
    right: 0px;
    color: white;
    border-top-right-radius: 5px;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
    z-index: 2;
    font-weight: bold;
    background: #242526;
    border: 2px solid #242526;
}

@media (max-width: 	420px) {
    .MobileHide {
        display: none !important;
    }

    #availableGames{
        width: 395px;
        /* margin-top: 15px; */
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow-y: auto;
    }
    .card {
        height: 130px;
        margin-top: 12px;
    }

    .gamepopup {
        width: 385px;
    }
    .popupContainer {
        width: 410px;
    }

    img {
        width: 100px;
        height: 100px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    #searchGameNameLabel {
        color: white;
        margin-top: 6px;
        margin-bottom: 6px;
        font-family: 'Manolo Mono', sans-serif !important;
    }

    .icon {
        width: 25px;
        height: 25px;
        border: 3px solid #242526;
    }
}
</style>