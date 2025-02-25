<template>
<div class="game">
    <div>
        <img class="testimg" :src="imageSource" style="border-top-right-radius: 5px;">
    </div>
    <div class="gameContent">
        <h4 class="gameName" :style="gameNameStyle">{{ gameData.gamename }}</h4>
        <h5>Winner: {{ gameData.winnername }}</h5>
        <h5>Second: {{ gameData.secondname }}</h5>
        <span class='gameID' style="font-size: smaller;">Game ID {{ gameData.gameid}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span style="font-size: smaller;">{{ gameData.date }}</span>
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

        }
    },
    methods: {
        test(){
            console.log("AYOO")
        },

    },
    computed: {
        gameNameStyle() {
        return {
            height: this.gameData.gamename.length > 14 ? '30px' : 'auto',
            marginBottom: this.gameData.gamename.length > 14 ? '25px' : '32px'
            }
        },
        imageSource() {
            const cleanedGameName = this.gameData.gamename.replace(/\s+/g, '');
            return `/src/assets/homegame/${cleanedGameName}.png`;
        },
    },
    created() {
        console.log("created new game")
    }
}
</script>

<style scoped>
.game:hover {
    transform: scale(1.02);
    cursor: pointer;
}

.game {
    display: flex;
    flex-direction: column;
    background-color: #3A3B3C;
    width: 180px;
    height: 245px;
    margin-top: 16px;
    border-radius: 5px;
    margin-left: 9px;
    margin-right: 9px;
}

.gameContent {
    margin-left: 8px;
}
.gameContent h4 {
    color: white;
    margin-top: 10px;
    font-family: 'Manolo Mono', sans-serif !important;
    font-size: 20px !important;
    font-weight: 600;
    overflow-wrap: break-word;
}

.gameContent h5 {
    color: white;
    margin-bottom: 5px;
    margin-top: 10px;
    font-size: 14px !important;
    font-family: 'Manolo Mono', sans-serif !important;
    font-weight: 500;
    
}
.gameContent span{
    color: white;
    font-size: 12px !important;
    font-family: 'Manolo Mono', sans-serif !important;
}

.testimg {
    width: 180px;
    height: 97px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}
</style>