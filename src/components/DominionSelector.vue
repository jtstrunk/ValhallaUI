<template>
    <div class="section" id="dominionSelector" style="background-color: #18191A;">
        <div id="filters">
            <div id="expansions">
                <button id="Set" class="btn btn-main btn-outline" style="outline: none;" onclick="toggleCollapse('collapsibleSets', 'Set')">Expansions</button>
                <div id="collapsibleSets" class="">
                    <button
                        v-for="expansion in expansions"
                        style="margin: 2px 0"
                        :key="expansion"
                        @click="toggleExpansion(expansion)"
                        :class="{
                            'btn-dark': !selectedExpansions.includes(expansion),
                            'btn-seleced': selectedExpansions.includes(expansion)
                        }" > {{ expansion }}
                    </button>
                </div>
            </div>
            <div>
                <div id="types">
                    <button id="Type" class="btn btn-main btn-outline" style="outline: none;" onclick="toggleCollapse('collapsibleButtons', 'Type')">Types</button>
                    <div id="collapsibleButtons" class="">
                        <button class="btn-dark" id="action">Action</button>
                        <button class="btn-dark" id="victory">Victory</button>
                        <button class="btn-dark" id="treasure">Treasure</button>
                        <button class="btn-dark" id="attack">Attack</button>
                        <button class="btn-dark" id="reaction">Reaction</button>
                        <button class="btn-dark" id="duration">Duration</button>
                        <button class="btn-dark" id="command">Command</button>
                        <button class="btn-dark" id="shadow">Shadow</button>
                        <button class="btn-dark" id="omen">Omen</button>
                    </div>
                </div>
                <div id="categories">
                    <button id="Category" class="btn btn-main" style="outline: none;" onclick="toggleCollapse('collapsibleCategories', 'Category')">Categories</button>
                    <div id="collapsibleCategories" class="Hide">
                        <button class="btn-dark" id="village">Village</button>
                        <button class="btn-dark" id="cantrip">Cantrip</button>
                        <button class="btn-dark" id="gainer">Gainer</button>
                        <button class="btn-dark" id="trasher">Trasher</button>
                        <button class="btn-dark" id="sifter">Sifter</button>
                        <button class="btn-dark" id="terminalDraw">Terminal Draw</button>
                        <button class="btn-dark" id="terminalSilver">Terminal Silver</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- add number box to ask how many to filter -->
        <div id="cards" class="show-all">
            <img v-for="card in filteredCards" :key="card.name"
                :src="getCardImage(card.name)" :alt="card.name" />
        </div>
        <div id="selectedCards" >
            <span class="special">Start a Game</span>
            <div class="buttons" style="margin-bottom: 15px;">
                <button @click="startGame()" id="selectedCardsbtn" class="btn-option btn-dark">Use Selected Cards</button>
                <button @click="clearSelections()" id="clearSele" class="btn-option btn-dark">Clear Selections</button>
            </div>
            <div class="buttons">
                <span class="special" style="margin-top: 15px !important;">Select Random Cards From</span>
                <span class="special" style="margin-left: 50px;" @click="this.showDialog=!this.showDialog">Advanced</span>
            </div>
            
            <span id="alert"></span>
            <div class="buttons">
                <button @click="selectedFill()" id="selectedFill" class="btn-option btn-dark">Selected Filters</button>
                <button @click="anyFill()" id="randomFill" class="btn-option btn-dark">Any Filter</button>
            </div>
            <div id="selcards">
                <img v-for="card in selectedCards" :key="card.name" class="miniCard"
                    :src="getCardImage(card.name)" :alt="card.name" />
            </div>
        </div>
    </div>

    <div id="overlay" v-if="this.showDialog" @click="this.showDialog=!this.showDialog"></div>
    <div id="popups" class="gamepopup" v-if="this.showDialog"> 
        <div class="popupContainer">
            <p>Dominion Kingdom Creation</p>
            <div style="display: flex; flex-direction: row; justify-content: space-between; width: 710px;">
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; width: 340px; height: 112.5px; justify-content: space-between;">
                    <button
                        v-for="cardType in cardTypes"
                        :key="cardType"
                        @click="toggleAdvancedcardType(cardType)"
                        :class="{
                            'btn-dark': !selectedAdvancedCardTypes.includes(cardType),
                            'btn-seleced': selectedAdvancedCardTypes.includes(cardType)
                        }" > {{ cardType }}
                    </button>
                </div>
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; width: 340px; height: 75px; justify-content: space-between;">
                    <button
                        v-for="expansion in expansions"
                        :key="expansion"
                        @click="toggleAdvancedExpansion(expansion)"
                        :class="{
                            'btn-dark': !selectedAdvancedExpansions.includes(expansion),
                            'btn-seleced': selectedAdvancedExpansions.includes(expansion)
                        }" > {{ expansion }}
                    </button>
                </div>
            </div>
            <div>
                <button class="btn-start" @click="generateAdvancedKingdom">Generate Advanced Kingdom</button>
                <button class="btn-start" @click="fillFromExpansions()" style="margin-left: 5px;">Populate Missing Cards</button>
                <!-- <button @click="console.clear()">clear console</button> -->
            </div>
            <div style="margin-top: 10px; display: flex; flex-direction: row; flex-wrap: wrap; width: 720px;">
                <img v-for="card in selectedCards" :key="card.name" :alt="card" class="tinyCard"
                    :src="getCardImage(card.name)" :class="{ traitCards: this.traitCards.includes(card) }" 
                    @click="removeCard(card)" />
            </div>
            <div style="margin-top: 10px; display: flex; flex-direction: row; justify-content: center; width: 875px; margin-left: 15px;">
                <img v-for="card in selectedAddons" :key="card" class="addonCard"
                    :src="getLandscapesImage(card)" :alt="card"/>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import { userState } from '/src/state/userState'

