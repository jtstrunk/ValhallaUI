<template>
    <div class="section" id="Clanker">
        <p style="margin: 0 0 6px 0;">Current Clank</p>   
        <div style="display: flex; flex-direction: row; width: 350px; flex-wrap: wrap; margin-bottom: 5px;">
            <div v-for="clank in showingClank" style="width: 15px; height: 15px; margin: 3px;" :style="{ backgroundColor: getColorStyle(clank) }"></div>
        </div>
        <span style="color: white;">Add Clank</span>
        <div style="display: flex; flex-direction: row; justify-content: space-around; margin-bottom: 8px; margin-top: 2px;">
            <button v-if="usedColors.includes('yellow')" class="btn-outline" @click="addClank('yellow')">Yellow</button>
            <button v-if="usedColors.includes('green')" class="btn-outline" @click="addClank('green')">Green</button>
            <button v-if="usedColors.includes('red')" class="btn-outline" @click="addClank('red')">Red</button>
            <button v-if="usedColors.includes('blue')" class="btn-outline" @click="addClank('blue')">Blue</button>
        </div>
        <span style="color: white;">Remove Clank</span>
        <div style="display: flex; flex-direction: row; justify-content: space-around; margin-bottom: 8px; margin-top: 2px;">
            <button v-if="usedColors.includes('yellow')" class="btn-outline" @click="removeClank('yellow')">Yellow</button>
            <button v-if="usedColors.includes('green')" class="btn-outline" @click="removeClank('green')">Green</button>
            <button v-if="usedColors.includes('red')" class="btn-outline" @click="removeClank('red')">Red</button>
            <button v-if="usedColors.includes('blue')" class="btn-outline" @click="removeClank('blue')">Blue</button>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 8px;">
            <div class="cardCounter">
                <p @click="removeDragonLevel()" class="subtracting">-</p>
                <p class="score">{{ pullcount }}</p>
                <img src="/src/assets/icons/ClankDanger.png" id="VPSymbol">
                <p @click="addDragonLevel()" class="adding">+</p>
            </div>
            <button class="btn" @click="pullFromBag(pullcount)" style="margin-top: 5px;">Dragon Attack</button>
        </div>
    </div>
</template>

<script>
import { userState } from '/src/state/userState'

export default {
    inheritAttrs: false,
    name: "Home",
    props: {
        playerCount: {
            type: Number,
            required: true
        },
        colors: {
            type: Object,
            required: true
        },
    },
    data(){
        return{
            userName: userState.username,
            showingClank: [],
            baggedClank: Array(24).fill('black'),
            pullcount: 0,
            usedColors: []
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
        removeClank(color) {
            const idx = this.showingClank.lastIndexOf(color);
            if (idx !== -1) {
                this.showingClank.splice(idx, 1);
            }
        },
        pullFromBag(count){
            console.log('pulling this amount', count)
        },
        removeDragonLevel() {
            if( this.pullcount > 1) {
                this.pullcount--;
            }
        },
        addDragonLevel() {
            if( this.pullcount < 14) {
                this.pullcount++;
            }
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
        if(this.playerCount == 2) {
            this.pullcount = 3;
        } else {
            this.pullcount = 2;
        }
        this.usedColors = this.colors.filter(item => item !== 'empty');

        const counts = [3, 2, 1];
        counts.forEach((count, index) => {
            if (this.usedColors[index]) {
                for (let i = 0; i < count; i++) {
                this.showingClank.push(this.usedColors[index]);
                }
            }
        });
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
    text-align: center;
    font-size: 26px;
    margin-top: 5px !important;
    user-select: none;
}
.subtracting {
    font-size: 28px;
    user-select: none;
}
.adding {
    font-size: 32px;
    user-select: none;
}

#VPSymbol{
    height: 27px;
    width: 27px;
    margin-top: 7px;
    margin-right: 2px;
    user-select: none;
    border-radius: 30%;
}
</style>