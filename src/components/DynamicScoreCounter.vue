<template>
    <div class="section" id="counter">
        <div class="counter">
            <div style="display: flex; flex-direction: row; justify-content: space-between;">
                <p style="font-size: 26px; margin-left: 5px;">{{ typeof playerName === 'string' ? playerName : playerName.name }}</p>
                <div style="display: flex; flex-direction: row; margin-right: 15px;">
                    <p style="font-size: 30px; margin-left: 5px;">{{ victoryPoints }}</p>
                    <img src="/src/assets/icons/ClankVP.png" id="VPSymbol">
                </div>
            </div>
            <div style="width: 365px; display: flex; flex-direction: row; flex-wrap: wrap;">
                <div v-for="(count, cardType) in cardCounts" :key="cardType" class="type">
                    <div class="cardCounter">
                        <p @click="removePoint(cardType)" class="subtracting">-</p>
                        <p class="score">{{ count }}</p>
                        <p @click="addPoint(cardType)" class="adding">+</p>
                    </div>
                    <p>{{ cardType }}</p>
                    <p @click="addFivePoints(cardType)" class="adding">5+</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { userState } from '/src/state/userState'

export default {
    inheritAttrs: false,
    name: "Home",
    props: {
        playerName: {
            type: String,
            required: true
        },
        playerNumber: {
            type: Number,
            required: true
        },
        pointTypes: {
            type: Array,
            required: true
        }
    },
    data(){
        return{
            userName: userState.username,
            cardCounts: {},
        }
    },
    methods: {
        removePoint(type) {
            if (this.cardCounts.hasOwnProperty(type) && this.cardCounts[type] > 0) {
                this.cardCounts[type] = this.cardCounts[type] - 1
            } else {
                console.log('Cannot remove from', type)
            }
        },
        addPoint(type) {
            if (this.cardCounts.hasOwnProperty(type)) {
                this.cardCounts[type] = this.cardCounts[type] + 1
            } else {
                console.log('Unknown card type:', type)
            }
        },
        addFivePoints(type) {
            if (this.cardCounts.hasOwnProperty(type)) {
                this.cardCounts[type] = this.cardCounts[type] + 5
            } else {
                console.log('Unknown card type:', type)
            }
        }
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
        this.pointTypes.forEach(type => {
            this.cardCounts[type] = 0;
        })
    }
}
</script>

<style scoped>
#counter {
    margin-top: 0px;
}
.counter{
    display: flex;
    flex-direction: column;
}
.counter span {
    color: #fff;
    font-size: 26px;
}
.counter p {
    margin: 0px;
    user-select: none;
}
.type {
    margin: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
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

#VPSymbol{
    height: 25px;
    width: 25px;
    margin-top: 5px;
    margin-left: 5px;
    user-select: none;
}
</style>