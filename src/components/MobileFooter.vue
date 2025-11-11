<template>
    <div id="mobileFooter" class=".mobile-footer">
        <router-link to="/">
            <img src="/src/assets/icons/home.webp" alt="Home" style="margin: 4px 7.5px; width: 35px; height: 35px;">
        </router-link>
  
        <router-link to="/gamerecords">
            <img src="/src/assets/icons/records.webp" alt="Records" style="margin: 4px 5px; width: 40px; height: 40px;">
        </router-link>
  
        <router-link to="/addrecord">
            <img src="/src/assets/icons/add.webp" alt="Add Record" style="margin: 4px 7.5px; width: 35px; height: 35px;">
        </router-link>
  
        <img src="/src/assets/icons/tools.webp" alt="Tools" style="margin: 4px 7.5px; width: 35px; height: 30px;"
            @click="toggleDropdown">

        <router-link :to="`/profile/${userName}`" >
            <img src="/src/assets/icons/profile.webp" alt="Profile" style="margin: 4px 0; width: 50px; height: 50px;">
        </router-link>
    </div>

    <div v-show="showDropdown" class="dropdown-content-mobile" style="left: 5px; min-width: 160px;">
        <router-link to="/headtohead" class="dropdown-item">
            1v1 Statistics
        </router-link>
        <router-link to="/autoclank" class="dropdown-item">
            Auto Clank
        </router-link>
        <router-link to="/7wonderduelcounter" class="dropdown-item">
            7 Wonders Counter
        </router-link>
        <router-link to="/dominioncounter" class="dropdown-item">
            Dominion Counter
        </router-link>
        <router-link to="/dominionselector" class="dropdown-item">
            Dominion Selector
        </router-link>
    </div>
  </template>
<script>
import { userState } from '/src/state/userState'

export default {
    name: "Home",
    data(){
        return{
            userName: userState.username,
            showDropdown: false
        }
    },
    computed: {
        profileImageSrc() {
            return new URL(`../assets/profilepictures/${this.userName}.png`, import.meta.url).href
        },
    },
    methods: {
        toggleDropdown(e) {
            e.stopPropagation()
            this.showDropdown = !this.showDropdown
        },
        closeDropdown() {
            this.showDropdown = false
        },
        handleClickOutside(e) {
            if (!this.$el.contains(e.target)) {
                this.closeDropdown()
            }
        }
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside)
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleClickOutside)
    },
    watch: {
        showDropdown(newVal) {
            console.log('Dropdown state:', newVal)
        }
    },
}
</script>

<style>
#mobileFooter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 92%;
    margin-bottom: 35px;
}
#mobileFooter p {
    color: white;
    margin-top: 15px;
    margin-bottom: 10px;
    margin-left: 8px;
    font-size: larger;
}

#logout {
    border-radius: 0% !important;
}
#logout::hover {
    cursor: pointer;
}

.dropdown-content-mobile {
    position: absolute;
    bottom: 95px;
    left: 20px;
    display: flex;
    flex-direction: column;
    margin-left: 200px;
}

.dropdown-item {
    padding: 6px;
    margin-bottom: 4px;
    background-color: #18191A;
    border-radius: 5%;
    width: 140px;
    text-decoration: none;
    color: white;
    text-align: center;
}
</style>