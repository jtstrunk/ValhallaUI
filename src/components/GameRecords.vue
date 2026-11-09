<template>
    <div style="display: flex; flex-direction: column; align-items: center; overflow-x: hidden;">
        <div style="display: flex; flex-direction: row;" class="mobileContainer">
            <!-- mobile -->
            <div v-if="isMobile">
                <div class="section mobileHeader" style="display: flex; flex-direction: column;">
                    <div style="display: flex; flex-direction: row; justify-content: space-between;">
                        <h4>Search Type</h4>
                        <div style="display: flex; flex-direction: row; justify-content: space-around; width: 250px;">
                            <div class="searchType">
                                <input type="radio" id="exclusive" value="exclusive" v-model="searchType">
                                <label for="exclusive">Match Every</label>
                            </div>
                            <div class="searchType">
                                <input type="radio" id="inclusive" value="inclusive" v-model="searchType">
                                <label for="inclusive">Match Any</label>
                            </div>
                        </div>
                    </div>
                    <div style="">
                        <div style="display: flex; flex-direction: row; justify-content: space-between;">
                            <h4 style="margin-top: 8px;">Filter Between</h4>
                            <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 8px; margin-right: 5px; width: 230px;">
                                <button id="monthDates" class="dateFilters" @click="monthDates">This Month</button>
                                <button id="yearDates" class="dateFilters" @click="yearDates">This Year</button>
                                <button id="resetDates" class="dateFilters" @click="resetDates">Reset</button>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: row; justify-content: space-around;">
                            <div class="searchDate">
                                <label for="startDate">Start:</label>
                                <input type="date" id="startDate" class="date-input" v-model="startDate">
                            </div>
                            <div class="searchDate">
                                <label for="endDate">End:</label>
                                <input type="date" id="endDate" class="date-input" v-model="endDate">
                            </div>
                            
                        </div>
                    </div>
                    <div class="game-filter">
                        <label for="mobile-game-filter">Games</label>
                        <component :is="gameSelectComponent" v-model="selectedGameFilter"
                            inputId="mobile-game-filter" :options="orderedSupportedGames"
                            :placeholder="searchType === 'inclusive' ? 'Select games' : 'Select a game'"
                            :loading="supportedGamesLoading" :disabled="supportedGamesLoading || !!supportedGamesError"
                            showClear :showToggleAll="false" class="game-filter-select"
                            :pt="{ overlay: { class: 'game-filter-overlay', style: { backgroundColor: '#404040', color: 'white' } } }">
                            <template #value="{ placeholder }">
                                <span class="game-filter-names">{{ showingGames.length ? showingGames.join(', ') : placeholder }}</span>
                            </template>
                            <template v-if="searchType === 'inclusive'" #header>
                                <label class="game-filter-select-all">
                                    <Checkbox :modelValue="allGamesSelected" binary
                                        aria-label="Select all games"
                                        :disabled="orderedSupportedGames.length === 0"
                                        @update:modelValue="setAllGamesSelected" />
                                    Select all games
                                </label>
                            </template>
                        </component>
                    </div>
                    <div class="filterContainer" style="display: flex; flex-direction: row;">
                        <div class="games filterSection">
                            <h4>Favorites</h4>
                            <div class="test">
                                <button id="clearbtn" @click="resetGames">Clear All</button>
                                <button v-for="game in favoriteGames" :key="game.name"
                                    :class="['gamebtn', showingGames.includes(game.name) ? 'btn-main' : 'btn-outline']"
                                    @click="toggleShowingGame(game.name)">{{ game.label }}</button>
                            </div>
                        </div>
                        <div class="games filterSection">
                            <h3>Themes</h3>
                            <div class="test">
                                <button :class="['gamebtn', showingThemes.includes('space') ? 'btn-main' : 'btn-outline']"
                                    @click="toggleShowingTheme('space')">Space</button>
                                <button :class="['gamebtn', showingThemes.includes('fantasy') ? 'btn-main' : 'btn-outline']"
                                    @click="toggleShowingTheme('fantasy')">Fantasy</button>
                                <button :class="['gamebtn', showingThemes.includes('historical') ? 'btn-main' : 'btn-outline']"
                                    @click="toggleShowingTheme('historical')">Historical</button>                                
                            </div>
                        </div>
                        <div class="games filterSection">
                            <h3>Mechanics</h3>
                            <div class="test Mechanics">
                                <button :class="['gamebtn', showingTypes.includes('deckBuilding') ? 'btn-main' : 'btn-outline']"
                                    @click="toggleShowingType('deckBuilding')">Deck Building</button>
                                <button :class="['gamebtn', showingTypes.includes('resourceManagement') ? 'btn-main' : 'btn-outline']"
                                    @click="toggleShowingType('resourceManagement')">Resource Management</button>
                                <button :class="['gamebtn', showingTypes.includes('workerPlacement') ? 'btn-main' : 'btn-outline']"
                                    @click="toggleShowingType('workerPlacement')">Worker Placement</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- desktop -->
            <div v-if="!isMobile" class="desktop-filters">
                <div class="section">
                    <h3>Search Type</h3>
                    <div style="display: flex; flex-direction: row; justify-content: space-around;">
                        <div class="searchType">
                            <input type="radio" id="exclusive" value="exclusive" v-model="searchType">
                            <label for="exclusive">Match Every</label>
                        </div>
                        <div class="searchType">
                            <input type="radio" id="inclusive" value="inclusive" v-model="searchType">
                            <label for="inclusive">Match Any</label>
                        </div>
                    </div>
                </div>
                <div class="section game-filter">
                    <label for="desktop-game-filter">Games</label>
                    <component :is="gameSelectComponent" v-model="selectedGameFilter"
                        inputId="desktop-game-filter" :options="orderedSupportedGames"
                        :placeholder="searchType === 'inclusive' ? 'Select games' : 'Select a game'"
                        :loading="supportedGamesLoading" :disabled="supportedGamesLoading || !!supportedGamesError"
                        showClear :showToggleAll="false" class="game-filter-select"
                        :pt="{ overlay: { class: 'game-filter-overlay', style: { backgroundColor: '#404040', color: 'white' } } }">
                        <template #value="{ placeholder }">
                            <span class="game-filter-names">{{ showingGames.length ? showingGames.join(', ') : placeholder }}</span>
                        </template>
                        <template v-if="searchType === 'inclusive'" #header>
                            <label class="game-filter-select-all">
                                <Checkbox :modelValue="allGamesSelected" binary
                                    aria-label="Select all games"
                                    :disabled="orderedSupportedGames.length === 0"
                                    @update:modelValue="setAllGamesSelected" />
                                Select all games
                            </label>
                        </template>
                    </component>
                </div>
                <div class="mobileHide desktop-filter-categories">
                    <div class="section games">
                        <h3>Favorites</h3>
                        <button v-for="game in favoriteGames" :key="game.name"
                            :class="['gamebtn', showingGames.includes(game.name) ? 'btn-main' : 'btn-outline']"
                            @click="toggleShowingGame(game.name)">{{ game.label }}</button>
                        <button id="clearbtn" @click="resetGames" style="margin-top: 25px;">Clear All</button>
                    </div>
                    <div class="desktop-filter-groups">
                        <div class="section games">
                            <h3>Themes</h3>
                            <button :class="['gamebtn', showingThemes.includes('space') ? 'btn-main' : 'btn-outline']"
                                @click="toggleShowingTheme('space')">Space</button>
                            <button :class="['gamebtn', showingThemes.includes('fantasy') ? 'btn-main' : 'btn-outline']"
                                @click="toggleShowingTheme('fantasy')">Fantasy</button>
                            <button :class="['gamebtn', showingThemes.includes('historical') ? 'btn-main' : 'btn-outline']"
                                @click="toggleShowingTheme('historical')">Historical</button>
                        </div>
                        <div class="section games">
                            <h3>Mechanics</h3>
                            <button :class="['gamebtn', showingTypes.includes('deckBuilding') ? 'btn-main' : 'btn-outline']"
                                @click="toggleShowingType('deckBuilding')">Deck Building</button>
                            <button :class="['gamebtn', showingTypes.includes('resourceManagement') ? 'btn-main' : 'btn-outline']"
                                @click="toggleShowingType('resourceManagement')">Resource Management</button>
                            <button :class="['gamebtn', showingTypes.includes('workerPlacement') ? 'btn-main' : 'btn-outline']"
                                @click="toggleShowingType('workerPlacement')">Worker Placement</button>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <h3>Filter Between</h3>
                    <div style="display: flex; flex-direction: column; justify-content: space-around;">
                        <div class="searchDate">
                            <label for="startDate">Start Date:</label>
                            <input type="date" id="startDate" class="date-input" v-model="startDate">
                        </div>
                        <div class="searchDate">
                            <label for="endDate">End Date:</label>
                            <input type="date" id="endDate" class="date-input" v-model="endDate">
                        </div>
                        <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 8px;">
                            <button id="monthDates" class="dateFilters" @click="monthDates">This Month</button>
                            <button id="yearDates" class="dateFilters" @click="yearDates">This Year</button>
                            <button id="resetDates" class="dateFilters" @click="resetDates">Reset</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section mobileSection">
                <div style="display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <h2 id="playerRecordedGames">{{ this.userName}}'s Recorded Games</h2>
                    </div>
                    <div class="mobileCards" style="margin-right: 5px; display: flex; flex-direction: row; width: 792px; flex-wrap: wrap;">
                        <div v-for="game in [...recentGames]">
                            <RecentGame :gameData="game" :isVisitor="isVisitor" :suggestedNames="suggestedNames"
                                :showingGames="showingGames" :themeGames="themeGames" :typeGames="typeGames"
                                :searchType="searchType" :startDate="startDate" :endDate="endDate"/>
                        </div>
                        <div v-if="recentGames.length == 0" id="addRecord">
                            <h2 style="margin: 0px !important; padding-left: 10px; font-size: 18px;">It looks like you havent played a game yet</h2>
                            <p>Click below to add your first game</p>
                            <img id="addRecordImg" src="/src/assets/icons/add.webp" @click="this.$router.push('addrecord');">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import { mapState } from 'pinia'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import Checkbox from 'primevue/checkbox'
