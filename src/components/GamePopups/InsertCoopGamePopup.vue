<template>
    <!-- <div id="popups" class="gamepopup" v-if="this.insertPopup">  -->
    <div id="popups" class="gamepopup" > 
        <div class="popupContainer">
            <p style="color: white; display: inline-block;">{{ this.popupType }} a {{ this.insertingGameName }} record</p>
            <div class="players">
                <div class="playerSection">
                    <label for="winnerName">Player One</label>
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
            </div>
            <div class="players">
                <div class="playerSection">
                    <label for="secondName">Player Two</label>
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
            </div>
            <div class="players">
                <div class="playerSection">
                    <label for="thirdName">Player Three</label>
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
            </div>
            <div class="players">
                <div class="playerSection">
                    <label for="fourthName">Player Four</label>
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
            </div>
            <div class="players">
                <div class="playerSection">
                    <label for="fifthName">Player Five</label>
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
            </div>
            <div style="display: flex; flex-direction: row;">
                <div class="playerSection">
                    <label for="level" style="margin-bottom: 4px;">Level Beat</label>
                    <span class="number-wrapper" style="display: flex; flex-direction: row; background-color: #404040; border-radius: 5px; padding: 0 5px;">
                        <div style="color: lightgray; user-select: none; margin-top: 8px;"  @click="decreaseCount('Level')">▼</div>
                        <input v-model="Level" id="Level" style="width: 18px;">
                        <div style="color: lightgray; user-select: none; margin-top: 6px;"  @click="increaseCount('Level')">▲</div>
                    </span>
                </div>
                <button class="btn-primary" v-if="this.popupType == 'Insert'" style="height: 32px; width: 160px; margin-top: 23px; margin-left: 15px;" @click="submitRecord" :disabled="isVisitor">Submit Record</button>
                <button class="btn-outline" v-if="this.popupType == 'Update'" style="height: 32px; width: 160px; margin-top: 23px; margin-left: 15px;" @click="updateRecord" :disabled="isVisitor">Update Record</button>
            </div>

        </div>
    </div>
</template>


<script>
import axios from "axios"
import { userState } from "@/state/userState"
import Select from 'primevue/select';
import { toHandlers } from "vue";

export default {
    inheritAttrs: false,
    name: "Add Record",
    props: {
        Type: String,
        GameData: Object,
        gameName: {
            type: String,
            default: ''
        }
    },
    data(){
        return{
            userName: userState.username,
            userID: userState.userID,
            isVisitor: false,
            popupType: this.Type || "Insert",
            insertingGameName: this.gameName || '',
            filteredNames: [],
            Level: 0,
            gameID: null,
            gamedata: this.GameData || null
        }
    },
    methods: {
        filteredOptions(index) {
            // Get all codes picked by other players, except 'empty'
            const picked = this.playerCharacters
            .filter((code, i) => i !== index && code !== 'empty');
            // Always include the 'empty' option
            return this.characterOptions.filter(
            opt => opt.code === 'empty' || !picked.includes(opt.code)
            );
        },
        createMapping(){
            this.positionMapping = {
                'winner': this.winnerName, 'second': this.secondName, 'third': this.thirdName, 'fourth': this.fourthName
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
        increaseCount(field){
            if(field === 'Level' && this.Level < 4) {
                this.Level = this.Level + 1;
            }
        },
        decreaseCount(field){
            if(field === 'Level' && this.Level > 0) {
                this.Level = this.Level - 1;
            }
        },
        submitRecord() {
            let insertObject = {
                "posterid": this.userID,
                "gamename": this.insertingGameName,
                "winnername": this.winnerName,
                "winnerscore": this.Level,
                "secondname": this.secondName || null,
                "secondscore": 0,
                "thirdname": this.thirdName || null,
                "thirdscore": null,
                "fourthname": this.fourthName || null,
                "fourthscore": null,
                "fifthname": this.fifthName || null,
                "fifthscore": null,
                "sixthname": null,
                "sixthscore": null,
                "seventhname": null,
                "seventhscore": null,
                date: null
            };

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
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                this.$emit('gameInserted');
            })
        },
        updateRecord(){
            let insertObject = {
                "gameid": this.gameID,
                "winnername": this.winnerName,
                "winnerscore": this.Level,
                "secondname": this.secondName || null,
                "secondscore": 0,
                "thirdname": this.thirdName || null,
                "thirdscore": null,
                "fourthname": this.fourthName || null,
                "fourthscore": null,
                "fifthname": null,
                "fifthscore": null,
                "sixthname": null,
                "sixthscore": null,
                "seventhname": null,
                "seventhscore": null,
                "date": this.date
            };

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
                console.log('Success:', data);
                this.$emit('gameInserted');
                return response.json();
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
    },
    created(){
        let searchName = this.userName;
        if(searchName == 'Guest') {
            this.isVisitor = true;
        }
        this.createMapping();
        this.fetchUsersPlayedWith(searchName);

        if(this.popupType == 'Update') {
            console.log(this.gamedata)
            this.Level = this.gamedata.winnerscore;
            this.winnerName = this.gamedata.winnername;
            this.secondName = this.gamedata.secondname;
            this.thirdName = this.gamedata.thirdname;
            this.fourthName = this.gamedata.fourthname;
            this.fifthName = this.gamedata.fifthName;
            this.gameID = this.gamedata.gameid;
            this.date = this.gamedata.date;
        }
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
    text-align: center;
    border: 1px solid transparent;
    border-radius: 5px;
    width: 150px;
}
.btn-outline {
    color: #17a2b8 !important;
    background: transparent;
    border: 2px solid #17a2b8;
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    border-radius: 5px;
    width: 150px;
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

.p-dropdown-panel,
.p-dropdown-items {
  background: #404040 !important;
}

/* For the individual dropdown items (optional, for hover/selected states) */
.p-dropdown-item {
  background: #404040 !important;
  color: #fff; /* Optional: makes text visible on dark background */
}
.p-dropdown-item.p-highlight,
.p-dropdown-item:hover {
  background: #505050 !important; /* Slightly lighter for hover/selected */
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