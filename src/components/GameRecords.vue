<template>
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
        <div class="section">
            <div style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <h2 id="playerRecordedGames">{{ this.userName}}'s Recorded Games</h2>
                </div>
                <div style="margin-right: 5px; display: flex; flex-direction: row; width: 792px; flex-wrap: wrap;">
                    <div v-for="game in [...recentGames]">
                        <RecentGame :gameData="game" :isVisitor="isVisitor" :suggestedNames="suggestedNames" :showingGames="showingGames"/>
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
            recentGames: [],
            showingGames: [],
            suggestedNames: [],
            isVisitor: false,
        }
    },
    components: {
        RecentGame
    },
    methods: {
        toggleShowingGame(gameName){
            console.log(gameName);
            if(!this.showingGames.includes(gameName)) {
                this.showingGames.push(gameName);
            } else {
                this.showingGames = this.showingGames.filter(x => x != gameName)
            }
            console.log(this.showingGames);
        },
        resetGames(){
            this.showingGames = [];
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
.games {
    display: flex;
    flex-direction: column;
    height: 360px;
    position: sticky;
    top: 60px;
}
.games button {
    padding: 5px 4px;
    border-radius: 5px;
    margin-top: 7px;
    width: 100px;
}
.games h3 {
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