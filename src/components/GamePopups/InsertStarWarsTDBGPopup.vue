<template>
    <div id="popups" class="gamepopup">
        <div class="popupContainer">
            <p>{{ Type === 'Update' ? 'Update' : 'Add a' }} Star Wars The Deckbuilding Game record</p>
            <div class="players">
                <div class="playerSection">
                    <label for="winnerName">Winner</label>
                    <AutoComplete v-model="playerNames.winnerName" :suggestions="filteredNames" optionLabel="name"
                        @complete="searchName" @item-select="updateName($event, 'winnerName')"
                        @change="inputName($event, 'winnerName')" id="winnerName"
                        class="custom-autocomplete" optionValue="name"
                        :pt="{
                            root: { class: 'customAutocomplete' },
                            option: { style: { color: 'white', padding: '4px 8px' } },
                            overlay: { style: { backgroundColor: '#404040', transform: 'translateY(8px)', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' } }
                        }" />
                    <label for="winnerScore">Score</label>
                    <Input v-model.number="winnerScore" id="winnerScore" type="text" inputmode="numeric"></Input>
                </div>
                <div class="playerSection">
                    <label for="secondName">Second</label>
                    <AutoComplete v-model="playerNames.secondName" :suggestions="filteredNames" optionLabel="name"
                        @complete="searchName" @item-select="updateName($event, 'secondName')"
                        @change="inputName($event, 'secondName')" id="secondName"
                        class="custom-autocomplete" optionValue="name"
                        :pt="{
                            root: { class: 'customAutocomplete' },
                            option: { style: { color: 'white', padding: '4px 8px' } },
                            overlay: { style: { backgroundColor: '#404040', transform: 'translateY(8px)', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' } }
                        }" />
                    <label for="secondScore">Score</label>
                    <Input v-model.number="secondScore" id="secondScore" type="text" inputmode="numeric"></Input>
                </div>
            </div>
            <div class="winner-team-row">
                <div class="team-side-box">
                    <span class="team-label">Winning side</span>
                    <div class="team-value">{{ winnerTeam }}</div>
                </div>
                <button type="button" class="swap-button" @click="swapTeams" aria-label="Swap teams" :disabled="saving">
                    Swap
                </button>
                <div class="team-side-box">
                    <span class="team-label">Second place</span>
                    <div class="team-value">{{ secondTeam }}</div>
                </div>
            </div>
            <p v-if="error" role="alert">{{ error }}</p>
            <div v-if="Type === 'Update'" class="date-submit-row">
                <div class="date-row">
                    <label for="starWarsDate">Date</label>
                    <Input v-model="date" id="starWarsDate" />
                </div>
                <button class="btn-primary" @click="submitRecord" :disabled="isVisitor || saving">
                    {{ saving ? 'Saving...' : 'Update Record' }}
                </button>
            </div>
            <button v-else class="btn-primary" @click="submitRecord" :disabled="isVisitor || saving">
                {{ saving ? 'Saving...' : 'Submit Record' }}
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { userState } from '@/state/userState'

export default {
    name: 'InsertStarWarsTDBGPopup',
    inheritAttrs: false,
    props: {
        Type: { type: String, default: 'Insert' },
        GameData: Object
    },
    emits: ['gameInserted'],
    data() {
        return {
            userName: userState.username,
            userID: userState.userID,
            isVisitor: userState.username === 'Guest',
            playerNames: {
                winnerName: this.GameData?.winnername ?? null,
                secondName: this.GameData?.secondname ?? null
            },
            winnerScore: this.Type === 'Update' ? this.GameData?.winnerscore ?? null : 3,
            secondScore: this.Type === 'Update' ? this.GameData?.secondscore ?? null : null,
            winnerTeam: this.Type === 'Update' ? this.GameData?.winningteam ?? null : 'Rebel Alliance',
            secondTeam: this.Type === 'Update' ? this.GameData?.secondteam ?? null : 'Galactic Empire',
            date: this.GameData?.date ?? null,
            suggestedNames: [],
            filteredNames: [],
            saving: false,
            error: null
        }
    },
    methods: {
        swapTeams() {
            const currentWinner = this.winnerTeam;
            this.winnerTeam = this.secondTeam;
            this.secondTeam = currentWinner;
        },
        searchName(event) {
            this.filteredNames = this.suggestedNames.filter(player =>
                player.name.toLowerCase().includes(event.query.toLowerCase())
            );
        },
        updateName(selectedName, field) {
            this.playerNames[field] = typeof selectedName.value === 'object'
                ? selectedName.value.name : selectedName.value;
        },
        inputName(input, field) {
            this.playerNames[field] = typeof input.value === 'object' && input.value !== null
                ? input.value.name : input.value;
        },
        async fetchUsersPlayedWith() {
            if (this.isVisitor) {
                this.suggestedNames = [{ name: 'Player 1' }, { name: 'Player 2' }];
                return;
            }
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/getuseruniqueplayers/${encodeURIComponent(this.userName)}`,
                    { withCredentials: false, headers: { 'Content-Type': 'application/json' } }
                );
                this.suggestedNames = response.data;
                if (!this.suggestedNames.some(player => player.name === this.userName)) {
                    this.suggestedNames.unshift({ name: this.userName });
                }
            } catch (error) {
                console.error('Error fetching player suggestions:', error);
                this.error = 'Unable to load player suggestions. You can still enter names manually.';
            }
        },
        async submitRecord() {
            if (this.isVisitor || this.saving) return;
            if (this.Type === 'Update' && !this.GameData?.gameid) {
                this.error = 'Cannot update this record without a game ID.';
                return;
            }
            this.saving = true;
            this.error = null;
            const updating = this.Type === 'Update';
            const record = {
                ...(updating
                    ? { gameid: this.GameData.gameid }
                    : { posterid: this.userID, gamename: 'Star Wars The Deckbuilding Game' }),
                winnername: this.playerNames.winnerName,
                winnerscore: this.winnerScore,
                secondname: this.playerNames.secondName,
                secondscore: this.secondScore,
                winningteam: this.winnerTeam,
                secondteam: this.secondTeam,
                date: this.date
            };
            try {
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/${updating ? 'updategame' : 'insertgame'}`,
                    record,
                    { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
                );
                this.$emit('gameInserted');
            } catch (error) {
                console.error('Error saving Star Wars record:', error);
                this.error = 'Unable to save the record. Please try again.';
            } finally {
                this.saving = false;
            }
        }
    },
    created() {
        this.fetchUsersPlayedWith();
    }
}
</script>

<style scoped>
.gamepopup {
    width: min(92vw, 380px) !important;
    max-height: 90vh;
    overflow-y: auto;
    overflow-x: hidden;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #242526;
    border-radius: 8%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    text-align: center;
    color: white;
    z-index: 1001;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
}
.popupContainer {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
}
.players {
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 10px;
}
.playerSection, .date-row {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-align: left;
}
.date-submit-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: end;
    gap: 10px;
}
.date-submit-row .btn-primary {
    align-self: end;
    width: 100%;
    box-sizing: border-box;
}
.date-row input, .date-submit-row .btn-primary {
    height: 34px;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 18px;
}
.playerSection :deep(.p-autocomplete-input) {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
}
.customAutocomplete, .playerSection input, .date-row input {
    background: #404040;
    border: 1px solid #404040;
    color: white;
    padding: 6px;
    border-radius: 5px;
    width: 100%;
    box-sizing: border-box;
}
.winner-team-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    gap: 8px;
    align-items: center;
}
.team-side-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.team-label {
    color: #d0d0d0;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}
.team-value {
    font-weight: 600;
}
.swap-button, .btn-primary {
    background: #337ab7;
    color: white;
    border: none;
    padding: 7px 10px;
    cursor: pointer;
}
.swap-button {
    border-radius: 999px;
}
.btn-primary {
    align-self: center;
    border-radius: 5px;
}
button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
@media (max-width: 420px) {
    .gamepopup {
        width: min(92vw, 360px) !important;
    }
}
</style>
