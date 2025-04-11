<template>
    <div class="section" style="background-color: #18191A;">
        <div id="filters">
            <div id="expansions">
                <button id="Set" class="btn btn-main btn-outline" style="outline: none;" onclick="toggleCollapse('collapsibleSets', 'Set')">Expansions</button>
                <div id="collapsibleSets" class="">
                    <button
                        v-for="expansion in expansions"
                        :key="expansion"
                        @click="toggleExpansion(expansion)"
                        :class="{
                            'btn-dark': !selectedExpansions.includes(expansion),
                            'btn': selectedExpansions.includes(expansion)
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
            <img v-for="card in cardList" :key="card" :alt="card"
                :src="'src/assets/dominioncards/200px-' + card + '.jpg'" />
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
                <img v-for="card in selectedCards" :key="card" :alt="card" class="miniCard"
                    :src="'src/assets/dominioncards/200px-' + card + '.jpg'" />
            </div>
        </div>
    </div>
    <div id="overlay" v-if="this.showDialog" @click="this.showDialog=!this.showDialog"></div>
    <div id="popups" class="gamepopup" v-if="this.showDialog"> 
        <div class="popupContainer">
            <p>Advanced Settings</p>
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
                <button @click="generateAdvancedKingdom">Generate Advanced Kingdom</button>
            </div>
            <div style="margin-top: 10px; display: flex; flex-direction: row; flex-wrap: wrap; width: 720px;">
                <img v-for="card in selectedCards" :key="card" :alt="card" class="tinyCard"
                    :src="'src/assets/dominioncards/200px-' + card + '.jpg'" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import { userState } from '/src/state/userState'