export default {
    inheritAttrs: false,
    name: "Dominion Selector",
    props: {

    },
    data(){
        return{
            userName: userState.username,
            showDialog: true,
            expansions: ['Dominion', 'Intrigue', 'Seaside', 'Prosperity', 'Plunder', 'Rising Sun'],
            cardTypes: ['Treasure', 'Victory', 'Shadow', 'Debt', 'Loot', 'Col & Plat', 'Prophecy', 'Event', 'Trait'],
            categories: ['Village', 'Cantrip', 'Gainer', 'Trasher', 'Sifter', 'Terminal Draw', 'Terminal Silver'],
            selectedAdvancedExpansions: ['Dominion', 'Intrigue', 'Seaside', 'Prosperity', 'Plunder', 'Rising Sun'],
            selectedAdvancedCardTypes: [],
            selectedExpansions: ['Dominion'],
            selectedTypes: [],
            selectedCategories: [],
            selectedCards: [],
            selectedAddons: [],
            traitCards: [],
        }
    },
    components: {
        
    },
    computed: {
        filteredCards() {
            // Filter cards based on selectedExpansions
            if (this.selectedExpansions.length === 0) {
                console.log("No expansions selected, showing all cards.");
                return this.cards;
            }

            console.log("Filtering cards..."); // Debugging output
            return this.cards.filter(card =>
                this.selectedExpansions.includes(card.set)
            );
        }
    },
    methods: {
        showRemovedLandscape(landscape) {
            this.$toast.add({
                severity: 'info',
                summary: 'Selected Unavailable Landscape',
                detail: `${landscape} are not available in selected Expansions.`,
                life: 7000
            });
        },
        showRemovedCard(type) {
            this.$toast.add({
                severity: 'info',
                summary: 'Selected Unavailable Card Type',
                detail: `There are no ${type} cards in selected Expansions.`,
                life: 7000
            });
        },
        showRemovedMechanic(mechanic) {
            this.$toast.add({
                severity: 'info',
                summary: 'Selected Unavailable Mechanic',
                detail: `${mechanic} is not available in selected Expansions.`,
                life: 7000
            });
        },
        getCardImage(cardName) {
            return new URL(`../assets/dominioncards/200px-${cardName}.jpg`, import.meta.url).href;
        },
        getLandscapesImage(cardName) {
            return new URL(`../assets/dominioncards/${cardName}.jpg`, import.meta.url).href;
        },
        toggleExpansion(expansion) {
            // Add or remove the clicked expansion from selectedExpansions
            if (this.selectedExpansions.includes(expansion)) {
                this.selectedExpansions = this.selectedExpansions.filter(item => item !== expansion);
            } else {
                this.selectedExpansions.push(expansion);
            }
            console.log("Selected Expansions:", this.selectedExpansions); // Debugging output
        },
        toggleAdvancedExpansion(expansion){
            if (this.selectedAdvancedExpansions.includes(expansion)) {
                this.selectedAdvancedExpansions = this.selectedAdvancedExpansions.filter(item => item !== expansion);
            } else {
                this.selectedAdvancedExpansions.push(expansion);
            }
        },
        toggleAdvancedcardType(cardType){
            if (this.selectedAdvancedCardTypes.includes(cardType)) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(item => item !== cardType);
            } else {
                this.selectedAdvancedCardTypes.push(cardType);
            }
        },
        removeCard(card) {
            console.log('removing ', card);
            const index = this.selectedCards.indexOf(card);
            if (index > -1) {
                this.selectedCards.splice(index, 1);
            }
        },
        startGame() {
            console.log('starting game')
        },
        clearSelections() {
            this.selectedCards = [];
        },
        selectedFill() {
            console.log('getting cards from this list')
        },
        anyFill() {
            let tempCardList = JSON.parse(JSON.stringify(this.cards));
            let loopCount = 10 - this.selectedCards.length;
            loopCount = Math.max(loopCount, 0);
            let addedCount = 0;
            let attempts = 0;

            while (addedCount < loopCount && attempts < 100) {
                attempts++;
                let randomIndex = Math.floor(Math.random() * tempCardList.length);
                let cardName = tempCardList[randomIndex];

                if (!this.selectedCards.includes(cardName)) {
                    this.selectedCards.push(cardName);
                    tempCardList.splice(randomIndex, 1);
                    addedCount++;
                }
            }
        },
        addCard(cardType) {
            let attempts = 0;
            let added = false;
            while (!added && attempts < 20) {
                attempts++;
                const randomIndex = Math.floor(Math.random() * cardType.length);
                const cardName = cardType[randomIndex];

                if (!this.selectedCards.includes(cardName)) {
                    this.selectedCards.push(cardName);
                    added = true;
                    console.log(cardName);
                }
            }
        },
        fillFromExpansions(){
            this.selectedExpansionsCardList = [...this.cards];
            if (this.selectedAdvancedExpansions.length > 0) {
                this.selectedExpansionsCardList = this.selectedExpansionsCardList.filter(card =>
                    this.selectedAdvancedExpansions.includes(card.set)
                );
            }

            console.log('selected expansion', this.selectedExpansions)
            let addedCount = 0, restAttempts = 0;
            let loopCount = 10 - this.selectedCards.length;
            loopCount = Math.max(loopCount, 0);

            while (addedCount < loopCount && restAttempts < 100) {
                restAttempts++;
                let randomIndex = Math.floor(Math.random() * this.selectedExpansionsCardList.length);
                let cardName = this.selectedExpansionsCardList[randomIndex];

                if (!this.selectedCards.includes(cardName)) {
                    this.selectedCards.push(cardName);
                    this.selectedExpansionsCardList.splice(randomIndex, 1);
                    addedCount++;
                }
            }
        },
        generateAdvancedKingdom(){
            let maxEffectCount = false;
            this.selectedExpansionsCardList = [...this.cards];
            this.selectedExpansionsLandscapeList = [...this.landScapes];
            this.selectedCards = [];
            this.selectedAddons = [];
            this.traitCards = [];
            if (this.selectedAdvancedExpansions.length > 0) {
                this.selectedExpansionsCardList = this.selectedExpansionsCardList.filter(card => 
                    this.selectedAdvancedExpansions.includes(card.set)
                );
                this.selectedExpansionsLandscapeList = this.selectedExpansionsLandscapeList.filter(card => 
                    this.selectedAdvancedExpansions.includes(card.set)
                );
            }

            let treasureCards = this.selectedExpansionsCardList.filter(card => card.types.includes('Treasure'))
            let victoryCards = this.selectedExpansionsCardList.filter(card => card.types.includes('Victory') || card.tags?.includes('Victory_Token'))
            let shadowCards = this.selectedExpansionsCardList.filter(card => card.types.includes('Shadow'))
            let debtCards = this.selectedExpansionsCardList.filter(card => card.tags?.includes('Debt'))
            let lootCards = this.selectedExpansionsCardList.filter(card => card.tags?.includes('Loot'))
            let omenCards = this.selectedExpansionsCardList.filter(card => card.types.includes('Omen'))
            let prophecies = this.selectedExpansionsLandscapeList.filter(card => card.types.includes('Prophecy'))
            let events = this.selectedExpansionsLandscapeList.filter(card => card.types.includes('Event'))
            let traits = this.selectedExpansionsLandscapeList.filter(card => card.types.includes('Trait'))

            const countEffectingTypes = ["Treasure", "Debt", "Prophecy", "Loot", "Victory", "Shadow"];
            if (countEffectingTypes.every(type => this.selectedAdvancedCardTypes.includes(type))) {
                maxEffectCount = true;
            }
            console.log('all six: ', maxEffectCount);

            if (this.selectedAdvancedCardTypes.includes('Treasure') && !this.selectedAdvancedExpansions.includes('Intrigue')
                && !this.selectedAdvancedExpansions.includes('Seaside') && !this.selectedAdvancedExpansions.includes('Prospertity')
                && !this.selectedAdvancedExpansions.includes('Plunder')  && !this.selectedAdvancedExpansions.includes('Rising Sun') ) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Treasure');
                this.showRemovedCard('Treasure')
            }
            if (this.selectedAdvancedCardTypes.includes('Victory') && !this.selectedAdvancedExpansions.includes('Dominion') 
                && !this.selectedAdvancedExpansions.includes('Intrigue') && !this.selectedAdvancedExpansions.includes('Seaside')
                && !this.selectedAdvancedExpansions.includes('Prospertity')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Victory');
                this.showRemovedCard('Victory')
            }
            if (this.selectedAdvancedCardTypes.includes('Shadow') && !this.selectedAdvancedExpansions.includes('Rising Sun')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Shadow');
                this.showRemovedCard('Shadow')
            }
            if (this.selectedAdvancedCardTypes.includes('Debt') && !this.selectedAdvancedExpansions.includes('Rising Sun')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Debt');
                this.showRemovedMechanic('Debt')
            }
            if (this.selectedAdvancedCardTypes.includes('Loot') && !this.selectedAdvancedExpansions.includes('Plunder')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Loot');
                this.showRemovedMechanic('Loot')
            }
            if (this.selectedAdvancedCardTypes.includes('Col & Plat') && !this.selectedAdvancedExpansions.includes('Prosperity')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Col & Plat');
                this.showRemovedMechanic('Col & Plat')
            }
            if (this.selectedAdvancedCardTypes.includes('Prophecy') && !this.selectedAdvancedExpansions.includes('Rising Sun')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Prophecy');
                this.showRemovedLandscape('Prophecies')
            }
            if (this.selectedAdvancedCardTypes.includes('Event') &&
                !this.selectedAdvancedExpansions.includes('Rising Sun') && !this.selectedAdvancedExpansions.includes('Plunder')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Event');
                this.showRemovedLandscape('Events')
            }
            if (this.selectedAdvancedCardTypes.includes('Trait') && !this.selectedAdvancedExpansions.includes('Plunder')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Trait');
                this.showRemovedLandscape('Traits')
            }

            
            for(let loopCount = 1; loopCount < 4; loopCount++) {
                if(this.selectedAdvancedCardTypes.includes('Treasure')) {
                    if(loopCount == 1) {
                        this.addCard(treasureCards)
                    } else if(loopCount == 2) {
                        let randomChance = Math.floor(Math.random() * 100);
                        if(this.selectedAdvancedCardTypes.includes('Col & Plat') && randomChance <= 20 ||
                            !this.selectedAdvancedCardTypes.includes('Col & Plat') && randomChance <= 32) {
                            this.addCard(treasureCards)
                        }
                    } else {
                        let randomChance = Math.floor(Math.random() * 100);
                        if(this.selectedAdvancedCardTypes.includes('Col & Plat') && randomChance <= 5 ||
                            !this.selectedAdvancedCardTypes.includes('Col & Plat') && randomChance <= 12) {
                            this.addCard(treasureCards)
                        }
                    }
                }

                if(this.selectedAdvancedCardTypes.includes('Victory')) {
                    if(loopCount == 1) {
                        this.addCard(victoryCards)
                    } else if (loopCount == 2){
                        let randomChance = Math.floor(Math.random() * 100)
                        if(randomChance <= 40) {
                            this.addCard(victoryCards)
                        }
                    } else {
                        let randomChance = Math.floor(Math.random() * 100);
                        if(randomChance <= 5) {
                            this.addCard(victoryCards)
                        }
                    }
                }

                if(this.selectedAdvancedCardTypes.includes('Shadow')) {
                    if(loopCount == 1) {
                        this.addCard(shadowCards)
                    } else if (loopCount == 2){
                        let randomChance = Math.floor(Math.random() * 100);
                        if(randomChance <= 8) {
                            this.addCard(shadowCards)
                        }
                    }
                }

                if(this.selectedAdvancedCardTypes.includes('Debt')) {
                    if(loopCount == 1) {
                        this.addCard(debtCards)
                    } else if (loopCount == 2){
                        let randomChance = Math.floor(Math.random() * 100);
                        if(randomChance <= 32) {
                            this.addCard(debtCards)
                        }
                    } else {
                        let randomChance = Math.floor(Math.random() * 100);
                        if(randomChance <= 10) {
                            this.addCard(debtCards)
                        }
                    }
                }
            
                if(this.selectedAdvancedCardTypes.includes('Loot')) {
                    if(loopCount == 1) {
                        this.addCard(lootCards)
                    } else if (loopCount == 2){
                        let randomChance = Math.floor(Math.random() * 100);
                        if(randomChance <= 32) {
                            this.addCard(lootCards)
                        }
                    }
                }
                
                
                if(this.selectedAdvancedCardTypes.includes('Prophecy')) {
                    if(loopCount == 1) {
                        this.addCard(omenCards)
                    } else if (loopCount == 2){
                        let randomChance = Math.floor(Math.random() * 100);
                        if(randomChance <= 20) {
                            this.addCard(omenCards)
                        }
                    }
                }

                if((this.selectedCards.length > 7 || maxEffectCount == true) && loopCount == 2) {
                    break;
                }
            }

            if(!prophecies.some(prophecy => this.selectedAddons.includes(prophecy)) 
                && omenCards.some(omen => this.selectedCards.includes(omen))) {
                let prophecyRandomIndex = Math.floor(Math.random() * prophecies.length);
                let cardName = prophecies[prophecyRandomIndex].name;
                if (!this.selectedAddons.includes(cardName)) {
                    this.selectedAddons.push(cardName);
                }
            }

            if(this.selectedAdvancedCardTypes.includes('Event')) {
                let numEvent = 0, addedCount = 0, attempts = 0;
                let randomChance = Math.floor(Math.random() * 100);
                if (this.selectedAdvancedCardTypes.includes('Prophecy')) {
                    numEvent = 1;
                } else {
                    if(randomChance < 81) {
                        numEvent = 1;
                    } else {
                        numEvent = 2;
                    }
                }

                while (addedCount < numEvent && attempts < 20) {
                    attempts++;
                    let randomIndex = Math.floor(Math.random() * events.length);
                    let eventName = events[randomIndex].name;

                    if (!this.selectedAddons.includes(eventName)) {
                        this.selectedAddons.push(eventName);
                        addedCount++;
                    }
                }
            }

            if(this.selectedAdvancedCardTypes.includes('Trait')) {
                let numTrait = 0, addedCount = 0, attempts = 0;
                let randomChance = Math.floor(Math.random() * 100);
                if(randomChance < 71) {
                    numTrait = 1
                } else {
                    numTrait = 2
                }

                while (addedCount < numTrait && attempts < 20) {
                    attempts++;
                    let randomIndex = Math.floor(Math.random() * traits.length);
                    let traitName = traits[randomIndex].name;
                    if (!this.selectedAddons.includes(traitName)) {
                        this.selectedAddons.push(traitName);
                        addedCount++;
                    }
                }
            }
            
            let addedCount = 0, restAttempts = 0;
            let loopCount = 10 - this.selectedCards.length;
            loopCount = Math.max(loopCount, 0);

            while (addedCount < loopCount && restAttempts < 100) {
                restAttempts++;
                let randomIndex = Math.floor(Math.random() * this.selectedExpansionsCardList.length);
                let cardName = this.selectedExpansionsCardList[randomIndex];

                if (!this.selectedCards.includes(cardName)) {
                    this.selectedCards.push(cardName);
                    this.selectedExpansionsCardList.splice(randomIndex, 1);
                    addedCount++;
                }
            }

            let traitNumber = 0, traitCount = 0, attempts = 0;
            traits.forEach(trait => {
                if (this.selectedAddons.includes(trait.name)) {
                    traitNumber++;
                }
            });
            while (traitCount < traitNumber && attempts < 20) {
                let randomNumber = Math.floor(Math.random() * 10);

                if(!this.traitCards.includes(this.selectedCards[randomNumber])) {
                    this.traitCards.push(this.selectedCards[randomNumber])
                    traitCount++;
                }
                attempts++
            }
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
    },
    created() {
        this.cards = [
            {
                name: "Cellar",
                set: "Dominion",
                types: ["Action"],
                categories: ["Sifter"]
            },
            {
                name: "Chapel",
                set: "Dominion",
                types: ["Action"],
                categories: ["Trasher"]
            },
            {
                name: "Moat",
                set: "Dominion",
                types: ["Action, Reaction"],
                categories: ["Terminal_Draw"]
            },
            {
                name: "Harbinger",
                set: "Dominion",
                types: ["Action"],
                categories: ["Cantrip"]
            },
            {
                name: "Merchant",
                set: "Dominion",
                types: ["Action"],
                categories: ["Cantrip"]
            },
            {
                name: "Vassal",
                set: "Dominion",
                types: ["Action"],
                categories: ["Terminal_Silver"]
            },
            {
                name: "Village",
                set: "Dominion",
                types: ["Action"],
                categories: ["Village"]
            },
            {
                name: "Workshop",
                set: "Dominion",
                types: ["Action"],
                categories: ["Gainer"]
            },
            {
                name: "Bureaucrat",
                set: "Dominion",
                types: ["Action", "Attack"],
                categories: [""]
            },
            {
                name: "Gardens",
                set: "Dominion",
                types: ["Victory"],
                categories: [""]
            },
            {
                name: "Militia",
                set: "Dominion",
                types: ["Action", "Attack"],
                categories: ["Terminal_Silver"]
            },
            {
                name: "Moneylender",
                set: "Dominion",
                types: ["Action"],
                categories: ["Trasher", "Terminal_Silver"]
            },
            {
                name: "Poacher",
                set: "Dominion",
                types: ["Action"],
                categories: [""]
            },
            {
                name: "Remodel",
                set: "Dominion",
                types: ["Action"],
                categories: ["Gainer"]
            },
            {
                name: "Smithy",
                set: "Dominion",
                types: ["Action"],
                categories: ["Terminal_Draw"]
            },
            {
                name: "Throne_Room",
                set: "Dominion",
                types: ["Action"],
                categories: ["Village"]
            },
            {
                name: "Bandit",
                set: "Dominion",
                types: ["Action", "Attack"],
                categories: [""]
            },
            {
                name: "Council_Room",
                set: "Dominion",
                types: ["Action"],
                categories: ["Terminal_Draw"]
            },
            {
                name: "Festival",
                set: "Dominion",
                types: ["Action"],
                categories: ["Village"]
            },
            {
                name: "Laboratory",
                set: "Dominion",
                types: ["Action"],
                categories: [""]
            },
            {
                name: "Library",
                set: "Dominion",
                types: ["Action"],
                categories: ["Terminal_Draw"]
            },
            {
                name: "Market",
                set: "Dominion",
                types: ["Action"],
                categories: [""]
            },
            {
                name: "Mine",
                set: "Dominion",
                types: ["Action"],
                categories: ["Gainer"]
            },
            {
                name: "Sentry",
                set: "Dominion",
                types: ["Action"],
                categories: ["Cantrip", "Trasher", "Sifter"]
            },
            {
                name: "Witch",
                set: "Dominion",
                types: ["Action", "Attack"],
                categories: ["Terminal_Draw"]
            },
            {
                name: "Artisan",
                set: "Dominion",
                types: ["Action"],
                categories: ["Gainer"]
            },
            {
                name: "Captain",
                set: "Promo",
                types: ["Action", "Duration", "Command"],
                categories: [""]
            },
            {
                name: "Church",
                set: "Promo",
                types: ["Action", "Duration"],
                categories: ["Trasher"]
            },
            {
                name: "Haven",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: ["Cantrip"]
            },
            {
                name: "Lighthouse",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: [""]
            },
            {
                name: "Native_Village",
                set: "Seaside",
                types: ["Action"],
                categories: ["Village", "Trasher"]
                
            },
            {
                name: "Astrolabe",
                set: "Seaside",
                types: ["Treasure", "Duration"],
                categories: [""]
                
            },
            {
                name: "Fishing_Village",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: ["Village"]
                
            },
            {
                name: "Lookout",
                set: "Seaside",
                types: ["Action"],
                categories: ["Trasher", "Sifter"]
                
            },
            {
                name: "Monkey",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: [""]
                
            },
            {
                name: "Sea_Chart",
                set: "Seaside",
                types: ["Action"],
                categories: ["Cantrip"]
                
            },
            {
                name: "Smugglers",
                set: "Seaside",
                types: ["Action"],
                categories: ["Gainer"]
                
            },
            {
                name: "Warehouse",
                set: "Seaside",
                types: ["Action"],
                categories: ["Sifter"]
                
            },
            {
                name: "Blockade",
                set: "Seaside",
                types: ["Action", "Duration", "Attack"],
                categories: ["Gainer"]
                
            },
            {
                name: "Caravan",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: ["Cantrip"]
                
            },
            {
                name: "Cutpurse",
                set: "Seaside",
                types: ["Action", "Attack"],
                categories: ["Terminal_Silver"]
                
            },
            {
                name: "Island",
                set: "Seaside",
                types: ["Action", "Victory"],
                categories: ["Trasher"]
                
            },
            {
                name: "Sailor",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: ["Trasher"]
                
            },
            {
                name: "Salvager",
                set: "Seaside",
                types: ["Action"],
                categories: ["Trasher"]
                
            },
            {
                name: "Tide_Pools",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: [""]
                
            },
            {
                name: "Treasure_Map",
                set: "Seaside",
                types: ["Action"],
                categories: [""]
                
            },
            {
                name: "Bazaar",
                set: "Seaside",
                types: ["Action"],
                categories: ["Village"]
                
            },
            {
                name: "Corsair",
                set: "Seaside",
                types: ["Action", "Duration", "Attack"],
                categories: ["Terminal_Silver"]
                
            },
            {
                name: "Merchant_Ship",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: ["Terminal_Silver"]
                
            },
            {
                name: "Outpost",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: [""]
                
            },
            {
                name: "Pirate",
                set: "Seaside",
                types: ["Action", "Duration", "Reaction"],
                categories: ["Gainer"]
                
            },
            {
                name: "Sea_Witch",
                set: "Seaside",
                types: ["Action", "Duration", "Attack"],
                categories: ["Sifter", "Terminal_Draw"]
                
            },
            {
                name: "Tactician",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: ["Village"]
                
            },
            {
                name: "Treasury",
                set: "Seaside",
                types: ["Action"],
                categories: [""]
                
            },
            {
                name: "Wharf",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: ["Terminal_Draw"]
                
            },
            {
                name: "Courtyard",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Terminal_Draw"]
                
            },
            {
                name: "Lurker",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Gainer", "Trasher"]
                
            },
            {
                name: "Pawn",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Cantrip"]
                
            },
            {
                name: "Masquerade",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Trasher", "Trasher", "Terminal_Draw"]
                
            },
            {
                name: "Shanty_Town",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Village"]
                
            },
            {
                name: "Steward",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Trasher", "Terminal_Draw", "Terminal_Silver"]
                
            },
            {
                name: "Swindler",
                set: "Intrigue",
                types: ["Action", "Attack"],
                categories: ["Terminal_Silver"]
                
            },
            {
                name: "Wishing_Well",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Cantrip"]
                
            },
            {
                name: "Baron",
                set: "Intrigue",
                types: ["Action"],
                categories: [""]
                
            },
            {
                name: "Bridge",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Terminal_Silver"]
                
            },
            {
                name: "Conspirator",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Terminal_Silver"]
                
            },
            {
                name: "Diplomat",
                set: "Intrigue",
                types: ["Action", "Reaction"],
                categories: ["Village", "Sifter", "Terminal_Draw"]
                
            },
            {
                name: "Ironworks",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Cantrip", "Gainer"]
                
            },
            {
                name: "Mill",
                set: "Intrigue",
                types: ["Action", "Victory"],
                categories: ["Cantrip"]
                
            },
            {
                name: "Mining_Village",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Village"]
                
            },
            {
                name: "Secret_Passage",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Sifter"]
                
            },
            {
                name: "Courtier",
                set: "Intrigue",
                types: ["Action"],
                categories: [""]
            },
            {
                name: "Duke",
                set: "Intrigue",
                types: ["Victory"],
                categories: [""]
            },
            {
                name: "Minion",
                set: "Intrigue",
                types: ["Action", "Attack"],
                categories: ["Sifter"]
            },
            {
                name: "Patrol",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Terminal_Draw"]
            },
            {
                name: "Replace",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Gainer"]
            },
            {
                name: "Torturer",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Terminal_Draw"]
            },
            {
                name: "Trading_Post",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Trasher"]
            },
            {
                name: "Upgrade",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Cantrip", "Gainer"]
            },
            {
                name: "Harem",
                set: "Intrigue",
                types: ["Treasure", "Victory"],
                categories: [""]
            },
            {
                name: "Nobles",
                set: "Intrigue",
                types: ["Action", "Victory"],
                categories: ["Village", "Terminal_Draw"]
            },
            {
                name : "Anvil",
                set: "Prosperity",
                types: ["Treasure"],
                categories: ["Gainer"]
            },
            {
                name : "Watchtower",
                set: "Prosperity",
                types: ["Action", "Reaction"],
                categories: ["Trasher", "Terminal_Draw"]
            },
            {
                name : "Bishop",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Trasher"],
                tags: ["Victory_Token"]
            },
            {
                name : "Clerk",
                set: "Prosperity",
                types: ["Action", "Reaction", "Attack"],
                categories: ["Terminal_Silver"]
            },
            {
                name : "Investment",
                set: "Prosperity",
                types: ["Treasure"],
                categories: ["Trasher"]
            },
            {
                name : "Monument",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Terminal_Silver"],
                tags: ["Victory_Token"]
            },
            {
                name : "Quarry",
                set: "Prosperity",
                types: ["Treasure"],
                categories: [""]
            },
            {
                name : "Tiara",
                set: "Prosperity",
                types: ["Treasure"],
                categories: [""]
            },
            {
                name : "Worker's_Village",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Village"]
            },
            {
                name : "Charlatan",
                set: "Prosperity",
                types: ["Action", "Attack"],
                categories: [""]
            },
            {
                name : "City",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Village"]
            },
            {
                name : "Collection",
                set: "Prosperity",
                types: ["Treasure"],
                categories: [""]
            },
            {
                name : "Crystal_Ball",
                set: "Prosperity",
                types: ["Treasure"],
                categories: ["Trasher", "Sifter"]
            },
            {
                name : "Magnate",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Terminal_Draw"]
            },
            {
                name : "Mint",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Gainer", "Trasher"]
            },
            {
                name : "Rabble",
                set: "Prosperity",
                types: ["Action", "Attack"],
                categories: ["Terminal_Draw"]
            },
            {
                name : "Vault",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Terminal_Draw"]
            },
            {
                name : "War_Chest",
                set: "Prosperity",
                types: ["Treasure"],
                categories: [""]
            },
            {
                name : "Grand_Market",
                set: "Prosperity",
                types: ["Action"],
                categories: [""]
            },
            {
                name : "Hoard",
                set: "Prosperity",
                types: ["Treasure"],
                categories: [""]
            },
            {
                name : "Expand",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Gainer"]
            },
            {
                name : "Forge",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Gainer", "Trasher"]
            },
            {
                name : "King's_Court",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Village"]
            },
            {
                name : "Peddler",
                set: "Prosperity",
                types: ["Action"],
                categories: [""]
            },
            {
                name: "Cage",
                set: "Plunder",
                types: ["Treasure", "Duration"],
                categories: ["Trasher"]
            },
            {
                name: "Grotto",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Sifter"]
            },
            {
                name: "Jewelled_Egg",
                set: "Plunder",
                types: ["Treasure"],
                categories: [""],
                tags: ["Loot"]
            },
            {
                name: "Search",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Terminal_Silver"],
                tags: ["Loot"]
            },
            {
                name: "Shaman",
                set: "Plunder",
                types: ["Action"],
                categories: ["Gainer", "Trasher"]
            },
            {
                name: "Secluded_Shrine",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Trasher"]
            },
            {
                name: "Siren",
                set: "Plunder",
                types: ["Action", "Duration", "Attack"],
                categories: ["Trasher"]
            },
            {
                name: "Stowaway",
                set: "Plunder",
                types: ["Action", "Duration", "Reaction"],
                categories: [""]
            },
            {
                name: "Taskmaster",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Village"]
            },
            {
                name: "Abundance",
                set: "Plunder",
                types: ["Treasure", "Duration"],
                categories: [""]
            },
            {
                name: "Cabin_Boy",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Cantrip"]
            },
            {
                name: "Crucible",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Trasher"]
            },
            {
                name: "Flagship",
                set: "Plunder",
                types: ["Action", "Duration", "Command"],
                categories: ["Village", "Terminal_Silver"]
            },
            {
                name: "Fortune_Hunter",
                set: "Plunder",
                types: ["Action"],
                categories: ["Terminal_Silver"]
            },
            {
                name: "Gondola",
                set: "Plunder",
                types: ["Treasure", "Duration"],
                categories: ["Village"]
            },
            {
                name: "Harbor_Village",
                set: "Plunder",
                types: ["Action"],
                categories: ["Village"]
            },
            {
                name: "Landing_Party",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: [""]
            },
            {
                name: "Mapmaker",
                set: "Plunder",
                types: ["Action", "Reaction"],
                categories: ["Sifter", "Terminal_Draw"]
            },
            {
                name: "Maroon",
                set: "Plunder",
                types: ["Action"],
                categories: ["Trasher", "Terminal_Draw"]
            },
            {
                name: "Rope",
                set: "Plunder",
                types: ["Treasure", "Duration"],
                categories: ["Trasher"]
            },
            {
                name: "Swamp_Shacks",
                set: "Plunder",
                types: ["Action"],
                categories: ["Village"]
            },
            {
                name: "Tools",
                set: "Plunder",
                types: ["Treasure"],
                categories: ["Gainer"]
            },
            {
                name: "Buried_Treasure",
                set: "Plunder",
                types: ["Treasure", "Duration"],
                categories: [""]
            },
            {
                name: "Crew",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Terminal_Draw"]
            },
            {
                name: "Cutthroat",
                set: "Plunder",
                types: ["Action", "Duration", "Attack"],
                categories: [""],
                tags: ["Loot"]
            },
            {
                name: "Enlarge",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: [""]
            },
            {
                name: "Figurine",
                set: "Plunder",
                types: ["Treasure"],
                categories: ["Terminal_Draw"]
            },
            {
                name: "First_Mate",
                set: "Plunder",
                types: ["Action"],
                categories: [""]
            },
            {
                name: "Frigate",
                set: "Plunder",
                types: ["Action", "Duration", "Attack"],
                categories: [""]
            },
            {
                name: "Longship",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Village"]
            },
            {
                name: "Mining_Road",
                set: "Plunder",
                types: ["Action"],
                categories: [""]
            },
            {
                name: "Pendant",
                set: "Plunder",
                types: ["Treasure"],
                categories: [""]
            },
            {
                name: "Pickaxe",
                set: "Plunder",
                types: ["Treasure"],
                categories: ["Trasher"],
                tags: ["Loot"]
            },
            {
                name: "Pilgrim",
                set: "Plunder",
                types: ["Action"],
                categories: ["Terminal_Draw"]
            },
            {
                name: "Quartermaster",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Gainer"]
            },
            {
                name: "Silver_Mine",
                set: "Plunder",
                types: ["Treasure"],
                categories: ["Gainer"]
            },
            {
                name: "Trickster",
                set: "Plunder",
                types: ["Action", "Attack"],
                categories: [""]
            },
            {
                name: "Wealthy_Village",
                set: "Plunder",
                types: ["Action"],
                categories: ["Village"],
                tags: ["Loot"]
            },
            {
                name: "Sack_of_Loot",
                set: "Plunder",
                types: ["Treasure"],
                categories: [""],
                tags: ["Loot"]
            },
            {
                name: "King's_Cache",
                set: "Plunder",
                types: ["Treasure"],
                categories: [""]
            },
            {
                name: "Mountain_Shrine",
                set: "Rising Sun",
                types: ["Action", "Omen"],
                categories: ["Trasher", "Terminal_Draw", "Terminal_Silver"],
                tags: ["Debt"]
            },
            {
                name: "Daimyo",
                set: "Rising Sun",
                types: ["Action", "Command"],
                categories: ["Village", "Cantrip"],
                tags: ["Debt"]
            },
            {
                name: "Artist",
                set: "Rising Sun",
                types: ["Action"],
                categories: [""],
                tags: ["Debt"]
            },
            {
                name: "Fishmonger",
                set: "Rising Sun",
                types: ["Action", "Shadow"],
                categories: [""]
            },
            {
                name: "Snake_Witch",
                set: "Rising Sun",
                types: ["Action", "Attack"],
                categories: ["Cantrip"]
            },
            {
                name: "Aristocrat",
                set: "Rising Sun",
                types: ["Action"],
                categories: ["Village", "Terminal_Draw"]
            },
            {
                name: "Craftsman",
                set: "Rising Sun",
                types: ["Action"],
                categories: ["Gainer"],
                tags: ["Debt"]
            },
            {
                name: "Riverboat",
                set: "Rising Sun",
                types: ["Action", "Duration"],
                categories: [""]
            },
            {
                name: "Root_Cellar",
                set: "Rising Sun",
                types: ["Action"],
                categories: [""],
                tags: ["Debt"]
            },
            {
                name: "Alley",
                set: "Rising Sun",
                types: ["Action", "Shadow"],
                categories: ["Cantrip", "Sifter"]
            },
            {
                name: "Change",
                set: "Rising Sun",
                types: ["Action"],
                categories: [""],
                tags: ["Debt"]
            },
            {
                name: "Ninja",
                set: "Rising Sun",
                types: ["Action", "Attack", "Shadow"],
                categories: ["Terminal_Draw"]
            },
            {
                name: "Poet",
                set: "Rising Sun",
                types: ["Action", "Omen"],
                categories: ["Cantrip"]
            },
            {
                name: "River_Shrine",
                set: "Rising Sun",
                types: ["Action", "Omen"],
                categories: ["Trasher"]
            },
            {
                name: "Rustic_Village",
                set: "Rising Sun",
                types: ["Action", "Omen"],
                categories: ["Village", "Sifter"]
            },
            {
                name: "Gold_Mine",
                set: "Rising Sun",
                types: ["Action"],
                categories: ["Cantrip"],
                tags: ["Debt"]
            },
            {
                name: "Imperial_Envoy",
                set: "Rising Sun",
                types: ["Action"],
                categories: ["Terminal_Draw"],
                tags: ["Debt"]
            },
            {
                name: "Kitsune",
                set: "Rising Sun",
                types: ["Action", "Attack", "Omen"],
                categories: ["Village", "Terminal_Silver"]
            },
            {
                name: "Litter",
                set: "Rising Sun",
                types: ["Action"],
                categories: ["Village"],
                tags: ["Debt"]
            },
            {
                name: "Rice_Broker",
                set: "Rising Sun",
                types: ["Action"],
                categories: ["Trasher"]
            },
            {
                name: "Ronin",
                set: "Rising Sun",
                types: ["Action", "Shadow"],
                categories: ["Terminal_Draw"]
            },
            {
                name: "Tanuki",
                set: "Rising Sun",
                types: ["Action", "Shadow"],
                categories: [""]
            },
            {
                name: "Tea_House",
                set: "Rising Sun",
                types: ["Action", "Omen"],
                categories: [""]
            },
            {
                name: "Samurai",
                set: "Rising Sun",
                types: ["Action", "Duration", "Attack"],
                categories: [""]
            },
            {
                name: "Rice",
                set: "Rising Sun",
                types: ["Treasure"],
                categories: [""]
            },
        ]
        this.landScapes = [
            {
                name: "Avoid",
                set: "Plunder",
                types: ["Event"]
            },
            {
                name: "Bury",
                set: "Plunder",
                types: ["Event"]
            },
            {
                name: "Deliver",
                set: "Plunder",
                types: ["Event"]
            },
            {
                name: "Foray",
                set: "Plunder",
                types: ["Event"],
                tags: ["Loot"]
            },
            {
                name: "Invasion",
                set: "Plunder",
                types: ["Event"]
            },
            {
                name: "Journey",
                set: "Plunder",
                types: ["Event"]
            },
            {
                name: "Launch",
                set: "Plunder",
                types: ["Event"]
            },
            {
                name: "Looting",
                set: "Plunder",
                types: ["Event"],
                tags: ["Loot"]
            },
            {
                name: "Maelstrom",
                set: "Plunder",
                types: ["Event"],
                tags: ["Loot"]
            },
            {
                name: "Mirror",
                set: "Plunder",
                types: ["Event"]
            },
            {
                name: "Peril",
                set: "Plunder",
                types: ["Event"]
            },
            {
                name: "Prepare",
                set: "Plunder",
                types: ["Event"]
            },
            {
                name: "Prosper",
                set: "Plunder",
                types: ["Event"]
            },
            {
                name: "Rush",
                set: "Plunder",
                types: ["Event"],
                tags: ["Loot"]
            },
            {
                name: "Scrounge",
                set: "Plunder",
                types: ["Event"]
            },
            {
                name: "Cheap",
                set: "Plunder",
                types: ["Trait"]
            },
            {
                name: "Cursed",
                set: "Plunder",
                types: ["Trait"]
            },
            {
                name: "Fated",
                set: "Plunder",
                types: ["Trait"]
            },
            {
                name: "Fawning",
                set: "Plunder",
                types: ["Trait"]
            },
            {
                name: "Friendly",
                set: "Plunder",
                types: ["Trait"]
            },
            {
                name: "Hasty",
                set: "Plunder",
                types: ["Trait"]
            },
            {
                name: "Inherited",
                set: "Plunder",
                types: ["Trait"]
            },
            {
                name: "Inspiring",
                set: "Plunder",
                types: ["Trait"]
            },
            {
                name: "Nearby",
                set: "Plunder",
                types: ["Trait"]
            },
            {
                name: "Patient",
                set: "Plunder",
                types: ["Trait"]
            },
            {
                name: "Pious",
                set: "Plunder",
                types: ["Trait"]
            },
            {
                name: "Reckless",
                set: "Plunder",
                types: ["Trait"]
            },
            {
                name: "Rich",
                set: "Plunder",
                types: ["Trait"]
            },
            {
                name: "Shy",
                set: "Plunder",
                types: ["Trait"]
            },
            {
                name: "Tireless",
                set: "Plunder",
                types: ["Trait"]
            },
            {
                name: "Amass",
                set: "Rising Sun",
                types: ["Event"]
            },
            {
                name: "Asceticism",
                set: "Rising Sun",
                types: ["Event"]
            },
            {
                name: "Continue",
                set: "Rising Sun",
                types: ["Event"]
            },
            {
                name: "Credit",
                set: "Rising Sun",
                types: ["Event"]
            },
            {
                name: "Foresight",
                set: "Rising Sun",
                types: ["Event"]
            },
            {
                name: "Gather",
                set: "Rising Sun",
                types: ["Event"]
            },
            {
                name: "Kintsugi",
                set: "Rising Sun",
                types: ["Event"]
            },
            {
                name: "Practice",
                set: "Rising Sun",
                types: ["Event"]
            },
            {
                name: "Receive_Tribute",
                set: "Rising Sun",
                types: ["Event"]
            },
            {
                name: "Sea_Trade",
                set: "Rising Sun",
                types: ["Event"]
            },
            {
                name: "Approaching_Army",
                set: "Rising Sun",
                types: ["Prophecy"]
            },
            {
                name: "Biding_Time",
                set: "Rising Sun",
                types: ["Prophecy"]
            },
            {
                name: "Bureaucracy",
                set: "Rising Sun",
                types: ["Prophecy"]
            },
            {
                name: "Divine_Wind",
                set: "Rising Sun",
                types: ["Prophecy"]
            },
            {
                name: "Enlightenment",
                set: "Rising Sun",
                types: ["Prophecy"]
            },

            {
                name: "Flourishing_Trade",
                set: "Rising Sun",
                types: ["Prophecy"]
            },
            {
                name: "Good_Harvest",
                set: "Rising Sun",
                types: ["Prophecy"]
            },
            {
                name: "Great_Leader",
                set: "Rising Sun",
                types: ["Prophecy"]
            },
            {
                name: "Growth",
                set: "Rising Sun",
                types: ["Prophecy"]
            },
            {
                name: "Harsh_Winter",
                set: "Rising Sun",
                types: ["Prophecy"]
            },
            {
                name: "Kind_Emperor",
                set: "Rising Sun",
                types: ["Prophecy"]
            },
            {
                name: "Panic",
                set: "Rising Sun",
                types: ["Prophecy"]
            },
            {
                name: "Progress",
                set: "Rising Sun",
                types: ["Prophecy"]
            },
            {
                name: "Rapid_Expansion",
                set: "Rising Sun",
                types: ["Prophecy"]
            },
            {
                name: "Sickness",
                set: "Rising Sun",
                types: ["Prophecy"]
            },
        ]
    }
}
</script>

