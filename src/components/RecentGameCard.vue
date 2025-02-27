<template>
    <div class="game" @click="createPopup(this.gamePlayerCounts[gameData.gamename])">
        <div class="header">
            <div style="display: flex; flex-direction: row;">
                <!-- <img src="{{ url_for('static', filename='images/addgame/' + game.game_type.replace(' ', '') + '.png') }}" class="gamePicture"> -->
                <img class="gamePicture" :src="imageSource" style="border-top-left-radius: 5px;">
                <div class="testtext" style="margin-left: 15px;">
                    <p class="name">{{ this.userName }}</p>
                    <p class="date">{{ formattedDate }}</p>
                    <p class="gameName">{{ gameData.gamename }}</p>
                    <span class='gameID' style="display: none;">Game ID {{ gameData.game_id}}</span>
                </div>
            </div>
            <img src="/src/assets/profilepictures/joshpfp.png" class="profilePicture">
        </div>
        <div class="gameInformation">
            <div class="podium">
                <img src="/src/assets/icons/firstblack.png" class="medal">
                <p class="placer">{{ gameData.winnername }}</p>
            </div>
            <div v-if="gameData.secondname" class="podium">
                <img src="/src/assets/icons/secondblack.png" class="medal">
                <p class="placer">{{ gameData.secondname }}</p>
            </div>
            <div v-if="gameData.thirdname" class="podium">
                <img src="/src/assets/icons/thirdblack.png" class="medal">
                <p class="placer">{{ gameData.thirdname }}</p>
            </div>
        </div>
    </div>
    <div id="overlay" v-if="this.showDialog" @click="this.showDialog=!this.showDialog"></div>
    <div id="popups" class="gamepopup" v-if="this.showDialog"> 
        <div style="width: 450px; display: flex; flex-direction: column; align-items: center; margin-bottom: 25px;">
            <p style="color: white; display: inline-block;">Add a {{ gameData.gamename }} record</p>
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
                <div class="playerSection">
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
                <div class="playerSection">
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
                <div class="playerSection">
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
                <div class="playerSection">
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
                <div class="playerSection">
                    <label for="fifthScore">Score</label>
                    <Input v-model.number="fifthScore" id="fifthScore"></Input>
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

export default {
    name: "Home",
    props: {
        gameData: { 
            Object
        },
    },
    data(){
        return{
            userName: 'Josh',
            showDialog: false,
            insertingPlayerCount: null,
            insertingGameName: null,
            filteredNames: [],
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
            date: null
        }
    },
    methods: {
        createPopup(playerCount){
            this.gameid = this.gameData.gameid;
            this.insertingGameName = this.gameData.gamename;
            this.winnerName = this.gameData.winnername || null;
            this.winnerScore = this.gameData.winnerscore || null;
            this.secondName = this.gameData.secondname || null;
            this.secondScore = this.gameData.secondscore || null;
            this.thirdName = this.gameData.thirdname || null;
            this.thirdScore = this.gameData.thirdscore || null;
            this.fourthName = this.gameData.fourthname || null;
            this.fourthScore = this.gameData.fourthscore || null;
            this.fifthName = this.gameData.fifthname || null;
            this.fifthScore = this.gameData.fifthscore || null;
            this.date = this.gameData.date;
            this.insertingPlayerCount = playerCount.charAt(4);
            console.log(this.insertingPlayerCount)
            this.showDialog = !this.showDialog
        },
        searchName(event) {
            console.log(this.suggestedNames)
            this.filteredNames = this.suggestedNames.filter(x => x.name.toLowerCase().includes(event.query.toLowerCase()));
        },
        updateName(selectedName, placement) {
            const name = typeof selectedName.value === 'object' ? selectedName.value.name : selectedName.value;
            this.positionMapping[placement] = name;
            this[placement + 'Name'] = name;
        },
        inputName(input, placement) {
            console.log('input name')
            console.log(input)
            console.log(placement)
            this.positionMapping[placement] = input.value;
            this[placement + 'Name'] = input.value;
            console.log(this[placement + 'Name'])
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
                "date": this.date
            }

            console.log(insertObject)

            fetch('http://127.0.0.1:8000/updategame', {
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
                this.showDialog=!this.showDialog;
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
        imageSource() {
            const cleanedGameName = this.gameData.gamename.replace(/\s+/g, '');
            return `/src/assets/addgame/${cleanedGameName}.png`;
        },
        formattedDate(){
            let parts = this.gameData.date.split('-');
            let year = parts[0];
            let month = parts[1];
            let day = parts[2];
            const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            const monthName = months[month - 1];
            return `${monthName} ${day}, ${year}`
        }
    },
    created() {
        this.gamePlayerCounts = {
            'Dominion': '2 - 4 Players', 'Moonrakers': '1 - 5 Players', 'Clank': '2 - 4 Players', 'Lords of Waterdeep': '2 - 4 Players', 
            'Race for the Galaxy': '2 - 4 Players', 'Heat': '1 - 6 Players', 'Space Base': '2 - 5 Players', ' Puerto Rico' : '3 - 5 Players',
            'Cosmic Encounter': '3 - 5 Players', 'Catan': '2 - 4 Players', 'Munchkin': '3 - 6 Players',  'Dune Imperium': '1 - 4 Players'
        }
        this.positionMapping = {
            'winner': this.winnerName, 'second': this.secondName, 'third': this.thirdName, 'fourth': this.fourthName, 'fifth': this.fifthName,
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
</style>