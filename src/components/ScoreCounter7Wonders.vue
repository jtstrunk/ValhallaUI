<template>
    <div class="section" id="counter">
        <div class="counter">
            <div style="display: flex; flex-direction: row; justify-content: space-between;">
                <p style="font-size: 26px; margin-left: 5px;">{{ typeof playerName === 'string' ? playerName : playerName.name }}</p>
                <div style="display: flex; flex-direction: row; margin-right: 15px;">
                    <p style="font-size: 30px; margin-left: 5px;">{{ victoryPoints }}</p>
                    <img src="/src/assets/icons/7wvp.png" id="VPSymbol">
                </div>
            </div>
            <div style="width: 352px; display: flex; flex-direction: row; flex-wrap: wrap;">
                <div v-for="(count, cardType) in cardCounts" :key="cardType" class="type">
                    <div class="cardCounter">
                    <p @click="removeCard(cardType)" class="subtracting">-</p>
                    <p class="score">{{ count }}</p>
                    <p @click="addCard(cardType)" class="adding">+</p>
                    </div>
                    <p>{{ cardType }}</p>
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
    },
    data(){
        return{
            userName: userState.username,
            cardCounts: {
                Civilian: 0,
                Scientific: 0,
                Commercial: 0,
                Guilds: 0,
                Military: 0,
                Wonders: 0,
                Coins: 0,
            },
        }
    },
    methods: {
        addCard(type) {
            if (this.cardCounts.hasOwnProperty(type)) {
                this.cardCounts[type] = this.cardCounts[type] + 1
            } else {
                console.log('Unknown card type:', type)
            }
        },
        removeCard(type) {
            if (this.cardCounts.hasOwnProperty(type) && this.cardCounts[type] > 0) {
                this.cardCounts[type] = this.cardCounts[type] - 1
            } else {
                console.log('Cannot remove from', type)
            }
        }
    },
    computed: {
        victoryPoints() {
            let playerScore = this.cardCounts['Civilian'] + this.cardCounts['Scientific']
            + this.cardCounts['Commercial'] + Math.floor(this.cardCounts['Coins'] / 3)
            + this.cardCounts['Wonders'] + this.cardCounts['Guilds']

            this.$emit('updateScore', playerScore, this.playerNumber)
            return playerScore
        }
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
    height: 27px;
    width: 26px;
    margin-top: 5px;
    margin-left: 5px;
    user-select: none;
}
</style>