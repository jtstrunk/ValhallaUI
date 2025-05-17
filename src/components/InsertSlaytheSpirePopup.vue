<template>
    <!-- <div id="popups" class="gamepopup" v-if="this.insertPopup">  -->
    <div id="popups" class="gamepopup" > 
        <div class="popupContainer">
            <p style="color: white; display: inline-block;">Update a {{ this.insertingGameName }} record</p>
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
                <div class="playerSection">
                    <label for="playerOneCharacter">Character</label>
                    <Select v-model="playerCharacters[0]" :options="filteredOptions(0)"
                        style="background-color: #404040; width: 160px; padding-top: 7px; padding-bottom: 7px; color: white; border-radius: 5px; padding-right: 10px;"
                        optionLabel="name" optionValue="code" placeholder="Select a character" :pt="{
                            overlay: { style: { backgroundColor: '#404040' } },
                            option: {style: { color: 'white', padding: '4px 8px' } } 
                        }" 
                    />
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
                <div class="playerSection">
                    <label for="playerTwoCharacter">Character</label>
                    <Select v-model="playerCharacters[1]" :options="filteredOptions(1)"
                        style="background-color: #404040; width: 160px; padding-top: 7px; padding-bottom: 7px; color: white; border-radius: 5px; padding-right: 10px;"
                        optionLabel="name" optionValue="code" placeholder="Select a character" :pt="{
                            overlay: { style: { backgroundColor: '#404040' } },
                            option: {style: { color: 'white', padding: '4px 8px' } } 
                        }" 
                    />
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
                <div class="playerSection">
                    <label for="playerThreeCharacter">Character</label>
                    <Select v-model="playerCharacters[2]" :options="filteredOptions(2)"
                        style="background-color: #404040; width: 160px; padding-top: 7px; padding-bottom: 7px; color: white; border-radius: 5px; padding-right: 10px;"
                        optionLabel="name" optionValue="code" placeholder="Select a character" :pt="{
                            overlay: { style: { backgroundColor: '#404040' } },
                            option: {style: { color: 'white', padding: '4px 8px' } } 
                        }" 
                    />
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
                <div class="playerSection">
                    <label for="playerFourCharacter">Character</label>
                    <Select v-model="playerCharacters[3]" :options="filteredOptions(3)"
                        style="background-color: #404040; width: 160px; padding-top: 7px; padding-bottom: 7px; color: white; border-radius: 5px; padding-right: 10px;"
                        optionLabel="name" optionValue="code" placeholder="Select a character" :pt="{
                            overlay: { style: { backgroundColor: '#404040' } },
                            option: {style: { color: 'white', padding: '4px 8px' } } 
                        }" 
                    />
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
import Select from 'primevue/select';

export default {
    inheritAttrs: false,
    name: "Add Record",
    props: {
    },
    data(){
        return{
            userName: userState.username,
            userID: userState.userID,
            isVisitor: false,
            insertingGameName: 'Slay the Spire',
            filteredNames: [],
            characterOptions: [
                { name: 'The Silent', code: 'silent' },
                { name: 'The Ironclad', code: 'ironclad' },
                { name: 'The Defect', code: 'defect' },
                { name: 'The Watcher', code: 'watcher' },
                { name: '--', code: 'empty' },
            ],
            playerCharacters: ['empty', 'empty', 'empty', 'empty']
        }
    },
    components: {
        RecentGame,
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


            // if (this.insertingGameName === "Heat") {
            //     this.winnerScore = 0;
            //     this.secondScore = 0;
            // }

            let characterMapping = {
                'silent' : 1,
                'ironclad' : 2,
                'defect' : 3,
                'watcher' : 4,
            }

            console.log('p1', characterMapping[this.playerCharacters[0]])
            console.log('p2', characterMapping[this.playerCharacters[1]])
            console.log('p3', characterMapping[this.playerCharacters[2]])
            console.log('p4', characterMapping[this.playerCharacters[3]])

            this.playerCharacters[0] = characterMapping[this.playerCharacters[0]]
            this.playerCharacters[1] = characterMapping[this.playerCharacters[1]]
            this.playerCharacters[2] = characterMapping[this.playerCharacters[2]]
            this.playerCharacters[3] = characterMapping[this.playerCharacters[3]]
            
            let insertObject = {
                "posterid": this.userID,
                "gamename": this.insertingGameName,
                "winnername": this.winnerName,
                "winnerscore": this.playerCharacters[0],
                "secondname": this.secondName,
                "secondscore": this.playerCharacters[1],
                "thirdname": this.thirdName,
                "thirdscore": this.playerCharacters[2],
                "fourthname": this.fourthName,
                "fourthscore": this.playerCharacters[3],
                "fifthname": this.fifthName,
                "fifthscore": this.fifthScore,
                "sixthname": null,
                "sixthscore": null,
                date: null
            }

            console.log(insertObject)

            // fetch(`${import.meta.env.VITE_API_URL}/insertgame`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Accept': 'application/json'
            //     },
            //     body: JSON.stringify(insertObject)
            // })
            // .then(response => {
            //     if (!response.ok) {
            //         throw new Error(`HTTP error! status: ${response.status}`);
            //     }
            //     this.winnerName = null;
            //     this.winnerScore = null;
            //     this.secondName = null;
            //     this.secondScore = null;
            //     this.thirdName = null;
            //     this.thirdScore = null;
            //     this.fourthName = null;
            //     this.fourthScore = null;
            //     this.fifthName = null;
            //     this.fifthScore = null;
            //     this.sixthName = null;
            //     this.sixthScore = null;
            //     this.$emit('gameInserted')
            //     return response.json();
            // })
            // .then(data => {
            //     console.log('Success:', data);
            // })
            // .catch(error => {
            //     console.error('Error:', error);
            // });
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