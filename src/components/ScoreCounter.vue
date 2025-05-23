<template>
    <div class="section" id="counter">
        <div class="counter">
            <div style="display: flex; flex-direction: row; justify-content: space-between;">
                <p style="font-size: 26px; margin-left: 5px;">{{ typeof playerName === 'string' ? playerName : playerName.name }}</p>
                <div style="display: flex; flex-direction: row; margin-right: 15px;">
                    <p style="font-size: 30px; margin-left: 5px;">{{ victoryPoints }}</p>
                    <img src="/src/assets/icons/vp.png" id="VPSymbol">
                </div>
            </div>
            <div style="width: 365px; display: flex; flex-direction: row; flex-wrap: wrap;">
                <div v-for="(count, cardType) in filteredCardCounts" :key="cardType" class="type">
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
        selectedAltVPCards: {
            type: Array,
            required: true
        }
    },
    data(){
        return{
            userName: userState.username,
            cardCounts: {
                Estate: 3,
                Duchy: 0,
                Province: 0,
                Curse: 0,
                Colony: 0,
                Tokens: 0,
                Gardens: 0,
                Cards: 10,
                Duke: 0,
                Harem: 0,
                Mill: 0,
                Nobles: 0,
                Island: 0,
                Castles: 0,
                'Distant Lands': 0
            },
            altVPCards: ['Colony', 'Tokens', 'Gardens', 'Duke', 'Harem', 'Mill', 'Nobles', 'Island', 'Castles', 'Distant Lands']
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
        filteredCardCounts() {
            const baseCards = ['Estate', 'Duchy', 'Province', 'Curse'];
            // Start with the filtered entries as before
            let filtered = Object.entries(this.cardCounts).filter(([cardType]) => 
                baseCards.includes(cardType) || this.selectedAltVPCards.includes(cardType)
            );

            if (this.selectedAltVPCards.includes('Gardens') || this.selectedAltVPCards.includes('Wall')) {
                if (!this.cardCounts['Cards']) {
                    filtered.push(['Cards', 0]);
                } else if (!filtered.some(([cardType]) => cardType === 'Cards')) {
                    filtered.push(['Cards', this.cardCounts['Cards']]);
                }
            }

            return Object.fromEntries(filtered);
        },
        victoryPoints() {
            let playerScore = this.cardCounts['Estate'] + (this.cardCounts['Duchy'] * 3) + (this.cardCounts['Province'] * 6) + (this.cardCounts['Colony'] * 10)
                + this.cardCounts['Tokens'] + (this.cardCounts['Gardens'] * Math.floor(this.cardCounts['Cards'] / 10)) + (this.cardCounts['Duke'] * this.cardCounts['Duchy'])
                + ((this.cardCounts['Harem'] + this.cardCounts['Nobles'] + this.cardCounts['Island']) * 2) + this.cardCounts['Mill'] + (this.cardCounts['Castles'])
                + (this.cardCounts['Distant Lands'] * 4) - this.cardCounts['Curse']
            this.$emit('updateScore', playerScore, this.playerNumber)
            return playerScore
        }
    },
    watch: {
        selectedAltVPCards: {
            handler(newValue) {
            console.log('selectedAltVPCards changed:', newValue);
            },
        }
    },
    created() {
        
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
    height: 25px;
    width: 25px;
    margin-top: 5px;
    margin-left: 5px;
    user-select: none;
}
</style>