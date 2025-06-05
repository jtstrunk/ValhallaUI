<template>
    <div style="display: flex; flex-direction: column; align-items: center; overflow-x: hidden;">
        <div style="background-color: #404040; padding: 20px; border-radius: 4px; margin-top: 15px;">
            <h2>1v1 Stats</h2>
            <div style="display: flex; flex-direction: column; margin-bottom: 8px;">
                <label style="color: white;" for="playerOneName">First Player</label>
                <AutoComplete v-model="playerOneName" :suggestions="filteredNames"  optionLabel="name"
                    @complete="searchName" @item-select="updateName($event, 'playerOne')" id="playerOneName"
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
            <div style="display: flex; flex-direction: column; margin-bottom: 8px;">
                <label style="color: white;" for="playerTwoName">Second Player</label>
                <AutoComplete v-model="playerTwoName" :suggestions="filteredNames"  optionLabel="name"
                    @complete="searchName" @item-select="updateName($event, 'playerTwo')" id="playerTwoName"
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
            <div style="display: flex; flex-direction: column; margin-bottom: 8px;">
                <label style="color: white;" for="gamename">Game Name</label>
                <input v-model="gameName" id="gamename">
            </div>
            <button @click="fetchSpecificInformation()">Get Specific Stats</button>
            <button @click="fetchGeneralInformation()">Get General Stats</button>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import RecentGame from './RecentGame.vue'
import { userState } from '/src/state/userState'

export default {
    name: "Profile",
    data(){
        return{
            userName: this.$route.params.username,
            logginUser: userState.username,
            logginUserID: userState.userID,
            playerOneName: null,
            playerTwoName: null,
            gameName: null,
            filteredNames: [],
        }
    },
    components: {
        RecentGame
    },
    methods: {
        showpopup(term) {
            this.showingList = term;
            this.showDialog = true;
        },
        fetchGeneralInformation() {
            console.log(this.playerOneName)
            console.log(this.playerTwoName)
            console.log(this.gameName)
            this.fetchGeneralHeadtoHeadStats(this.playerOneName, this.playerTwoName)
        },
        fetchSpecificInformation() {
            console.log(this.playerOneName)
            console.log(this.playerTwoName)
            console.log(this.gameName)
            this.fetchSpecificHeadtoHeadStats(this.playerOneName, this.playerTwoName, this.gameName)
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
        async fetchGeneralHeadtoHeadStats(userone, usertwo) {
            console.log('url', `${import.meta.env.VITE_API_URL}/getanygameheadtohead/${userone}/${usertwo}`)
            axios.get(`${import.meta.env.VITE_API_URL}/getanygameheadtohead/${userone}/${usertwo}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
        async fetchSpecificHeadtoHeadStats(userone, usertwo, gamename) {
            console.log('url', `${import.meta.env.VITE_API_URL}/getspecificgameheadtohead/${gamename}/${userone}/${usertwo}`)
            axios.get(`${import.meta.env.VITE_API_URL}/getspecificgameheadtohead/${gamename}/${userone}/${usertwo}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
        async fetchUsers() {
            axios.get(`${import.meta.env.VITE_API_URL}/getusers`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                this.users = response.data.map(user => ({
                    id: user.id,
                    username: user.username
                }));
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        }
    },
    computed: {
        isMobile() {
            return window.innerWidth < 410;
        }
    },
    created() {
        this.fetchUsers();
    }
}
</script>

<style scoped>
.customAutocomplete {
    background-color: #404040;
    border: 1px solid #404040;
    color: white;
    padding: 6px;
    border-radius: 5px;
    width: 90%;
}
</style>