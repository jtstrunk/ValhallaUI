<template>
    <div class="section" id="Clanker">
        <p>Current Clank</p>   
        <div style="display: flex; flex-direction: row; justify-content: space-around; margin-bottom: 8px;">
            <button class="btn-outline" @click="addClank('green')">Add Green</button>
            <button class="btn-outline" @click="addClank('red')">Add Red</button>
            <button class="btn-outline" @click="addClank('blue')">Add Blue</button>
            <button class="btn-outline" @click="addClank('yellow')">Add Yellow</button>
        </div>
        <div style="display: flex; flex-direction: row; width: 350px; flex-wrap: wrap;">
            <div v-for="clank in showingClank" style="width: 15px; height: 15px; margin: 3px;" :style="{ backgroundColor: getColorStyle(clank) }"></div>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 8px;">
            <div class="cardCounter">
                <p @click="removeDragonLevel(cardType)" class="subtracting">-</p>
                <p class="score">{{ pullcount }}</p>
                <p @click="addDragonLevel(cardType)" class="adding">+</p>
            </div>
            <button class="btn" @click="pullFromBag(pullcount)">Dragon Attack</button>
        </div>
    </div>
</template>

<script>
import { userState } from '/src/state/userState'

export default {
    inheritAttrs: false,
    name: "Home",
    props: {

    },
    data(){
        return{
            userName: userState.username,
            showingClank: [],
            baggedClank: Array(24).fill('black'),
            pullcount: 2
        }
    },
    methods: {
        getColorStyle(colorClass) {
            const colors = {
                green: 'green',
                red: 'red',
                blue: 'blue',
                black: 'black',
                yellow: 'yellow'
            };
            return colors[colorClass] || 'black';
        },
        addClank(color) {
            this.showingClank.push(color);
        },
        pullFromBag(count){
            console.log('pulling this amount', count)
        },
        removeDragonLevel(type) {
            this.pullcount--;
        },
        addDragonLevel(type) {
            this.pullcount++;
        },
    },
    computed: {
        victoryPoints() {
            let playerScore = 0;
            this.pointTypes.forEach(type => {
                playerScore = playerScore + this.cardCounts[type]
            })

            this.$emit('updateScore', playerScore, this.playerNumber)
            return playerScore
        }
    },
    watch: {
        pointTypes: {
            handler(newValue) {
                console.log('pointTypes changed:', newValue);
            },
        }
    },
    created() {
       console.log(this.baggedClank)
    }
}
</script>

<style scoped>
#Clanker {
    margin-top: 10px;
}

.btn-outline {
    width: 80px;
    color: #17a2b8 !important;
    background: transparent;
    border: 2px solid #17a2b8;
    outline: none;
    padding: 4px 4px;
    border-radius: 5px;
}
.btn-outline:hover {
    cursor: pointer;
}

.btn {
    width: 110px;
    height: 32px;
    color: #fff !important;
    background-color: #17a2b8;
    border: 2px solid #17a2b8;
    outline: none;
    padding: 4px 7px;
    border-radius: 5px;
}
.btn:hover {
    cursor: pointer;
}

.cardCounter {
    display: flex;
    flex-direction: row;
}
.cardCounter p {
    margin: 0px;
}
.score {
    padding: 0px 4px;
    width: 30px;
    text-align: center;
    font-size: 20px;
    margin-top: 5px !important;
    user-select: none;
}
.subtracting {
    font-size: 24px;
    user-select: none;
}
.adding {
    font-size: 24px;
    user-select: none;
}
</style>