import ScoreCounter from './ScoreCounter.vue'
import InsertRecordPopup from './InsertRecordPopup.vue'
const importAll = (requireContext) => requireContext.keys().map(requireContext);

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
            cardTypes: ['Debit', 'Trait', 'Loot', 'Event', 'Prophecy', 'Treasure', 'Victory', 'Col & Plat'],
            selectedExpansions: [],
            selectedAdvancedExpansions: [],
            selectedAdvancedCardTypes: [],
            selectedTypes: [],
            selectedCategories: [],
            selectedCards: [],
            selectedAddons: [],
            cardList:[
                "Cellar",
                "Chapel",
                "Moat",
                "Harbinger",
                "Merchant",
                "Vassal",
                "Village",
                "Workshop",
                "Bureaucrat",
                "Gardens",
                "Militia",
                "Moneylender",
                "Poacher",
                "Remodel",
                "Smithy",
                "Throne_Room",
                "Bandit",
                "Council_Room",
                "Festival",
                "Laboratory",
                "Library",
                "Market",
                "Mine",
                "Sentry",
                "Witch",
                "Artisan",
                "Haven",
                "Lighthouse",
                "Native_Village",
                "Astrolabe",
                "Fishing_Village",
                "Lookout",
                "Monkey",
                "Sea_Chart",
                "Smugglers",
                "Warehouse",
                "Blockade",
                "Caravan",
                "Cutpurse",
                "Island",
                "Sailor",
                "Salvager",
                "Tide_Pools",
                "Treasure_Map",
                "Bazaar",
                "Corsair",
                "Merchant_Ship",
                "Outpost",
                "Pirate",
                "Sea_Witch",
                "Tactician",
                "Treasury",
                "Wharf",
                "Courtyard",
                "Lurker",
                "Pawn",
                "Masquerade",
                "Shanty_Town",
                "Steward",
                "Swindler",
                "Wishing_Well",
                "Baron",
                "Bridge",
                "Conspirator",
                "Diplomat",
                "Ironworks",
                "Mill",
                "Mining_Village",
                "Secret_Passage",
                "Courtier",
                "Duke",
                "Minion",
                "Patrol",
                "Replace",
                "Torturer",
                "Trading_Post",
                "Upgrade",
                "Harem",
                "Nobles",
                "Anvil",
                "Watchtower",
                "Bishop",
                "Clerk",
                "Investment",
                "Monument",
                "Quarry",
                "Tiara",
                "Worker's_Village",
                "Charlatan",
                "City",
                "Collection",
                "Crystal_Ball",
                "Magnate",
                "Mint",
                "Rabble",
                "Vault",
                "War_Chest",
                "Grand_Market",
                "Hoard",
                "Expand",
                "Forge",
                "King's_Court",
                "Peddler",
                "Cage",
                "Grotto",
                "Jewelled_Egg",
                "Search",
                "Shaman",
                "Secluded_Shrine",
                "Siren",
                "Stowaway",
                "Taskmaster",
                "Abundance",
                "Cabin_Boy",
                "Crucible",
                "Flagship",
                "Fortune_Hunter",
                "Gondola",
                "Harbor_Village",
                "Landing_Party",
                "Mapmaker",
                "Maroon",
                "Rope",
                "Swamp_Shacks",
                "Tools",
                "Buried_Treasure",
                "Crew",
                "Cutthroat",
                "Enlarge",
                "Figurine",
                "First_Mate",
                "Frigate",
                "Longship",
                "Mining_Road",
                "Pendant",
                "Pickaxe",
                "Pilgrim",
                "Quartermaster",
                "Silver_Mine",
                "Trickster",
                "Wealthy_Village",
                "Sack_of_Loot",
                "King's_Cache",
                "Mountain_Shrine",
                "Daimyo",
                "Artist",
                "Fishmonger",
                "Snake_Witch",
                "Aristocrat",
                "Craftsman",
                "Riverboat",
                "Root_Cellar",
                "Alley",
                "Change",
                "Ninja",
                "Poet",
                "River_Shrine",
                "Rustic_Village",
                "Gold_Mine",
                "Imperial_Envoy",
                "Kitsune",
                "Litter",
                "Rice_Broker",
                "Ronin",
                "Tanuki",
                "Tea_House",
                "Samurai",
                "Rice"
            ],
            actionCards: [
                "Artisan",
                "Bandit",
                "Bureaucrat",
                "Cellar",
                "Chapel",
                "Council_Room",
                "Festival",
                "Harbinger",
                "Laboratory",
                "Library",
                "Market",
                "Merchant",
                "Militia",
                "Mine",
                "Moat",
                "Moneylender",
                "Poacher",
                "Remodel",
                "Sentry",
                "Smithy",
                "Throne_Room",
                "Vassal",
                "Village",
                "Witch",
                "Workshop",
                "Bazaar",
                "Blockade",
                "Caravan",
                "Corsair",
                "Cutpurse",
                "Fishing_Village",
                "Haven",
                "Island",
                "Lighthouse",
                "Lookout",
                "Merchant_Ship",
                "Monkey",
                "Native_Village",
                "Outpost",
                "Pirate",
                "Sailor",
                "Salvager",
                "Sea_Chart",
                "Sea_Witch",
                "Smugglers",
                "Tactician",
                "Tide_Pools",
                "Treasure_Map",
                "Treasury",
                "Warehouse",
                "Wharf",
                "Baron",
                "Bridge",
                "Conspirator",
                "Courtier",
                "Courtyard",
                "Diplomat",
                "Ironworks",
                "Lurker",
                "Masquerade",
                "Mill",
                "Mining_Village",
                "Minion",
                "Nobles",
                "Pawn",
                "Patrol",
                "Replace",
                "Secret_Passage", 
                "Shanty_Town", 
                "Steward", 
                "Swindler", 
                "Torturer", 
                "Trading_Post", 
                "Upgrade", 
                "Wishing_Well",
                "Cabin_Boy",
                "Crew",
                "Cutthroat",
                "Enlarge",
                "First_Mate",
                "Flagship",
                "Fortune_Hunter",
                "Frigate",
                "Grotto",
                "Harbor_Village",
                "Landing_Party",
                "Longship",
                "Mapmaker",
                "Maroon",
                "Mining_Road",
                "Pilgrim",
                "Quartermaster",
                "Search",
                "Secluded_Shrine",
                "Shaman",
                "Siren",
                "Stowaway",
                "Swamp_Shacks",
                "Taskmaster",
                "Trickster",
                "Wealthy_Village",
                "Alley",
                "Aristocrat",
                "Artist",
                "Change",
                "Craftsman",
                "Daimyo",
                "Fishmonger",
                "Gold_Minte",
                "Imperial_Envoy",
                "Kitsune",
                "Litter",
                "Mountain_Shrine",
                "Ninja",
                "Poet",
                "Rice_Broker",
                "River_Shrine",
                "Riverboat",
                "Ronin",
                "Root_Cellar",
                "Rustic_Village",
                "Samurai",
                "Snake_Witch",
                "Tanuki",
                "Tea_House",
                "Captain",
                "Church"
            ],
            victoryCards: [
                "Gardens",
                "Island",
                "Duke",
                "Nobles",
                "Harem",
                "Mill"
            ],
            treasureCards: [
                "Astrolabe",
                "Harem",
                "Anvil",
                "Bank",
                "Collection",
                "Crystal_Ball",
                "Hoard",
                "Investment",
                "Quarry",
                "Tiara",
                "War_Chest",
                "Abundance",
                "Buried_Treasure",
                "Cage",
                "Crucible",
                "Figurine",
                "Gondola",
                "Jewelled_Egg",
                "King's_Cache",
                "Pendant",
                "Pickaxe",
                "Rope",
                "Sack_Of_Loot",
                "Silver_Mine",
                "Tools",
            ],
            attackCards: [
                "Bandit",
                "Bureaucrat",
                "Militia",
                "Witch",
                "Blockade",
                "Corsair",
                "Cutpurse",
                "Sea_Witch",
                "Swindler",
                "Minion",
                "Replace",
                "Torturer",
                "Cutthroat",
                "Attack",
                "Siren",
                "Trickster",
                "Kitsune",
                "Ninja",
                "Samurai",
                "Snake_Witch",
            ],
            reactionCards: [
                "Moat",
                "Pirate",
                "Diplomat",
                "Watchtower",
                "Clerk",
                "Stowaway",
                "Mapmaker",
            ],
            durationCards: [
                "Caravan",
                "Fishing_Village",
                "Haven",
                "Lighthouse",
                "Merchant_Ship",
                "Monkey",
                "Outpost",
                "Sailor",
                "Tactician",
                "Tide_Pools",
                "Wharf",
                "Blockade",
                "Sea_Witch",
                "Corsair",
                "Pirate",
                "Captain",
                "Abundance",
                "Buried_Treasure",
                "Cabin_Boy",
                "Cage",
                "Crew",
                "Cutthroat",
                "Enlarge",
                "Flagship",
                "Frigate",
                "Gondola",
                "Grotto",
                "Landing_Party",
                "Longship",
                "Quartermaster",
                "Rope",
                "Search",
                "Secluded_Shrine",
                "Siren",
                "Stowaway",
                "Taskmaster",
                "Riverboat",
                "Samurai"
            ],
            commandCards: [
                "Captain",
                "Flagship",
                "Daimyo"
            ],
            shadowCards: [
                "Alley",
                "Fishmonger",
                "Ninja",
                "Ronin",
                "Tanuki",  
            ],
            omenCards: [
                "Kitsune",
                "Mountain_Shrine",
                "Poet",
                "River_Shrine",
                "Rustic_Village",
                "Tea_House"
            ],
            lootCards: [
                "Cutthroat",
                "Jewelled_Egg",
                "Pickaxr",
                "Sam_Of_Loot",
                "Search",
                "Weathy_Village"
            ],
            events: [
                "Summon",
                "Continue",
                "Amass",
                "Asceticism",
                "Credit",
                "Foresight",
                "Kintsugi",
                "Practice",
                "Sea_Trade",
                "Receive_Tribute",
                "Gather",
                "Bury",
                "Avoid",
                "Deliver",
                "Peril",
                "Rush",
                "Foray",
                "Launch",
                "Mirror",
                "Prepare",
                "Scrounge",
                "Journey",
                "Maelstrom",
                "Looting",
                "Invasion",
                "Prosper"
            ],
            traits: [
                "Cheap",
                "Cursed",
                "Fated",
                "Fawning",
                "Friendly",
                "Hasty",
                "Inherited",
                "Inspiring",
                "Nearby",
                "Patient",
                "Pious",
                "Reckless",
                "Rich",
                "Shy",
                "Tireless"
            ],
            prophecies: [
                "Approaching_Army",
                "Biding_Time",
                "Bureaucracy",
                "Divine_Wind",
                "Enlightenment",
                "Flourishing_Trade",
                "Good_Harvest",
                "Great_Leader",
                "Growth",
                "Harsh_Winter",
                "Kind_Emperor",
                "Panic",
                "Progress",
                "Rapid_Expansion",
                "Sickness"
            ],
        }
    },
    components: {
        
    },
    computed: {
        filteredCards() {
        if (this.selectedExpansions.length === 0) {
            return this.cards; // Show all cards if no expansion is selected
        }
        return this.cards.filter(card => this.selectedExpansions.includes(card.expansion));
        },
    },
    methods: {
        toggleExpansion(expansion) {
            if (this.selectedExpansions.includes(expansion)) {
                this.selectedExpansions = this.selectedExpansions.filter(item => item !== expansion);
            } else {
                this.selectedExpansions.push(expansion);
            }
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
        startGame() {
            console.log('starting game')
        },
        clearSelections() {
            console.log('clearing selections')
            this.selectedCards = [];
        },
        selectedFill() {
            console.log('getting cards from this list')
        },
        anyFill() {
            let tempCardList = JSON.parse(JSON.stringify(this.cardList));
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
        generateAdvancedKingdom(){
            this.selectedCards = [];
            this.selectedAddons = [];
            console.log(this.selectedAdvancedExpansions)
            console.log(this.selectedAdvancedCardTypes)
            if(this.selectedAdvancedCardTypes.includes('Prophecy')) {
                let numOmen = 0;
                let addedCount = 0;
                let attempts = 0;
                let randomChance = Math.floor(Math.random() * 100);

                if(randomChance < 71) {
                    numOmen = 1
                } else {
                    numOmen = 2
                }

                while (addedCount < numOmen && attempts < 20) {
                    attempts++;
                    let randomIndex = Math.floor(Math.random() * this.omenCards.length);
                    let cardName = this.omenCards[randomIndex];

                    if (!this.selectedCards.includes(cardName)) {
                        this.selectedCards.push(cardName);
                        addedCount++;
                    }
                }

                let prophecyRandomIndex = Math.floor(Math.random() * this.prophecies.length);
                let cardName = this.prophecies[prophecyRandomIndex];
                console.log('prophecy', cardName)
            }

            if(this.selectedAdvancedCardTypes.includes('Event')) {
                let numEvent = 0;
                let addedCount = 0;
                let attempts = 0;
                let randomChance = Math.floor(Math.random() * 100);

                if(randomChance < 71) {
                    numEvent = 1
                } else {
                    numEvent = 2
                }

                console.log('num events', numEvent)

                while (addedCount < numEvent && attempts < 20) {
                    attempts++;
                    let randomIndex = Math.floor(Math.random() * this.events.length);
                    let eventName = this.events[randomIndex];

                    if (!this.selectedAddons.includes(eventName)) {
                        this.selectedAddons.push(eventName);
                        addedCount++;
                    }
                }

                console.log('addons', this.selectedAddons)
            }
        },
        async fetchUsersPlayedWith(user) {
            axios.get(`http://127.0.0.1:8000/getuseruniqueplayers/${user}`, {
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
    computed: {

    },
    created() {
        
    }
}
</script>

<style scoped>
.section {
    display: flex;
    flex-direction: row !important;
}
#overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Adjust the alpha value for transparency */
    backdrop-filter: blur(3px); /* Apply the blur effect to the overlay */
    z-index: 1000; /* Ensure the overlay is behind the popup */
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
    background-color: rgba(0, 0, 0, 0.5); /* Adjust the alpha value for transparency */
    backdrop-filter: blur(3px); /* Apply the blur effect to the overlay */
    z-index: 1000; /* Ensure the overlay is behind the popup */
}

.gamepopup {
    width: 800px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #242526;
    border-radius: 2%;
    text-align: center;
    z-index: 1001;
    height: 680px;
}
.popupContainer {
    width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 25px;
}
</style>