import { useSupportedGamesStore } from '@/stores/supportedGames'
import RecentGame from './RecentGame.vue'
import { userState } from '/src/state/userState'

export default {
    name: "Home",
    data(){
        return{
            userName: userState.username,
            isMobile: window.innerWidth < 440,
            favoriteGames: [
                { name: 'Dominion', label: 'Dominion' },
                { name: 'Race for the Galaxy', label: 'Race for the' },
                { name: 'Puerto Rico', label: 'Puerto Rico' },
                { name: 'Clank', label: 'Clank' },
                { name: 'Lords of Waterdeep', label: 'Lords of Wate' },
                { name: 'Space Base', label: 'Space Base' },
                { name: 'Duel for Middle-Earth', label: 'Duel for Middl' },
            ],
            deckBuilding: ['fakegame', 'Dominion', 'Moonrakers', 'Clank', 'Clank Catacombs', 'Dune Imperium', 'Slay the Spire', 'Star Wars The Deckbuilding Game'],
            workerPlacement : ['fakegame', 'Puerto Rico', 'Dune Imperium', 'Lords of Waterdeep'],
            resourceManagement : ['fakegame', 'Catan', 'Space Base', 'Puerto Rico', 'Race for the Galaxy', 'Dune Imperium', 'Lords of Waterdeep'],
            roleSelection : ['fakegame', 'Race for the Galaxy', 'Puerto Rico'],
            space: ['Star Wars The Deckbuilding Game', 'Moonrakers', 'Space Base', 'Dune Imperium', 'Race for the Galaxy', 'Cosmic Encounter'],
            historical : ['Dominion', 'Puerto Rico', 'Catan', '7 Wonders', '7 Wonders Duel'],
            fantasy : ['Clank', 'Clank Catacombs', 'Munchkin', 'Slay the Spire', 'Lords of Waterdeep', 'Duel for Middle-Earth', 'Boss Monster', 'Root'],
            recentGames: [],
            showingGames: [],
            showingThemes: [],
            themeGames: [],
            showingTypes: [],
            typeGames: [],
            suggestedNames: [],
            isVisitor: false,
            searchType: 'exclusive',
            startDate: '2023-06-13',
            endDate: new Date().toISOString().slice(0, 10),
        }
    },
    components: {
        RecentGame,
        Checkbox
    },
    computed: {
        ...mapState(useSupportedGamesStore, {
            supportedGames: 'supportedGames',
            supportedGamesLoading: 'loading',
            supportedGamesError: 'error'
        }),
        orderedSupportedGames() {
            const playCounts = new Map();
            for (const game of this.recentGames) {
                playCounts.set(game.gamename, (playCounts.get(game.gamename) ?? 0) + 1);
            }
            return [...this.supportedGames].sort((first, second) =>
                (playCounts.get(second) ?? 0) - (playCounts.get(first) ?? 0) ||
                first.localeCompare(second)
            );
        },
        gameSelectComponent() {
            return this.searchType === 'inclusive' ? MultiSelect : Select;
        },
        allGamesSelected() {
            return this.orderedSupportedGames.length > 0 &&
                this.orderedSupportedGames.every(game => this.showingGames.includes(game));
        },
        selectedGameFilter: {
            get() {
                return this.searchType === 'inclusive' ? this.showingGames : (this.showingGames[0] ?? null);
            },
            set(value) {
                this.showingGames = this.searchType === 'inclusive' ? (value ?? []) : (value == null ? [] : [value]);
            }
        }
    },
    watch: {
        searchType() {
            console.log(this.searchType)
            this.resetGames();
        }
    },
    methods: {
        setAllGamesSelected(checked) {
            this.showingGames = checked ? [...this.orderedSupportedGames] : [];
        },
        toggleShowingGame(gameName){
            if(this.searchType == 'inclusive') { // if showingGames doesnt contain game add it, if it does remove it
                if(!this.showingGames.includes(gameName)) {
                    this.showingGames.push(gameName);
                } else {
                    this.showingGames = this.showingGames.filter(x => x != gameName)
                }
            } else if (this.searchType == 'exclusive') { // setting show games to new list
                console.log('at', gameName)
                console.log(this.showingGames)
                if (!this.showingGames.includes(gameName)) {
                    this.showingGames = [gameName];
                } else {
                    this.showingGames = [];
                }
            }
            
        },
        toggleShowingTheme(themeName) {
            if(this.searchType == 'inclusive') {
                if (!this.showingThemes.includes(themeName)) {
                    this.showingThemes.push(themeName);
                    this.themeGames = [...new Set([...this.themeGames, ...this[themeName]])];
                } else {
                    this.showingThemes = this.showingThemes.filter(x => x != themeName);
                    this.themeGames = this.themeGames.filter(game => !this[themeName].includes(game));
                }
            } else if (this.searchType == 'exclusive') {
                if (!this.showingThemes.includes(themeName)) {
                    this.showingThemes = [themeName];
                    this.themeGames = [];
                    this.themeGames = [...new Set([...this.themeGames, ...this[themeName]])];
                } else {
                    this.showingThemes = [];
                    this.themeGames = [];
                }
                
            }
        },
        // this could be reworked so that you can select multiple Mechanics on excluisve
        toggleShowingType(gameType) {
            if(this.searchType == 'inclusive') {
                if (!this.showingTypes.includes(gameType)) {
                    this.showingTypes.push(gameType);
                    this.typeGames = [...new Set([...this.typeGames, ...this[gameType]])];
                } else {
                    this.showingTypes = this.showingTypes.filter(x => x != gameType);
                    this.typeGames = this.typeGames.filter(game => !this[gameType].includes(game));
                }
            } else if (this.searchType == 'exclusive') {
                if (!this.showingTypes.includes(gameType)) {
                    this.showingTypes = [gameType];
                    this.typeGames = [];
                    this.typeGames = [...new Set([...this.typeGames, ...this[gameType]])];
                } else {
                    this.showingTypes = [];
                    this.typeGames = [];
                }
            }
        },
        monthDates() {
            const today = new Date();
            const startDate = new Date();
            startDate.setDate(today.getDate() - 28);
            this.startDate = startDate.toISOString().slice(0, 10);
            this.endDate = today.toISOString().slice(0, 10);
        },
        yearDates() {
            const today = new Date();
            const startDate = new Date();
            startDate.setDate(today.getDate() - 365);
            this.startDate = startDate.toISOString().slice(0, 10);
            this.endDate = today.toISOString().slice(0, 10);
        },
        resetDates(){
            this.startDate = '2023-06-13';
            this.endDate = new Date().toISOString().slice(0, 10);
        },
        resetGames(){
            this.showingGames = [];
            this.showingThemes = [];
            this.themeGames = [];
            this.showingTypes = [];
            this.typeGames = [];
        },
        async fetchGames(user) {
            axios.get(`${import.meta.env.VITE_API_URL}/showgames/${user}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log(response.data)
                this.recentGames = response.data;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
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
    created() {
        let searchName = this.userName;
        if(searchName == 'Guest') {
            searchName = 'josh'
            this.isVisitor = true;
        }
        this.fetchGames(searchName);
        this.fetchUsersPlayedWith(this.userName);
    }
}
</script>

<style>
.desktop-filters {
    position: sticky;
    top: 50px;
    align-self: flex-start;
    display: grid;
    gap: 10px;
    width: 260px;
    flex-shrink: 0;
    margin: 10px;
}
.desktop-filters .section {
    margin: 0;
    min-width: 0;
}
.desktop-filter-categories {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}
.desktop-filter-groups {
    display: grid;
    gap: 10px;
}
.desktop-filters .games {
    height: auto;
}
.desktop-filters .game-filter {
    width: 100%;
}
.game-filter {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    width: 260px;
    max-width: 100%;
    box-sizing: border-box;
    gap: 5px;
    margin-bottom: 10px;
}
.desktop-filters h3,
.mobileHeader h3,
.mobileHeader h4,
.game-filter > label {
    color: white;
    font-family: 'Manolo Mono', sans-serif !important;
    font-weight: bold;
}
.desktop-filters .game-filter > label {
    font-size: 1.17em;
}
.game-filter-select {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 8px;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    background-color: #404040;
    color: white;
    padding: 7px 10px;
    border-radius: 5px;
}
.game-filter-select .p-multiselect-label-container,
.game-filter-select .p-multiselect-label,
.game-filter-select .p-select-label {
    min-width: 0;
    padding: 0;
    white-space: normal;
}
.game-filter-names {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
    overflow-wrap: anywhere;
    line-height: 1.4;
    max-height: 4.2em;
}
.game-filter-select .p-select-clear-icon,
.game-filter-select .p-multiselect-clear-icon {
    position: static;
    transform: none;
    margin: 0;
    grid-column: 2;
    grid-row: 1;
    cursor: pointer;
}
.game-filter-select .p-select-dropdown,
.game-filter-select .p-multiselect-dropdown {
    grid-column: 3;
    grid-row: 1;
    width: 16px;
}
.game-filter-select-all {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    cursor: pointer;
}
.game-filter-overlay {
    background-color: #404040;
    color: white;
    border-radius: 5px;
}
.game-filter-overlay .p-select-option,
.game-filter-overlay .p-multiselect-option,
.game-filter-overlay .p-multiselect-header {
    padding: 6px 10px;
    gap: 8px;
}
.game-filter-overlay .p-select-option:hover,
.game-filter-overlay .p-select-option-selected,
.game-filter-overlay .p-select-option.p-focus,
.game-filter-overlay .p-multiselect-option:hover,
.game-filter-overlay .p-multiselect-option-selected,
.game-filter-overlay .p-multiselect-option.p-focus {
    background-color: #138496;
}
.game-filter-overlay .p-checkbox-box {
    background-color: #404040;
    border: 1px solid white;
    border-radius: 3px;
    width: 18px;
    height: 18px;
}
.game-filter-overlay .p-checkbox-checked .p-checkbox-box {
    background-color: #17a2b8;
}
.searchType label {
    color: #fff;
    font-family: 'Manolo Mono', sans-serif !important;
}
.searchType input {
    margin-right: 5px;
}

.searchDate {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 5px;
}
.searchDate label {
    color: #fff;
    font-family: 'Manolo Mono', sans-serif !important;
    margin-right: 10px;
}
.searchDate input {
    background-color: #3A3B3C;
    color: #fff;
    border: 0px;
    padding: 5px;
    border-radius: 4px;
    font-family: 'Manolo Mono', sans-serif;
}
.dateFilters {
    color: #17a2b8 !important;
    background: transparent;
    border: 2px solid #17a2b8;
    border-radius: 5px;
    height: 21px;
    line-height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;  
}
.dateFilters:hover {
    color: #fff !important;
    background-color: #17a2b8;
    border: 2px solid #17a2b8;
    transition: .5s;
}

.games {
    display: flex;
    flex-direction: column;
    height: 360px;
}
.games button {
    padding: 5px 4px;
    border-radius: 5px;
    margin-top: 7px;
    width: 100px;
}
h3 {
    color: white;
    margin: 0px 0px 5px 0px;
    font-family: 'Manolo Mono', sans-serif !important;
}
.games .btn-main {
    color: #fff !important;
    background-color: #17a2b8;
    border: 2px solid #17a2b8;
}
.btn-main:hover {
    color: #17a2b8 !important;
    background-color: #138496;
    border: 2px solid #17a2b8;
    background: transparent;
    transition: .5s;
}
.btn-outline {
    color: #17a2b8 !important;
    background: transparent;
    border: 2px solid #17a2b8;
}
.btn-outline:hover {
    color: #fff !important;
    background-color: #17a2b8;
    border: 2px solid #17a2b8;
    transition: .5s;
}

.games #clearbtn {
    color: #a73939  !important;
    background: transparent;
    border: 2px solid #a73939 ;
}

.games #clearbtn:hover {
    color: #fff !important;
    background-color: #a73939;
    border: 2px solid #a73939;
    transition: .5s;
}

#playerRecordedGames{
    margin: 0px;
    margin-left: 10px;
}

#addRecord {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 150px;
    margin-bottom: 265px;
    margin-left: 200px;
}

#addRecordImg {
    width: 120px;
    height: 120px;
    margin-top: 10px;
}
#addRecordImg:hover {
    cursor: pointer !important;
}

@media (max-width: 	420px) {
    h4 {
        color: white;
        margin: 0px 0px 5px 0px;
        font-family: 'Manolo Mono', sans-serif !important;
    }
    .mobileHide {
        display: none !important;
    }
    .mobileContainer {
        flex-direction: column !important;
    }
    .mobileSection {
        width: 395px !important;
    }
    .mobileCards {
        width: 375px !important;
        margin: 0px !important;
    }
    .mobileHeader {
        width: 395px;
        border-radius: 8px;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
        padding: 10px !important;
        margin: 0px 10px !important;
        background-color: #242526;
    }
    .mobileHeader .game-filter {
        width: 100%;
    }

    .filterContainer {
        width: 395px !important;
        overflow-x: scroll;
        flex-direction: row !important;
    }
    .filterSection {
        display: flex;
        flex-direction: column !important;
    }
    .games {
        display: flex;
        flex-direction: row;
        height: 70px;
        margin-right: 15px;
        margin-top: 0px;
        margin-bottom: 0px;
    }
    .test {
        display: flex;
        flex-direction: row;
    }
    .test button {
        padding: 5px 4px;
        border-radius: 5px;
        margin-top: 7px;
        width: 100px !important;
        height: 32px;
        margin: 0 3px;
        white-space: nowrap !important;
    }
    .Mechanics button {
        width: 150px !important;
    }

    #addRecord {
        margin-left: 0px;
    }
    #addRecordImg {
        margin-bottom: 120px !important;
    }
}
</style>