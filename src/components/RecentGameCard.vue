<template>
    <div class="game" @click="createPopup(gameData.gamename)">
        <div class="header">
            <div style="display: flex; flex-direction: row;">
                <img class="gamePicture" :src="imageSource" style="border-top-left-radius: 5px;">
                <div class="testtext" style="margin-left: 15px;">
                    <p class="name">{{ posterName }}</p>
                    <p class="date">{{ formattedDate }}</p>
                    <p class="gameName" @click="navigateToGamePage(gameData.gamename)">{{ gameData.gamename }}</p>
                    <span class='gameID' style="display: none;">Game ID {{ gameData.game_id}}</span>
                </div>
            </div>
            <img :src="profileImageSrc" class="profilePicture">
        </div>
        <div class="slaythespireInformation" v-if="gameData.gamename === 'Slay the Spire'">
            <div v-if="gameData.secondname === null" style="width: 100%; margin-top: 15px; display: flex; flex-direction: row; justify-content: space-around;">
                <div>
                    <span style="color: white;" @click="navigateToProfile(gameData.winnername)">{{ gameData.winnername }}</span>
                </div>
                <div>
                    <span style="color: white;">Act Beat:&nbsp;</span>
                    <span style="color: white;">{{ gameData.winnerscore }}</span>
                </div>
                <div>
                    <span style="color: white;">Ascension:&nbsp;</span>
                    <span style="color: white;">{{ gameData.secondscore }}</span>
                </div>
            </div>
            <div v-if="gameData.secondname !== null">
                <div class="slaythespireRow" style="width: 95px; justify-content: space-between;">
                    <span>Act Beat:</span>
                    <span>{{ gameData.winnerscore }}</span>
                </div>
                <div class="slaythespireRow" style="width: 95px; justify-content: space-between;">
                    <span>Ascension:</span>
                    <span>{{ gameData.secondscore }}</span>
                </div>
            </div>
            <div v-if="gameData.secondname !== null">
                <div class="slaythespireRow">
                    <span @click="navigateToProfile(gameData.winnername)">{{ gameData.winnername }}</span>
                </div>
                <div class="slaythespireRow">
                    <span @click="navigateToProfile(gameData.secondname)">{{ gameData.secondname }}</span>
                </div>
            </div>
            <div v-if="gameData.thirdname !== null">
                <div class="slaythespireRow">
                    <span @click="navigateToProfile(gameData.thirdname)">{{ gameData.thirdname }}</span>
                </div>
                <div class="slaythespireRow">
                    <span @click="navigateToProfile(gameData.fourthname)">{{ gameData.fourthname }}</span>
                </div>
            </div>
        </div>
        <div class="gameInformation" v-if="gameData.gamename !== 'Slay the Spire'">
            <div class="podium">
                <img src="/src/assets/icons/firstblack.png" class="medal">
                <p class="placer" @click="navigateToProfile(this.winnerName)">{{ this.winnerName }}</p>
            </div>
            <div v-if="gameData.secondname" class="podium">
                <img src="/src/assets/icons/secondblack.png" class="medal">
                <p class="placer" @click="navigateToProfile(this.secondName)">{{ this.secondName }}</p>
            </div>
            <div v-if="gameData.thirdname" class="podium">
                <img src="/src/assets/icons/thirdblack.png" class="medal">
                <p class="placer" @click="navigateToProfile(this.thirdName)">{{ this.thirdName }}</p>
            </div>
        </div>
    </div>
    <div id="overlay" v-if="this.showCoopGame" @click="this.showCoopGame=!this.showCoopGame"></div>
    <InsertCoopGamePopup v-if="this.showCoopGame" :Type="'Update'" :GameData="gameData"
        @gameInserted="this.showCoopGame = false"></InsertCoopGamePopup>
    <div id="overlay" v-if="this.showRoot" @click="this.showRoot=!this.showRoot"></div>
    <InsertRootPopup v-if="this.showRoot" :Type="'Update'" :GameData="gameData"
        @gameInserted="this.showRoot = false"></InsertRootPopup>
    <div id="overlay" v-if="this.showSTS" @click="this.showSTS=!this.showSTS"></div>
    <InsertSlaytheSpirePopup v-if="this.showSTS" :Type="'Update'" :GameData="gameData"
        @gameInserted="this.showSTS = false"></InsertSlaytheSpirePopup>
    <div id="overlay" v-if="this.showBossMonster" @click="this.showBossMonster=!this.showBossMonster"></div>
    <InsertBossMonsterPopup v-if="this.showBossMonster" :Type="'Update'" :GameData="gameData"
        @gameInserted="this.showBossMonster = false"></InsertBossMonsterPopup>
    <div id="overlay" v-if="this.showDialog" @click="this.showDialog=!this.showDialog"></div>
    <div id="popups" class="gamepopup" v-if="this.showDialog"> 
        <div style="width: 450px; display: flex; flex-direction: column; align-items: center; margin-bottom: 25px;">
            <p style="color: white; display: inline-block;">Update a {{ gameData.gamename }} record</p>
            <div class="players">
                <div class="playerSection">
                    <label for="winnerName">Winner</label>
                    <AutoComplete v-model="winnerName" :suggestions="filteredNames"  optionLabel="name"
                        @complete="searchName" @item-select="updateName($event, 'winner')" id="winnerName"
                        class="custom-autocomplete" optionValue="name" @change="inputName($event, 'winner')" @keydown="handleKeyDown($event, 'winner')"
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
                        class="custom-autocomplete" optionValue="name" @change="inputName($event, 'second')" @keydown="handleKeyDown($event, 'second')"
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
                        class="custom-autocomplete" optionValue="name" @change="inputName($event, 'third')" @keydown="handleKeyDown($event, 'third')"
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
            <div style="display: flex; flex-direction: row; justify-content: space-around; width: 80%;">
                <Input v-model="date" id="date"></Input>
                <button class="btn-outline" @click="updateRecord">Update Record</button>
            </div>
        </div>
    </div>
