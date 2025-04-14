<template>
    <div>
        <div class="section" id="profileHeader">
            <div id="profileInformation">
                <img id="profilePicture" :src="profileImageSrc" @error="setDefaultImage" onclick="location.href='/profile?name=current'">
                <div id="profileDetails">
                    <p id="profileName">{{ this.userName }}</p>
                    <p v-if="this.users.includes(userName)" id="profileLocation">{{ this.userStats.location }}</p>
                    <div v-if="logginUser != userName && this.users.includes(userName)">
                        <button v-if="userRelationship === 'Follow'" id="follow" @click="FollowUser(userName)">Follow</button>
                        <button v-else-if="userRelationship === 'Unfollow'" id="unfollow" @click="UnfollowUser(userName)">Unfollow</button>
                    </div>
                </div>
            </div>
            <div id="statHolder" style="margin-right: 10px;">
                <div class="stat">
                    <div style="display: flex; flex-direction: row; justify-content: space-around; width: 100%;">
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <p class="statHeader">Followers</p>
                            <p class="statDetail">{{ this.followers.length }}</p>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <p class="statHeader">Following</p>
                            <p class="statDetail">{{ this.following.length }}</p>
                        </div>
                    </div>
                </div>
                <div class="stat" style="margin-top: 15px">
                    <div style="display: flex; flex-direction: row; justify-content: space-around; width: 100%;">
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <p class="statHeader">Games Played</p>
                            <p class="statDetail">{{ this.userStats.gamesplayed }}</p>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <p class="statHeader">Games Won</p>
                            <p class="statDetail">{{ this.userStats.gameswon }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="section" id="gamesHeader">
        <div :style="headerWidth" id="gamesContainter">
            <h2 style="margin: 0px; ">Recent Games</h2>
            <div style="display: flex; flex-direction: row; flex-wrap: wrap;" :key="refeshGames">
                <div v-for="game in recentGames.slice(0, 8)">
                    <RecentGame :gameData="game" :isVisitor="isVisitor" :suggestedNames="suggestedNames" 
                        :showingGames="showingGames" :themeGames="themeGames" :typeGames="typeGames" 
                        :searchType="searchType" :startDate="startDate" :endDate="endDate"/>
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
    name: "Profile",
    data(){
        return{
            userName: this.$route.params.username,
            logginUser: userState.username,
            logginUserID: userState.userID,
            isVisitor: false,
            refeshGames: 0,
            recentGames: [],
            showingGames: [],
            suggestedNames: [],
            showingThemes: [],
            themeGames: [],
            showingTypes: [],
            typeGames: [],
            users: [],
            followers: [],
            following: [],
            userRelationship: 'Follow',
            startDate: '2023-06-13',
            searchType: 'exclusive',
            endDate: new Date().toISOString().slice(0, 10),
            userStats: Object,
            followRefresh: 0,
        }
    },
    components: {
        RecentGame
    },
    methods: {
        navigateToProfile(name) {
            this.$router.push(`/profile/${name}`);
            let searchName = name;
            if(searchName == 'Guest') {
                searchName = 'josh'
                this.isVisitor = true;
            }
            this.recentGames = [];
            this.fetchGames(searchName);
            this.fetchUserStats(searchName);
            this.userName = name;
        },
        setDefaultImage(event) {
            event.target.src = new URL('../assets/profilepictures/Guest.png', import.meta.url).href;
        },
        async fetchUsers() {
            axios.get(`${import.meta.env.VITE_API_URL}/getusers`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                this.users = response.data.map(user => user.username);
                console.log('users', this.users)
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
        async fetchGames(user) {
            axios.get(`${import.meta.env.VITE_API_URL}/usergames/${user}/1`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log(response.data)
                this.recentGames = [...this.recentGames, ...response.data];
                this.refeshGames = this.refeshGames + 1;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
        async fetchUserStats(user) {
            axios.get(`${import.meta.env.VITE_API_URL}/getuserstats/${user}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log(response.data)
                this.userStats = response.data;
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
        async fetchUsersFollowers(user) {
            axios.get(`${import.meta.env.VITE_API_URL}/getfollowers/${user}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log('followers')
                this.followers = response.data
                console.log(this.followers)
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
        async fetchUsersFollowing(user) {
            axios.get(`${import.meta.env.VITE_API_URL}/getfollowing/${user}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                console.log('following')
                this.following = response.data
                console.log(this.following)
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
        async fetchUserRelationship(user) {
            let insertObject = {
                "follower": this.logginUserID,
                "following": user
            }
            console.log(insertObject)
            fetch(`${import.meta.env.VITE_API_URL}/getuserelationship`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(insertObject)
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log('data:', data);
                this.userRelationship = data.relationship === "Following User" ? "Unfollow" : "Follow";
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
        async FollowUser(user) {
            let insertObject = {
                "follower": this.logginUserID,
                "following": user
            }
            console.log(insertObject)
            fetch(`${import.meta.env.VITE_API_URL}/followuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(insertObject)
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if(data.event == "Followed User") {
                    this.userRelationship = "Unfollow";
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
        async UnfollowUser(user) {
            let insertObject = {
                "follower": this.logginUserID,
                "following": user
            }
            console.log(insertObject)
            fetch(`${import.meta.env.VITE_API_URL}/unfollowuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(insertObject)
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if(data.event == "Unfollowed User") {
                    this.userRelationship = "Follow";
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },

    },
    computed: {
        headerWidth() {
        return {
            width: '795px'
            }
        },
        profileImageSrc() {
            return new URL(`../assets/profilepictures/${this.userName}.png`, import.meta.url).href
        },
        buttonText() {
            console.log('button text changing')
            return this.userRelationship;
        },
        formattedDate(){
            let parts = this.recentGames[0].date.split('-');
            let year = parts[0];
            let month = parts[1];
            let day = parts[2];
            const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            const monthName = months[month - 1];
            return `${monthName} ${day}, ${year}`
        },
        isMobile() {
            return window.innerWidth < 410;
        }
    },
    created() {
        let searchName = this.userName;
        if(searchName == 'Guest') {
            searchName = 'josh'
            this.isVisitor = true;
        }
        this.fetchGames(searchName);
        this.fetchUserStats(searchName);
        this.fetchUsersFollowers(searchName);
        this.fetchUsersFollowing(searchName);
        this.fetchUserRelationship(searchName);
        this.fetchUsers();
    }
}
</script>

<style scoped>
#profileHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 815px;
    position: sticky;
    top: 60px;
}
#profileInformation {
    width: 140px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 10px;
}
#profilePicture {
    width: 140px;
    height: 140px;
    border-radius: 50%;
}
#profileDetails {
    margin-left: 20px;
    padding-bottom: 45px;
}
#profileName {
    width: 350px;
    font-size: xx-large;
    color: white;
    margin-top: 5px;
    margin-bottom: 8px;
    font-family: 'Manolo Mono', sans-serif !important;
}
#profileLocation {
    width: 350px;
    font-size: large;
    color: white;
    margin-top: 5px;
    margin-bottom: 8px;
    font-family: 'Manolo Mono', sans-serif !important;
}
#follow {
    margin-top: 5px;
    width: 75px;
    color: #17a2b8 !important;
    background: transparent;
    border: 2px solid #17a2b8;
    outline: none;
    padding: 4px 7px;
    border-radius: 5px;
}
#unfollow {
    margin-top: 5px;
    width: 75px;
    color: #fff !important;
    background-color: #17a2b8;
    border: 2px solid #17a2b8;
    outline: none;
    padding: 4px 7px;
    border-radius: 5px;
}
.stat {
    width: 240px;
    height: 75px;
    background-color: #3A3B3C;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    border-radius: 8px;

}
.statHeader {
    color: white;
    font-size: larger;
    margin-top: 14px;
    margin-bottom: 10px;
    font-size: small !important;
    font-family: 'Manolo Mono', sans-serif !important;
    z-index: 200;
}
.statDetail{
    color: white;
    font-size: larger;
    z-index: 200;
    margin-top: 0px;
    margin-bottom: 10px;
    font-family: 'Manolo Mono', sans-serif !important;
}

#gamesContainter{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

@media (max-width: 	420px) {
    .MobileHide {
        display: none !important;
    }

    .section{
        padding: 5px;
    }

    #profileHeader {
        flex-direction: column;
        width: 385px;
    }
    #profilePicture {
        width: 90px;
        height: 90px;
    }
    #profileDetails {
        padding-bottom: 20px;
    }
    #statHolder {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 0px !important;
    }
    #statHolder .stat {
        margin-top: 0px !important;
    }
    .stat {
        width: 180px;
        height: 50px;
    }
    .statHeader {
        font-size: 12px;
        margin-top: 8px !important;
        margin-bottom: 2px;
    }
    .statDetail{
        font-size: 14px;
        margin-bottom: 8px;
    }

    #gamesHeader {
        width: 385px;
        margin-top: 0px;
    }
    #gamesContainter{
        width: 400px !important;
    }
}
</style>