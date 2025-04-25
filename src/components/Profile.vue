<template>
    <div style="display: flex; flex-direction: column; align-items: center; overflow-x: hidden;">
        <div>
            <div class="section" id="profileHeader">
                <div id="profileInformation">
                    <img id="profilePicture" :src="profileImageSrc" @error="setDefaultImage" onclick="location.href='/profile?name=current'">
                    <div id="profileDetails">
                        <div>
                            <p id="profileName" :style="nameStyle">{{ this.userName }}</p>
                            <p v-if="this.users.includes(userName) && this.userStats.location != 'None'" id="profileLocation">{{ this.userStats.location }}</p>
                        </div>
                        <div v-if="logginUser != userName && this.users.includes(userName)">
                            <button v-if="userRelationship === 'Follow'" id="follow" @click="FollowUser(userName)">Follow</button>
                            <button v-else-if="userRelationship === 'Unfollow'" id="unfollow" @click="UnfollowUser(userName)">Unfollow</button>
                        </div>
                    </div>
                </div>
                <div id="statHolder" style="margin-right: 10px;">
                    <div class="stat">
                        <div style="display: flex; flex-direction: row; justify-content: space-around; width: 100%;">
                            <div class="followHeader" @click="showpopup('Followers')">
                                <p class="statHeader">Followers</p>
                                <p class="statDetail">{{ this.followers.length }}</p>
                            </div>
                            <div  class="followHeader" @click="showpopup('Following')">
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
        <div class="section" id="gamesHeader" >
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
    </div>
    <div id="overlay" v-if="this.showDialog" @click="this.showDialog=!this.showDialog"></div>
    <div id="popups" class="gamepopup" v-if="this.showDialog"> 
        <p>{{ showingList }}</p>
        <div class="popupContainer">
            <div class="followListContainer" v-if="showingList == 'Followers'" v-for="follower in this.followers">
                <div class="followList" @click="navigateToProfile(follower.username)">
                    <img class="followImg" :src="userProfileImage(follower.username)">
                    <p> {{ follower.username }}</p>
                </div>
                <button v-if="userRelationship === 'Follow'" id="follow" @click="FollowUser(userName)">Follow</button>
                <button v-else-if="userRelationship === 'Unfollow'" id="unfollow" @click="UnfollowUser(userName)">Unfollow</button>
            </div>

            <div class="followListContainer" v-if="showingList == 'Following'" v-for="followed in this.following">
                <div class="followList" @click="navigateToProfile(followed.username)">
                    <img class="followImg" :src="userProfileImage(followed.username)">
                    <p> {{ followed.username }}</p>
                </div>
                <button v-if="userRelationship === 'Follow'" id="follow" @click="FollowUser(userName)">Follow</button>
                <button v-else-if="userRelationship === 'Unfollow'" id="unfollow" @click="UnfollowUser(userName)">Unfollow</button>
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
            showDialog: false,
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
            showingList: null,
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
        showpopup(term) {
            console.log(term)
            this.showingList = term;
            this.showDialog = true;
        },
        userProfileImage(user) {
            let profilePictures = ['josh', 'john', 'ethangambles', 'Hibby']
            if(!profilePictures.includes(user)) {
                let name = 'Guest'
                return new URL(`../assets/profilepictures/${name}.png`, import.meta.url).href
            }
            return new URL(`../assets/profilepictures/${user}.png`, import.meta.url).href
        },
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
            this.showDialog = false;
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
        nameStyle() {
            return {
                fontSize: this.userName.length > 14 && window.innerWidth < 430 ? '18px' : 'x-large'
            }
        },
        buttonText() {
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
    margin-left: 8px;
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
.followHeader {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.followHeader:hover {
    cursor: pointer;    
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
    width: 500px;
    height: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #242526;
    border-radius: 2%;
    text-align: center;
    z-index: 1001;
}

.popupContainer{
    width: 370px;
    height: 500px;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: #888 #242526;
}

.followListContainer {
    display: flex;
    flex-direction: row;
    margin-bottom: 15px;
    width: 350px;
}
.followList {
    display: flex;
    flex-direction: row;
}
.followList:hover {
    cursor: pointer;
}
.followList p {
    font-size: 22px;
    margin-top: 18px;
    margin-left: 8px;
    width: 200px;
    text-align: start;
}
.followListContainer button {
    margin-top: 18px !important;
    height: 32px !important;
}
.followListContainer button:hover {
    cursor: pointer;
}
.followImg {
    width: 65px;
    height: 65px;
    border-radius: 50%;
}

.popupContainer::-webkit-scrollbar {
    width: 5px;
}
.popupContainer::-webkit-scrollbar-track {
    background: #242526;
}
.popupContainer::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
}
.popupContainer::-webkit-scrollbar-thumb:hover {
    background-color: #555;
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
        margin-left: 10px;
        /* margin-top: 45px; */
        overflow-x: hidden;
    }
    #profilePicture {
        width: 80px;
        height: 80px;
        margin-bottom: 10px;
        margin-top: 5px;
    }
    #profileDetails {
        margin-top: 8px;
        padding-bottom: 20px;
        display: flex;
        flex-direction: row;
    }
    #profileName {
        font-size: x-large;
        width: 185px;
    }
    #profileLocation {
        width: 185px;
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
        width: 385px !important;
        margin-top: 8px !important;
        margin: 17px;
    }
    #gamesContainter{
        width: 380px !important;
    }
}
</style>