<style scoped>
.section {
    display: flex;
    flex-direction: row !important;
}
#dominionSelector {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

h2 {
    margin: 0px;
}
h3{
    color: #fff;
    font-family: 'Manolo Mono', sans-serif !important;
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
.btn-dark {
    width: 110px;
    height: 32px;
    color: #fff !important;
    background-color: #404040;
    border: 2px solid #404040;
    outline: none;
    padding: 4px 7px;
    border-radius: 5px;
}
.btn-dark:hover {
    cursor: pointer;
}
.btn-seleced {
    width: 110px;
    height: 32px;
    color: #17a2b8 !important;
    background-color: #404040;
    border: 2px solid #17a2b8;
    outline: none;
    padding: 4px 7px;
    border-radius: 5px;
}
.btn-selcted:hover {
    cursor: pointer;
}
.btn-outline {
    width: 110px;
    height: 32px;
    color: #17a2b8 !important;
    background: transparent;
    border: 2px solid #17a2b8;
    outline: none;
    padding: 4px 7px;
    border-radius: 5px;
}
.btn-outline:hover {
    cursor: pointer;
}
.btn-option {
    width: 150px !important;
    height: 32px !important;
    margin-left: 2px !important; 
}
.btn-start {
    margin-top: 5px;
    background-color: tan;
    border-radius: 5px;
    border: 1px solid;
    padding: 5px;
}

label {
    color: white;
    margin-bottom: 8px;
}
.customAutocomplete {
    background-color: #404040;
    border: 1px solid #404040;
    color: white;
    padding: 6px;
    border-radius: 5px;
    width: 175px;
}

.playerScore {
    width: 180px;
    background-color: #242526;
    margin: 8px 4px 0px 4px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
}
.playerScore p {
    margin: 0px;
    padding: 6px 10px;
    /* font-size: 23px; */
}

#filters {
    display: flex;
    flex-direction: row;
    width: 230px;
    position: sticky;
    top: 65px;
    margin-right: 40px;
}

