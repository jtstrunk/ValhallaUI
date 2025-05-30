<template>
    <div class="game" v-if="isGameShowing" @click="createPopup(gameData.gamename)">
        <div>
            <img class="gameimg" :src="imageSource" style="border-top-right-radius: 5px;">
        </div>
        <div class="gameContent">
            <h4 class="gameName" :style="gameNameStyle" @click="navigateToGamePage(gameData.gamename)">{{ gameData.gamename }}</h4>
            <h5>Winner: {{ this.winnerName }}</h5>
            <h5>Second: {{ this.secondName }}</h5>
            <span class='gameID' style="font-size: smaller;">Game ID {{ gameData.gameid}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span style="font-size: smaller;">{{ gameData.date }}</span>
        </div>
    </div>
    <div id="overlay" v-if="this.showSTS" @click="this.showSTS=!this.showSTS"></div>
    <InsertSlaytheSpirePopup v-if="this.showSTS" :Type="'Update'" :GameData="gameData"
        @gameInserted="this.showSTS = false"></InsertSlaytheSpirePopup>
    <div id="overlay" v-if="this.showDialog" @click="this.showDialog=!this.showDialog"></div>
    <div id="popups" class="gamepopup" v-if="this.showDialog"> 
        <div style="width: 450px; display: flex; flex-direction: column; align-items: center; margin-bottom: 25px;">
            <p style="color: white; display: inline-block;">Update a {{ gameData.gamename }} record</p>
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
            <div style="display: flex; flex-direction: row; justify-content: space-around; width: 80%;">
                <Input v-model="date" id="date"></Input>
                <button class="btn-outline" @click="updateRecord">Update Record</button>
            </div>
            
        </div>
    </div>
</template>

<script>
import InsertSlaytheSpirePopup from './InsertSlaytheSpirePopup.vue'

export default {
    name: "Home",
    props: {
        gameData: { 
            Object
        },
        isVisitor: {
            Boolean
        },
        suggestedNames: { 
            Array
        },
        showingGames:{
            Array
        },
        themeGames:{
            Array
        },
        typeGames:{
            Array
        },
        searchType: {
            String,
            required: true
        },
        startDate: {
            type: String,
            required: true
        },
        endDate: {
            type: String,
            required: true
        }
    },
    data(){
        return{
            showDialog: false,
            showSTS: false,
            insertingPlayerCount: null,
            insertingGameName: this.gameData.gamename,
            filteredNames: [],
            winnerName: this.gameData.winnername || null,
            winnerScore: this.gameData.winnerscore || null,
            secondName: this.gameData.secondname || null,
            secondScore: this.gameData.secondscore || null,
            thirdName: this.gameData.thirdname || null,
            thirdScore: this.gameData.thirdscore || null,
            fourthName: this.gameData.fourthname || null,
            fourthScore: this.gameData.fourthscore || null,
            fifthName: this.gameData.fifthname || null,
            fifthScore: this.gameData.fifthscore || null,
            sixthName: this.gameData.sixthname || null,
            sixthScore: this.gameData.sixthscore || null,
            date: this.gameData.date
        }
    },
    components: {
        InsertSlaytheSpirePopup
    },
    methods: {
        navigateToGamePage(name) {
            this.$router.push(`/game/${name}`);
        },
        createPopup(gameName){
            if(this.isVisitor == true) {
                return;
            }
            if(gameName == 'Slay the Spire') {
                this.showSTS = true;
                return;
            }
            let playerCount = this.gamePlayerCounts[gameName]
            this.gameid = this.gameData.gameid;
            this.insertingPlayerCount = playerCount.charAt(4);
            this.showDialog = !this.showDialog
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
        updateRecord(){
            if (this.insertingGameName === "Heat") {
                this.winnerScore = 0;
                this.secondScore = 0;
            }

            let insertObject = {
                "gameid": this.gameid,
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
                "date": this.date
            }

            fetch(`${import.meta.env.VITE_API_URL}/updategame`, {
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
                this.showSTS = false
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
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
    },
    computed: {
        gameNameStyle() {
        return {
            height: this.gameData.gamename.length > 14 ? '30px' : 'auto',
            marginBottom: this.gameData.gamename.length > 14 ? '25px' : '32px'
            }
        },
        imageSource() {
            // const cleanedGameName = this.gameData.gamename.replace(/\s+/g, '');
            // return `/src/assets/homegame/${cleanedGameName}.png`;
            const cleanedGameName = this.gameData.gamename.replace(/\s+/g, '');
            return new URL(`../assets/homegame/${cleanedGameName}.png`, import.meta.url).href;
        },
        isGameShowing() {
            const gameDate = new Date(this.date);
            const startDate = new Date(this.startDate);
            const endDate = new Date(this.endDate);

            if (gameDate < startDate || gameDate > endDate) {
                return false;
            }

            if (this.showingGames.length == 0 && this.themeGames.length == 0 && this.typeGames.length == 0) {
                return true;
            }

            if (this.searchType === 'exclusive') {
                return (
                (this.showingGames.length === 0 || this.showingGames.includes(this.gameData.gamename)) &&
                (this.themeGames.length === 0 || this.themeGames.includes(this.gameData.gamename)) &&
                (this.typeGames.length === 0 || this.typeGames.includes(this.gameData.gamename))
                );
            } else {
                return (
                    this.showingGames.includes(this.gameData.gamename) ||
                    this.themeGames.includes(this.gameData.gamename) ||
                    this.typeGames.includes(this.gameData.gamename)
                );
            }
        }
    },
    created() {
        this.gamePlayerCounts = {
            'Dominion': '2 - 4 Players', 'Moonrakers': '1 - 5 Players', 'Clank': '2 - 4 Players', 'Lords of Waterdeep': '2 - 6 Players', 'Slay the Spire': '1 - 4 Players', 
            'Race for the Galaxy': '2 - 4 Players', 'Heat': '1 - 6 Players', 'Space Base': '2 - 5 Players', '7 Wonders' : '2 - 7 Players', 'Root' : '2 - 6 Players', 
            'Puerto Rico' : '3 - 5 Players', 'Cosmic Encounter': '3 - 5 Players', 'Catan': '2 - 4 Players', 'Munchkin': '3 - 6 Players',  'Dune Imperium': '1 - 4 Players'
        }
        this.positionMapping = {
            'winner': this.winnerName, 'second': this.secondName, 'third': this.thirdName, 'fourth': this.fourthName, 'fifth': this.fifthName,
        }
        if(this.isVisitor == true) {
            this.winnerName = 'Player 1';
            this.secondName = 'Player 2';
        }
    }
}
</script>

<style scoped>
.game:hover {
    transform: scale(1.02);
    cursor: pointer;
}
.game {
    display: flex;
    flex-direction: column;
    background-color: #3A3B3C;
    width: 180px;
    height: 245px;
    margin-top: 16px;
    border-radius: 5px;
    margin-left: 9px;
    margin-right: 9px;
}

.gameContent {
    margin-left: 8px;
}
.gameContent h4 {
    color: white;
    margin-top: 10px;
    font-family: 'Manolo Mono', sans-serif !important;
    font-size: 20px !important;
    font-weight: 600;
    overflow-wrap: break-word;
}

.gameContent h5 {
    color: white;
    margin-bottom: 5px;
    margin-top: 10px;
    font-size: 14px !important;
    font-family: 'Manolo Mono', sans-serif !important;
    font-weight: 500;
    
}
.gameContent span{
    color: white;
    font-size: 12px !important;
    font-family: 'Manolo Mono', sans-serif !important;
}

.gameimg {
    width: 180px;
    height: 97px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
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

.customAutocomplete {
    background-color: #404040;
    border: 1px solid #404040;
    color: white;
    padding: 6px;
    border-radius: 5px;
}

.btn-outline {
    color: #17a2b8 !important;
    background: transparent;
    border: 2px solid #17a2b8;
    border-radius: 5px;
    width: 115px;
}
.btn-outline:hover {
    color: #fff !important;
    background-color: #17a2b8;
    border: 2px solid #17a2b8;
    transition: .5s;
}

@media (max-width: 	420px) {
    .MobileHide {
        display: none !important;
    }
    
    .game {
        width: 180px;
        height: 245px;
        margin-top: 6px;
        margin-left: 4px;
        margin-right: 3px;
    }

    /* .gameContent {
        margin-left: 8px;
    }
    .gameContent h4 {
        color: white;
        margin-top: 10px;
        font-family: 'Manolo Mono', sans-serif !important;
        font-size: 20px !important;
        font-weight: 600;
        overflow-wrap: break-word;
    }

    .gameContent h5 {
        color: white;
        margin-bottom: 5px;
        margin-top: 10px;
        font-size: 14px !important;
        font-family: 'Manolo Mono', sans-serif !important;
        font-weight: 500;
        
    }
    .gameContent span{
        color: white;
        font-size: 12px !important;
        font-family: 'Manolo Mono', sans-serif !important;
    }

    .gameimg {
        width: 180px;
        height: 97px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    } */
    
}
</style>