</template>
    
<script>
import { userState } from '/src/state/userState'
import InsertSlaytheSpirePopup from './InsertSlaytheSpirePopup.vue'
import InsertRootPopup from './InsertRootPopup.vue'
import InsertCoopGamePopup from './InsertCoopGamePopup.vue'
import InsertBossMonsterPopup from './InsertBossMonsterPopup.vue'

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
        users : {
            Array,
            required: true
        }
    },
    data(){
        return{
            userName: userState.username,
            showDialog: false,
            showSTS: false,
            showRoot: false,
            showBossMonster: false,
            showCoopGame: false,
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
            seventhName: this.gameData.seventhname || null,
            seventhScore: this.gameData.seventhscore || null,
            date: this.gameData.date,
            userMapping: { 1: 'josh', 2: 'john', 3: 'thetwinmeister', 4: 'ethangambles', 13: 'Hibby'}
        }
    },
    components: {
        InsertSlaytheSpirePopup,
        InsertRootPopup,
        InsertCoopGamePopup,
        InsertBossMonsterPopup
    },
    methods: {
        navigateToGamePage(name) {
            this.$router.push(`/game/${name}`);
        },
        navigateToProfile(name) {
            this.$router.push(`/profile/${name}`);
            let searchName = name;
            if(searchName == 'Guest') {
                searchName = 'josh'
                this.isVisitor = true;
            }
        },
        createPopup(gameName){
            if(this.isVisitor == true) {
                return;
            }
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
                "seventhname": this.seventhName,
                "seventhscore": this.seventhName,
                "date": this.date
            }

            console.log(insertObject)

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
                this.showSTS = false;
                this.showRoot = false;
                this.showBossMonster = false;
                this.showCoopGame = false;
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

    },
    computed: {
        formattedDate(){
            let parts = this.gameData.date.split('-');
            let year = parts[0];
            let month = parts[1];
            let day = parts[2];
            const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            const monthName = months[month - 1];
            return `${monthName} ${day}, ${year}`
        },
        posterName(){
            return this.users.find(user => user.id === this.gameData.posterid)?.username
        },
        imageSource() {
            const cleanedGameName = this.gameData.gamename.replace(/\s+/g, '');
            return new URL(`../assets/addgame/${cleanedGameName}.webp`, import.meta.url).href;
        },
        profileImageSrc() {
            if(this.isVisitor == true) {
                return new URL('../assets/profilepictures/Guest.png', import.meta.url).href;
            }
            let name = this.userMapping[this.gameData.posterid];
            return new URL(`../assets/profilepictures/${name}.png`, import.meta.url).href
        }
    },
    created() {
        this.gamePlayerCounts = {
            'Dominion': '2 - 4 Players', 'Moonrakers': '1 - 5 Players', 'Clank': '2 - 4 Players', 'Lords of Waterdeep': '2 - 6 Players', 'Slay the Spire': '1 - 4 Players',
            'Race for the Galaxy': '2 - 4 Players', 'Heat': '1 - 6 Players', 'Space Base': '2 - 5 Players', '7 Wonders' : '2 - 7 Players', 'Root' : '2 - 6 Players', 
            'Puerto Rico' : '3 - 5 Players', 'Cosmic Encounter': '3 - 5 Players', 'Catan': '3 - 6 Players', 'Munchkin': '3 - 6 Players',  'Dune Imperium': '1 - 4 Players',
            'Stratego' : '2 Players', '5 Minute Marvel': '2 - 5 Players', '7 Wonders Duel': '2 Players', 'Boss Monster': '1 - 4 Players'
        }
        this.positionMapping = {
            'winner': this.winnerName, 'second': this.secondName, 'third': this.thirdName, 'fourth': this.fourthName, 'fifth': this.fifthName,
        }

        if(this.isVisitor == true) {
            this.winnerName = 'Player 1';
            this.secondName = 'Player 2';
            this.thirdName = 'Player 3';
        }

        if(this.gameData.gamename == 'Slay the Spire') {
            console.log(this.gameData)
        }
    }
}
</script>

