<template>
    <div class="section">
         <div style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2>{{ this.userName}}'s Recorded Games</h2>
            </div>
            <div style="margin-right: 5px; display: flex; flex-direction: row; width: 600px; flex-wrap: wrap;">
                <div v-for="game in [...recentGames].reverse()">
                    <RecentGame :gameData="game"/>
                </div>
            </div>
        </div>
    </div>

</template>


<script>
import axios from "axios"
import RecentGame from './RecentGame.vue'

export default {
    name: "Home",
    data(){
        return{
            userName: 'Josh',
            recentGames: [],
        }
    },
    components: {
        RecentGame
    },
    methods: {
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
    },
    created() {
        this.fetchGames('josh');
    }
}
</script>