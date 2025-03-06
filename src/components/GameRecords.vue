<template>
    <div style="display: flex; flex-direction: row;">
        <div style="position: sticky; top: 50px; height: 455px;">
            <div class="section">
                <h3>Search Type</h3>
                <div style="display: flex; flex-direction: row; justify-content: space-around;">
                    <div class="searchType">
                        <input type="radio" id="exclusive" value="exclusive" v-model="searchType">
                        <label for="exclusive">match every</label>
                    </div>
                    <div class="searchType">
                        <input type="radio" id="inclusive" value="inclusive" v-model="searchType">
                        <label for="inclusive">match any</label>
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
                        <h3>Types</h3>
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
        <div class="section">
            <div style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <h2 id="playerRecordedGames">{{ this.userName}}'s Recorded Games</h2>
                </div>
                <div style="margin-right: 5px; display: flex; flex-direction: row; width: 792px; flex-wrap: wrap;">
                    <div v-for="game in [...recentGames]">
                        <RecentGame :gameData="game" :isVisitor="isVisitor" :suggestedNames="suggestedNames" 
                            :showingGames="showingGames" :themeGames="themeGames" :typeGames="typeGames" 
                            :searchType="searchType" :filtersApplied="filtersApplied"/>
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
            deckBuilding: ['Dominion', 'Moonrakers', 'Clank', 'Dune Imperium'],
            workerPlacement : ['Puerto Rico', 'Dune Imperium'],
            resourceManagement : ['Catan', 'Space Base', 'Puerto Rico'],
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
            searchType: 'exclusive'
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
    computed: {
        filtersApplied() {
            return (
                // this.showingGames.length == 0 && this.themeGames.length == 0 && this.typeGames.length == 0 
                this.typeGames.length == 0 && this.showingTypes.length == 0
                
                // tpyr games 0 and showing tpes has length
            );
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

        // this needs to be reworked to allow the user to click one selected and remove its restriction on it
        toggleShowingType(gameType) {
            if(this.searchType == 'inclusive') {
                if (!this.showingTypes.includes(gameType)) {
                    this.showingTypes.push(gameType);
                    this.typeGames = [...new Set([...this.typeGames, ...this[gameType]])];
                } else {
                    this.showingTypes = this.showingTypes.filter(x => x !== gameType);
                    this.typeGames = this.typeGames.filter(game => !this[gameType].includes(game));
                }
            } else if (this.searchType == 'exclusive') {
                // tricky because i need to compare

                if (this.showingTypes.length === 0) {
                    console.log('length of 0')
                    // If no types are currently selected, initialize typeGames with the games from the selected type
                    this.showingTypes.push(gameType);
                    this.typeGames = [...this[gameType]];
                } else {
                    console.log('already has a filter selected')
                    if(!this.showingTypes.includes(gameType)) {
                        this.showingTypes.push(gameType);
                        this.typeGames = this.typeGames.filter(game => this[gameType].includes(game));
                    } else {
                        this.showingTypes = this.showingGames.filter(x => x != gameType)
                    }
                    // Otherwise, keep only the games that are in both typeGames and the new gameType
                    // this.typeGames = this.typeGames.filter(game => this[gameType].includes(game));
                }
            }
            console.log('this.typeGames', this.typeGames)
            console.log('this.showingTypes', this.showingTypes)
        },
        resetGames(){
            this.showingGames = [];
            this.showingThemes = [];
            this.themeGames = [];
            this.showingTypes = [];
            this.typeGames = [];
        },
        async fetchGames(user) {
            axios.get(`http://127.0.0.1:8000/showgames/${user}`, {
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
            axios.get(`http://127.0.0.1:8000/getuseruniqueplayers/${user}`, {
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
}
.searchType input {
    margin-right: 5px;
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
.games .btn-outline {
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