<template>
    <div style="display: flex; flex-direction: column; justify-content: center;">
        <label for="userSearch">Username</label>
        <input v-model="currentSearch" id="userSearch" placeholder="Search for a User">
        <p v-if="showEmptyMessage">No Users Found</p>
        <div class="followListContainer" v-for="user in this.showingUsers">
            <div class="followList" @click="navigateToProfile(user.username)">
                <img class="followImg" :src="userProfileImage(user.username)">
                <p>{{ user.username }}</p>
            </div>
            <button v-if="!following.some(f => f.username === user.username)" id="follow" @click="FollowUser(userName)">Follow</button>
            <button v-else id="unfollow" @click="UnfollowUser(userName)">Unfollow</button>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios'
import { userState } from '/src/state/userState'
  
export default {
    data() {
        return {
            userID: userState.userID,
            userName: userState.username,
            showEmptyMessage: false,
            following: [],
            users: [],
            showingUsers: [],
            currentSearch: ''
        }
    },
    watch: {
        currentSearch(newValue) {
            console.log('seaching users for: ', newValue)
            this.showEmptyMessage = false;
            if(newValue == '' || null) {
                this.showingUsers = this.users
            } else {
                const search = newValue.toLowerCase();
                this.showingUsers = this.users.filter(user =>
                    user.username.toLowerCase().includes(search)
                );

                console.log(this.showingUsers.length)
                if(this.showingUsers.length == 0) {
                    this.showEmptyMessage = true;
                }
            }
        }
    },
    methods: {
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
            this.userName = name;
        },
        async fetchUsers() {
            axios.get(`${import.meta.env.VITE_API_URL}/getusers`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                const exclude = ["fakeacct", "idkname", this.userName];
                this.users = response.data
                    .filter(user => !exclude.includes(user.username))
                    .map(user => ({
                        id: user.id,
                        username: user.username
                }));
                this.showingUsers = [...this.users]

                console.log('users', this.users)
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
        }
    },
    created() {
        let searchName = this.userName;
        this.fetchUsers()
        this.fetchUsersFollowing(searchName);
    }
}
</script>

<style>
label {
    color: white;
    margin-bottom: 4px;
    margin-left: 8px;
}

input {
    width: 385px;
    margin-bottom: 12px;
    margin-left: 4px;
    padding: 6px 7px;
    border-radius: 5px;
    border: 1px solid #404040;
    background-color: #404040;
    color: white;
}


.followListContainer {
    display: flex;
    flex-direction: row;
    margin-bottom: 15px;
    width: 100%;
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
    width: 225px;
    text-align: start;
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
    margin-left: 10px;
}
</style>