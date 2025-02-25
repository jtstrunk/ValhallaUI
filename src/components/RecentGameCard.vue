<template>
    <div class="game">
        <div class="header">
            <div style="display: flex; flex-direction: row;">
                <!-- <img src="{{ url_for('static', filename='images/addgame/' + game.game_type.replace(' ', '') + '.png') }}" class="gamePicture"> -->
                <img class="gamePicture" :src="imageSource" style="border-top-left-radius: 5px;">
                <div class="testtext" style="margin-left: 15px;">
                    <p class="name">{{ this.userName }}</p>
                    <p class="date">{{ formattedDate }}</p>
                    <p class="gameName">{{ gameData.gamename }}</p>
                    <span class='gameID' style="display: none;">Game ID {{ gameData.game_id}}</span>
                </div>
            </div>
            <img src="/src/assets/profilepictures/joshpfp.png" class="profilePicture">
        </div>
        <div class="gameInformation">
            <div class="podium">
                <img src="/src/assets/icons/firstblack.png" class="medal">
                <p class="placer">{{ gameData.winnername }}</p>
            </div>
            <div v-if="gameData.secondname" class="podium">
                <img src="/src/assets/icons/secondblack.png" class="medal">
                <p class="placer">{{ gameData.secondname }}</p>
            </div>
            <div v-if="gameData.thirdname" class="podium">
                <img src="/src/assets/icons/thirdblack.png" class="medal">
                <p class="placer">{{ gameData.thirdname }}</p>
            </div>
        </div>
    </div>
</template>
    
<script>

export default {
    name: "Home",
    props: {
        gameData: { 
            Object
        },
    },
    data(){
        return{
            userName: 'Josh',
        }
    },
    methods: {
        test(){
            console.log("AYOO")
        },

    },
    computed: {
        imageSource() {
            const cleanedGameName = this.gameData.gamename.replace(/\s+/g, '');
            return `/src/assets/addgame/${cleanedGameName}.png`;
        },
        formattedDate(){
            let parts = this.gameData.date.split('-');
            let year = parts[0];
            let month = parts[1];
            let day = parts[2];
            const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            const monthName = months[month - 1];
            return `${monthName} ${day}, ${year}`
        }
    },
    created() {
        console.log("created new game")
        console.log(this.gameData)
    }
}
</script>

<style scoped>
.game {
    width: 500px; 
    height: 220px; 
    background-color: #3A3B3C;
    border-radius: 5px;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s;
}
.game:hover {
    transform: scale(1.02);
    cursor: pointer;
}
.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.gamePicture {
    width: 120px; 
    height: 120px; 
}
.profilePicture {
    margin-top: 10px;
    margin-right: 15px;
    width: 50px; 
    height: 50px; 
    border-radius: 50%;
}

.name {
    margin: 12px 0 0 0;
    font-size: 20px;
    font-family: 'Manolo Mono', sans-serif !important;
}
.date {
    font-size: smaller;
    margin: 3px 0 10px;
    font-family: 'Manolo Mono', sans-serif !important;
}
.gameName {
    font-size: 25px;
    margin: 0 0 10px;
    font-family: 'Manolo Mono', sans-serif !important;
}

.gameInformation {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 25px;
}
.gameInformation p {
    color: white;
}
.podium{
    width: 140px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.standing {
    font-size: small;
    margin: 0;
}
.medal {
    height: 40px;
    width: 40px;
}
</style>