<style scoped>
.game {
    width: 500px; 
    height: 220px; 
    background-color: #3A3B3C;
    border-radius: 5px;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s;
}
.game:hover {
    transform: scale(1.02);
    cursor: pointer;
}
.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.gamePicture {
    width: 120px; 
    height: 120px; 
}
.profilePicture {
    margin-top: 10px;
    margin-right: 15px;
    width: 50px; 
    height: 50px; 
    border-radius: 50%;
}

.name {
    margin: 12px 0 0 0;
    font-size: 20px;
    font-family: 'Manolo Mono', sans-serif !important;
}
.date {
    font-size: smaller;
    margin: 3px 0 10px;
    font-family: 'Manolo Mono', sans-serif !important;
}
.gameName {
    font-size: 25px;
    margin: 0 0 10px;
    font-family: 'Manolo Mono', sans-serif !important;
}

.gameInformation {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 25px;
}
.gameInformation p {
    color: white;
}
.slaythespireInformation { 
    display: flex;
    flex-direction: row;
    margin-top: 28px;
    width: 100%;
    justify-content: space-around;
}
.slaythespireRow {
    display: flex;
    flex-direction: row;
}
.slaythespireRow span {
    color: white;
    margin-bottom: 8px;
}
.podium{
    width: 155px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.standing {
    font-size: small;
    margin: 0;
}
.medal {
    height: 40px;
    width: 40px;
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
    width: 70%;
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
        height: 170px;
        width: 385px;
        margin-top: 8px;
    }
    .gamePicture {
        height: 100px;
        width: 100px;
    }
    .gameInformation {
        margin-top: 12px;
    }
    .slaythespireInformation{
        margin-top: 10px;
    }
    .name {
        font-size: 18px;
    }
    .date {
        font-size: 12px;
    }
    .gameName {
        font-size: 20px;
    }
    .medal {
        height: 30px;
        width: 30px;
    }
    .placer {
        font-size: 13px;
    }
    
}
</style>