<template>
    <div id="popups" class="gamepopup" v-if="this.showDialog"> 
        <div class="popupContainer">
            <p v-if="insertingGameName != '' && popupType !== 'Update'" style="color: white; display: inline-block;">Add a {{ this.insertingGameName }} record</p>
            <p v-else-if="insertingGameName != ''" style="color: white; display: inline-block;">Update {{ this.insertingGameName }} record</p>
            <div v-if="insertingGameName == ''" style="color: white; display: inline-block; margin: 16px 0;">
                <span>Add a </span>
                <input v-model="insertingCustomGameName" placeholder="Custom Game Name">
                <span> record</span>
            </div>

            <div class="duel-layout">
                <div class="name-row">
                    <div class="playerSection dual-player-section">
                        <label for="winnerName">Winner</label>
                        <AutoComplete v-model="winnerName" :suggestions="filteredNames" optionLabel="name"
                            @complete="searchName" @item-select="updateName($event, 'winner')" id="winnerName"
                            class="custom-autocomplete" optionValue="name" @change="inputName($event, 'winner')" @keydown="handleKeyDown($event, 'winner')"
                            :pt="{
                                root: { class: 'customAutocomplete' },
                                option: { style: { color: 'white', padding: '4px 8px'} },
                                overlay: { style: { backgroundColor: '#404040', transform: 'translateY(8px)', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'} }
                            }"></AutoComplete>
                    </div>

                    <div class="playerSection dual-player-section">
                        <label for="secondName">Second</label>
                        <AutoComplete v-model="secondName" :suggestions="filteredNames" optionLabel="name"
                            @complete="searchName" @item-select="updateName($event, 'second')" id="secondName"
                            class="custom-autocomplete" optionValue="name" @change="inputName($event, 'second')" @keydown="handleKeyDown($event, 'second')"
                            :pt="{
                                root: { class: 'customAutocomplete' },
                                option: { style: { color: 'white', padding: '4px 8px'} },
                                overlay: { style: { backgroundColor: '#404040', transform: 'translateY(8px)', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'} },
                                pcInputText: { style: { '::placeholder': { color: '#2e6da4' } } }
                            }"></AutoComplete>
                    </div>
                </div>

                <div class="win-condition-header">Win Condition</div>

                <div class="option-grid option-grid-top">
                    <div class="option-row option-row-long">
                        <label for="ring">Quest for the Ring</label>
                        <input type="checkbox" :checked="victoryType === 'Quest for the Ring'" @change="toggleMiddleEarthVictoryType('Quest for the Ring')" class="label-checkbox" id="ring" aria-label="Quest for the Ring" />
                    </div>

                    
                    <div class="option-row option-row-short">
                        <label for="support">Support of the Races</label>
                        <input type="checkbox" :checked="victoryType === 'Support of the Races'" @change="toggleMiddleEarthVictoryType('Support of the Races')" class="label-checkbox" id="support" aria-label="Support of the Races" />
                    </div>
                </div>

                <div class="option-grid">
                    <div class="option-row option-row-long">
                        <label for="domination">Domination</label>
                        <input type="checkbox" :checked="victoryType === 'Domination of Middle-Earth'" @change="toggleMiddleEarthVictoryType('Domination of Middle-Earth')" class="label-checkbox" id="domination" aria-label="Domination of Middle-Earth" />
                    </div>

                    <div class="option-row option-row-short">
                        <label for="tieBreaker">Tie Breaker</label>
                        <input type="checkbox" :checked="victoryType === 'Tie Breaker'" @change="toggleMiddleEarthVictoryType('Tie Breaker')" class="label-checkbox" id="tieBreaker" aria-label="Tie Breaker" />
                    </div>
                </div>

                <div class="winner-team-row">
                    <div class="team-side-box winner-side">
                        <span class="team-label">Winning side</span>
                        <div class="team-value">{{ winnerTeam }}</div>
                    </div>

                    <button type="button" class="swap-button" @click="swapTeams" aria-label="Swap teams">
                        Swap
                    </button>

                    <div class="team-side-box second-side">
                        <span class="team-label">Second place</span>
                        <div class="team-value">{{ secondTeam }}</div>
                    </div>
                </div>

                <div v-if="popupType === 'Update'" class="date-submit-row">
                    <div class="date-row">
                        <label for="duelDate">Date</label>
                        <Input v-model="date" id="duelDate"></Input>
                    </div>
                    <div class="submit-wrap">
                        <button class="btn-primary" @click="handleDuelSubmit" :disabled="isVisitor">Update Record</button>
                    </div>
                </div>
                <div v-else class="submit-wrap single-submit">
                    <button class="btn-primary" @click="handleDuelSubmit" :disabled="isVisitor">Submit Record</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import { userState } from "@/state/userState"

export default {
    inheritAttrs: false,
    name: "Add Record",
    props: {
        Type: String,
        GameData: Object
    },
    data(){
        return{
            showDialog: true,
            userName: userState.username,
            userID: userState.userID,
            isVisitor: false,
            popupType: this.Type || "Insert",
            insertingGameName: 'Duel for Middle-Earth',
            filteredNames: [],
            gameID: null,
            gamedata: this.GameData || null,
            winnerTeam: 'Sauron',
            secondTeam: 'The Fellowship',
            victoryType: null,
            winnerName: null,
            secondName: null,
            date: this.GameData?.date ?? null,
        }
    },
    methods: {
        handleDuelSubmit() {
            if (this.popupType === 'Update') {
                this.updateRecord();
                return;
            }
            this.submitDuelForMiddleEarthRecord();
        },
        swapTeams() {
            const currentWinner = this.winnerTeam;
            this.winnerTeam = this.secondTeam;
            this.secondTeam = currentWinner;
        },
        toggleMiddleEarthVictoryType(type) {
            this.victoryType = this.victoryType === type ? null : type;
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
        submitDuelForMiddleEarthRecord() {
            let insertObject = {
                "posterid": this.userID,
                "gamename": this.insertingGameName,
                "winnername": this.winnerName,
                "winnerscore": 0,
                "secondname": this.secondName,
                "secondscore": 0,
                "thirdname": null,
                "thirdscore": null,
                "fourthname": null,
                "fourthscore": null,
                "fifthname": null,
                "fifthscore": null,
                "sixthname": null,
                "sixthscore": null,
                "seventhname": null,
                "seventhscore": null,
                "wincondition": this.victoryType ?? null,
                "winningteam": this.winnerTeam ?? 'Sauron',
                "secondteam": this.secondTeam ?? 'The Fellowship',
                date: this.date ?? null
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
            .catch(error => {
                console.error('Error:', error);
            });
        },
        updateRecord(){
            let insertObject = {
                "gameid": this.gameID,
                "winnername": this.winnerName,
                "winnerscore": 0,
                "secondname": this.secondName,
                "secondscore": 0,
                "thirdname": null,
                "thirdscore": null,
                "fourthname": null,
                "fourthscore": null,
                "fifthname": null,
                "fifthscore": null,
                "sixthname": null,
                "sixthscore": null,
                "seventhname": null,
                "seventhscore": null,
                "wincondition": this.victoryType ?? null,
                "winningteam": this.winnerTeam ?? 'Sauron',
                "secondteam": this.secondTeam ?? 'The Fellowship',
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
            .then(data => {
                console.log('Success:', data);
                this.$emit('gameInserted');
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
        this.fetchUsersPlayedWith(searchName);

        if(this.popupType == 'Update') {
            this.winnerName = this.gamedata.winnername;
            this.secondName = this.gamedata.secondname;
            this.victoryType = this.gamedata.wincondition ?? null;
            this.winnerTeam = this.gamedata.winningteam ?? 'Sauron';
            this.secondTeam = this.gamedata.secondteam ?? 'The Fellowship';
            this.gameID = this.gamedata.gameid;
            this.date = this.gamedata.date;

            console.log('Updating game with ID:', this.gamedata);
        }
    }
}
</script>

<style scoped>
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

.gamepopup,
.gamepopup * {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
    font-weight: 400;
}

.gamepopup {
    width: min(92vw, 380px) !important;
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
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 25px;
    padding: 8px 6px 12px;
    box-sizing: border-box;
}

.duel-layout {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: calc(100% - 8px);
    max-width: 320px;
    margin: 12px auto 0;
    padding-left: 0;
    padding-right: 0;
}

.win-condition-header {
    color: white;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    margin-top: 2px;
    margin-bottom: -2px;
}

.name-row,
.option-grid,
.winner-team-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
    align-items: start;
}

.option-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 10px;
    width: 100%;
    align-items: center;
}

.option-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 16px;
    align-items: center;
    gap: 6px;
    width: 100%;
    color: white;
    font-size: 13px;
    min-height: 20px;
    box-sizing: border-box;
}

.option-row-long {
    width: 100%;
}

.option-row-short {
    width: 100%;
}

.option-row label {
    display: block;
    text-align: left;
    white-space: nowrap;
    overflow: visible;
    text-overflow: unset;
    font-size: 13px;
    margin: 0;
    min-width: 0;
    line-height: 1.2;
}

.option-row input[type="checkbox"],
.option-row .label-checkbox {
    width: 14px;
    height: 14px;
    min-width: 14px;
    margin: 0;
    justify-self: end;
    align-self: center;
}

.dual-player-section {
    width: 100% !important;
    margin-bottom: 0;
    max-width: 100%;
    align-items: stretch;
    gap: 4px;
    padding-left: 0;
    padding-right: 0;
}

.playerSection label {
    margin-bottom: 4px;
    display: block;
    width: 100%;
    text-align: left;
    padding-left: 0;
}

.submit-wrap {
    margin-top: 2px;
    display: flex;
    justify-content: center;
}

.winner-team-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 8px;
    width: 100%;
    color: white;
}

.team-side-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: transparent;
    border: none;
    border-radius: 0;
    padding: 0;
    min-height: 0;
    box-sizing: border-box;
}

.team-label {
    color: #d0d0d0;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.team-value {
    color: white;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
}

.swap-button {
    background: #337ab7;
    color: white;
    border: none;
    border-radius: 999px;
    padding: 7px 10px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    min-width: 54px;
}

.winner-team-row label,
.date-row label {
    text-align: left;
    color: white;
    font-size: 14px;
    display: block;
    width: 100%;
    padding-left: 0;
}

.date-row input {
    width: 100%;
    background: #404040;
    color: white;
    border: 1px solid #404040;
    border-radius: 5px;
    padding: 7px 8px;
    height: 34px;
    box-sizing: border-box;
}

.date-submit-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    gap: 10px;
    width: 100%;
}

.date-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;
    width: 100%;
    color: white;
    align-items: center;
}

.single-submit {
    display: flex;
    justify-content: center;
}

.customAutocomplete {
    background-color: #404040;
    border: 1px solid #404040;
    color: white;
    padding: 6px;
    border-radius: 5px;
    width: 100%;
    max-width: 150px;
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
        width: min(92vw, 360px) !important;
    }
    .popupContainer {
        width: 100%;
        padding-left: 4px;
        padding-right: 4px;
    }
    .duel-layout {
        width: calc(100% - 6px);
    }
}
</style>