#sets {
    display: flex;
    flex-direction: row;
    background-color: white;
    margin-left: 26px;
}

#types {
    display: flex;
    flex-direction: column;
    width: 115px;
    position: sticky;
}

#categories {
    display: flex;
    flex-direction: column;
    width: 115px;
}

#cards {
    width: 700px;
    margin-left: 10px;
    margin-right: 60px;
    position: sticky;
    top: 65px;
}
img {
    height: 264px;
    width: 164px;
    border: 3px solid black;
    border-radius: 5px;
    margin: 3.5px;
}

#selectedCards {
    position: sticky;
    top: 65px;
    /* set initial overflow to hidden */
    /* overflow-y: scroll;
    scrollbar-width: thin; */
}

.special {
    text-align: left !important;
    margin: 0%;
    margin-left: 5px;
    color: white;
}
.miniCard {
    width: 148px;
    height: 238px;
    margin: 2px;
}
.tinyCard {
    width: 140px;
    height: 215px;
    margin: 2px;
}
.addonCard {
    width: 215px;
    height: 140px;
    margin: 2px;
}
#selcards {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 316px;
    margin-left: 2px;
}
/* .scroll {
    height: 760px;
} */

.selected {
    border: 2.5px solid #5cc0e4;
    background-color: #656668;
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
    width: 950px;
    height: 820px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #242526;
    border-radius: 2%;
    text-align: center;
    z-index: 1001;
    /* height: 680px;
    overflow-y: scroll;
    scrollbar-width: thin;
    scrollbar-color: #888 #242526; */
}
.gamepopup::-webkit-scrollbar {
    width: 5px;
}
.gamepopup::-webkit-scrollbar-track {
    background: #242526;
}
.gamepopup::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
}
.gamepopup::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}
.popupContainer {
    width: 930px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 25px;
}
.popupContainer p {
    font-size: 22px;
    font-family: 'Manolo Mono', sans-serif !important;
    margin: 14px 0;
}
.traitCards {
    border: 3.5px solid purple;
}
</style>