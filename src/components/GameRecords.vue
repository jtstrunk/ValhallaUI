<template>
    <div style="display: flex; flex-direction: row;">
        <div style="position: sticky; top: 50px; height: 455px;">
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
            <div style="display: flex; flex-direction: row;">
                <div class="section games">
                    <h3>Favorites</h3>
                    <button :class="['gamebtn', showingGames.includes('Dominion') ? 'btn-main' : 'btn-outline']"  
                        @click="toggleShowingGame('Dominion')">Dominion</button>
                    <button :class="['gamebtn', showingGames.includes('Heat') ? 'btn-main' : 'btn-outline']" 
                        @click="toggleShowingGame('Heat')">Heat</button>
                    <button :class="['gamebtn', showingGames.includes('Clank') ? 'btn-main' : 'btn-outline']" 
                        @click="toggleShowingGame('Clank')">Clank</button>
                    <button :class="['gamebtn', showingGames.includes('Lords of Waterdeep') ? 'btn-main' : 'btn-outline']" 
                        @click="toggleShowingGame('Lords of Waterdeep')">Lords of Wate</button>
                    <button :class="['gamebtn', showingGames.includes('Race for the Galaxy') ? 'btn-main' : 'btn-outline']" 
                        @click="toggleShowingGame('Race for the Galaxy')">Race for the</button>
                    <button :class="['gamebtn', showingGames.includes('Moonrakers') ? 'btn-main' : 'btn-outline']" 
                        @click="toggleShowingGame('Moonrakers')">Moonrakers</button>
                    <button :class="['gamebtn', showingGames.includes('Space Base') ? 'btn-main' : 'btn-outline']" 
                        @click="toggleShowingGame('Space Base')">Space Base</button>
                    <button id="clearbtn" @click="resetGames" style="margin-top: 25px;">Clear All</button>
                </div>
                <div class="section games">
                    <div class="games">
                        <h3>Themes</h3>
                        <button :class="['gamebtn', showingThemes.includes('space') ? 'btn-main' : 'btn-outline']"  
                            @click="toggleShowingTheme('space')">Space</button>
                        <button :class="['gamebtn', showingThemes.includes('medieval') ? 'btn-main' : 'btn-outline']" 
                            @click="toggleShowingTheme('medieval')">Medieval</button>
                        <button :class="['gamebtn', showingThemes.includes('fantasy') ? 'btn-main' : 'btn-outline']" 
                            @click="toggleShowingTheme('fantasy')">Fantasy</button>                
                    </div>
                    <div class="games">
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
        <div class="section">
            <div style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <h2 id="playerRecordedGames">{{ this.userName}}'s Recorded Games</h2>
                </div>
                <div style="margin-right: 5px; display: flex; flex-direction: row; width: 792px; flex-wrap: wrap;">
                    <div v-for="game in [...recentGames]">
                        <RecentGame :gameData="game" :isVisitor="isVisitor" :suggestedNames="suggestedNames" 
                            :showingGames="showingGames" :themeGames="themeGames" :typeGames="typeGames" 
                            :searchType="searchType" :startDate="startDate" :endDate="endDate"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import RecentGame from './RecentGame.vue'
import { userState } from '/src/state/userState'

export default {
    name: "Home",
    data(){
        return{
            userName: userState.username,
            deckBuilding: ['fakegame', 'Dominion', 'Moonrakers', 'Clank', 'Dune Imperium'],
            workerPlacement : ['fakegame', 'Puerto Rico', 'Dune Imperium', 'Lords of Waterdeep'],
            resourceManagement : ['fakegame', 'Catan', 'Space Base', 'Puerto Rico'],
            roleSelection : ['fakegame', 'Race for the Galaxy', 'Puerto Rico'],
            space: ['Moonrakers', 'Space Base', 'Dune Imperium', 'Race for the Galaxy'],
            medieval : ['Dominion', 'Puerto Rico', 'Lords of Waterdeep', 'Catan'],
            fantasy : ['Clank', 'Munchkin'],
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
        RecentGame
    },
    watch: {
        searchType() {
            console.log(this.searchType)
            this.resetGames();
        }
    },
    methods: {
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
</style>