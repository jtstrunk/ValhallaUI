<template>
    <div class="section" style="background-color: #18191A;">
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
            <img v-for="card in filteredCards" :key="card.name" :alt="card.name"
                :src="'src/assets/dominioncards/200px-' + card.name + '.jpg'" />
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
                <button class="btn-start" @click="generateAdvancedKingdom">Generate Advanced Kingdom</button>
            </div>
            <div style="margin-top: 10px; display: flex; flex-direction: row; flex-wrap: wrap; width: 720px;">
                <img v-for="card in selectedCards" :key="card" :alt="card" class="tinyCard"
                    :src="'src/assets/dominioncards/200px-' + card + '.jpg'" 
                    :class="{ traitCards: this.traitCards.includes(card) }" @click="removeCard(card)" />
            </div>
            <div style="margin-top: 10px; display: flex; flex-direction: row; flex-wrap: wrap; width: 660px;">
                <img v-for="card in selectedAddons" :key="card" :alt="card" class="addonCard"
                    :src="'src/assets/dominioncards/' + card + '.jpg'" />
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
            showDialog: false,
            expansions: ['Dominion', 'Intrigue', 'Seaside', 'Prosperity', 'Plunder', 'Rising Sun'],
            cardTypes: ['Treasure', 'Victory', 'Shadow', 'Debt', 'Loot', 'Col & Plat', 'Prophecy', 'Event', 'Trait'],
            categories: ['Village', 'Cantrip', 'Gainer', 'Trasher', 'Sifter', 'Terminal Draw', 'Terminal Silver', '', '', '', '', '', '', '', '', '', '', ''],
            selectedAdvancedExpansions: [],
            selectedAdvancedCardTypes: [],
            selectedExpansions: [],
            selectedTypes: [],
            selectedCategories: [],
            selectedCards: [],
            selectedAddons: [],
            traitCards: [],
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
                "Sack_of_Loot",
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
            debtCards: [
                "Artist",
                "Change",
                "Craftsman",
                "Daimyo",
                "Gold_Mine",
                "Imperial_Envoy",
                "Litter",
                "Mountain_Shrine",
                "Root_Cellar"
            ],
            lootCards: [
                "Cutthroat",
                "Jewelled_Egg",
                "Pickaxe",
                "Sack_of_Loot",
                "Search",
                "Wealthy_Village"
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
            console.log('remove this card', card)
            let index = this.selectedCards[card]
            this.selectedCards.splice(index, 1);
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
            this.traitCards = [];
            console.log(this.selectedAdvancedExpansions)
            console.log(this.selectedAdvancedCardTypes)

            if(this.selectedAdvancedCardTypes.includes('Treasure')) {
                let numTreasure = 0;
                let addedCount = 0;
                let attempts = 0;
                let randomChance = Math.floor(Math.random() * 100);

                if(this.selectedAdvancedCardTypes.includes('Col & Plat')) {
                    console.log('change them joints fr')
                    if(randomChance <= 60) {
                        numTreasure = 1;
                    } else if(60 < randomChance <= 95) {
                        numTreasure = 2;
                    } else {
                        numTreasure = 3;
                    }
                } else {
                    if(randomChance <= 40) {
                        numTreasure = 1;
                    } else if(45 < randomChance <= 85) {
                        numTreasure = 2;
                    } else {
                        numTreasure = 3;
                    }
                }

                while (addedCount < numTreasure && attempts < 20) {
                    attempts++;
                    let randomIndex = Math.floor(Math.random() * this.treasureCards.length);
                    let cardName = this.treasureCards[randomIndex];

                    if (!this.selectedCards.includes(cardName)) {
                        this.selectedCards.push(cardName);
                        addedCount++;
                    }
                }
            }

            if(this.selectedAdvancedCardTypes.includes('Victory')) {
                let numVictory = 0;
                let addedCount = 0;
                let attempts = 0;
                let randomChance = Math.floor(Math.random() * 100);

                if(randomChance <= 55) {
                    numVictory = 1;
                } else if(55 < randomChance <= 95) {
                    numVictory = 2;
                } else {
                    numVictory = 3;
                }

                while (addedCount < numVictory && attempts < 20) {
                    attempts++;
                    let randomIndex = Math.floor(Math.random() * this.victoryCards.length);
                    let cardName = this.victoryCards[randomIndex];

                    if (!this.selectedCards.includes(cardName)) {
                        this.selectedCards.push(cardName);
                        addedCount++;
                    }
                }
            }

            if(this.selectedAdvancedCardTypes.includes('Shadow')) {
                let numShadow = 0;
                let addedCount = 0;
                let attempts = 0;
                let randomChance = Math.floor(Math.random() * 100);

                if(randomChance <= 92) {
                    numShadow = 1;
                } else {
                    numShadow = 2;
                }

                while (addedCount < numShadow && attempts < 20) {
                    attempts++;
                    let randomIndex = Math.floor(Math.random() * this.shadowCards.length);
                    let cardName = this.shadowCards[randomIndex];

                    if (!this.selectedCards.includes(cardName)) {
                        this.selectedCards.push(cardName);
                        addedCount++;
                    }
                }
            }

            if(this.selectedAdvancedCardTypes.includes('Debt')) {
                let numDebt = 0;
                let addedCount = 0;
                let attempts = 0;
                let randomChance = Math.floor(Math.random() * 100);

                if(randomChance <= 45) {
                    numDebt = 1;
                } else if(45 < randomChance <= 80) {
                    numDebt = 2;
                } else {
                    numDebt = 3;
                }
                
                while (addedCount < numDebt && attempts < 20) {
                    attempts++;
                    let randomIndex = Math.floor(Math.random() * this.debtCards.length);
                    let cardName = this.debtCards[randomIndex];

                    if (!this.selectedCards.includes(cardName)) {
                        this.selectedCards.push(cardName);
                        addedCount++;
                    }
                }
            }

            if(this.selectedAdvancedCardTypes.includes('Loot')) {
                let numLoot = 0;
                let addedCount = 0;
                let attempts = 0;
                let randomChance = Math.floor(Math.random() * 100);

                if(randomChance <= 65) {
                    numLoot = 1;
                } else{
                    numLoot = 2;
                } 

                while (addedCount < numLoot && attempts < 20) {
                    attempts++;
                    let randomIndex = Math.floor(Math.random() * this.lootCards.length);
                    let cardName = this.lootCards[randomIndex];

                    if (!this.selectedCards.includes(cardName)) {
                        this.selectedCards.push(cardName);
                        addedCount++;
                    }
                }
            }

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
                if (!this.selectedAddons.includes(cardName)) {
                    this.selectedAddons.push(cardName);
                }
            }

            if(this.selectedAdvancedCardTypes.includes('Event')) {
                let numEvent = 0;
                let addedCount = 0;
                let attempts = 0;
                let randomChance = Math.floor(Math.random() * 100);

                if (this.prophecies.some(prophecy => this.selectedAddons.includes(prophecy))) {
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
                    let randomIndex = Math.floor(Math.random() * this.events.length);
                    let eventName = this.events[randomIndex];

                    if (!this.selectedAddons.includes(eventName)) {
                        this.selectedAddons.push(eventName);
                        addedCount++;
                        console.log('event', eventName)
                    }
                }
            }

            if(this.selectedAdvancedCardTypes.includes('Trait')) {
                let numTrait = 0;
                let addedCount = 0;
                let attempts = 0;
                let randomChance = Math.floor(Math.random() * 100);

                if(randomChance < 71) {
                    numTrait = 1
                } else {
                    numTrait = 2
                }

                while (addedCount < numTrait && attempts < 20) {
                    attempts++;
                    let randomIndex = Math.floor(Math.random() * this.traits.length);
                    let traitName = this.traits[randomIndex];

                    if (!this.selectedAddons.includes(traitName)) {
                        this.selectedAddons.push(traitName);
                        addedCount++;
                    }
                }
            }

            console.log(this.selectedCards)
            this.anyFill()
            if(!this.prophecies.some(prophecy => this.selectedAddons.includes(prophecy)) 
                && this.omenCards.some(omen => this.selectedCards.includes(omen))) {
                let prophecyRandomIndex = Math.floor(Math.random() * this.prophecies.length);
                let cardName = this.prophecies[prophecyRandomIndex];
                if (!this.selectedAddons.includes(cardName)) {
                    this.selectedAddons.push(cardName);
                }
            }

            let traitNumber = 0;
            let traitCount = 0;
            let attempts = 0;
            this.traits.forEach(trait => {
                if (this.selectedAddons.includes(trait)) {
                    traitNumber++;
                }
            });
            while (traitCount < traitNumber && attempts < 20) {
                let randomNumber = Math.floor(Math.random() * 10);
                console.log('randomNumber', randomNumber)
                console.log('card', this.selectedCards[randomNumber])
                if(!this.traitCards.includes(this.selectedCards[randomNumber])) {
                    this.traitCards.push(this.selectedCards[randomNumber])
                    traitCount++;
                }
                attempts++
            }
            console.log('Number of matching traits:', this.traitNumber);
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
    created() {
        this.cards = [
            {
                name: "Cellar",
                set: "Dominion",
                types: ["Action"],
                categories: [""]
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
                categories: [""]
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
                categories: [""]
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
                categories: [""]
            },
            {
                name: "Moneylender",
                set: "Dominion",
                types: ["Action"],
                categories: ["Trasher"]
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
                categories: [""]
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
                categories: [""]
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
                categories: [""]
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
                categories: ["Cantrip", "Trasher"]
            },
            {
                name: "Witch",
                set: "Dominion",
                types: ["Action", "Attack"],
                categories: [""]
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
                categories: ["Trasher"]
                
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
                categories: [""]
                
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
                categories: [""]
                
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
                categories: [""]
                
            },
            {
                name: "Merchant_Ship",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: [""]
                
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
                categories: [""]
                
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
                categories: [""]
                
            },
            {
                name: "Courtyard",
                set: "Intrigue",
                types: ["Action"],
                categories: [""]
                
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
                categories: ["Trasher", "Trasher"]
                
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
                categories: ["Trasher"]
                
            },
            {
                name: "Swindler",
                set: "Intrigue",
                types: ["Action", "Attack"],
                categories: [""]
                
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
                name: "Conspirator",
                set: "Intrigue",
                types: ["Action"],
                categories: [""]
                
            },
            {
                name: "Diplomat",
                set: "Intrigue",
                types: ["Action", "Reaction"],
                categories: ["Village"]
                
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
                categories: [""]
                
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
                categories: [""]
            },
            {
                name: "Patrol",
                set: "Intrigue",
                types: ["Action"],
                categories: [""]
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
                categories: [""]
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
                categories: ["Village"]
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
                categories: ["Trasher"]
            },
            {
                name : "Bishop",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Trasher"]
            },
            {
                name : "Clerk",
                set: "Prosperity",
                types: ["Action", "Reaction", "Attack"],
                categories: [""]
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
                categories: [""]
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
                categories: ["Trasher"]
            },
            {
                name : "Magnate",
                set: "Prosperity",
                types: ["Action"],
                categories: [""]
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
                categories: [""]
            },
            {
                name : "Vault",
                set: "Prosperity",
                types: ["Action"],
                categories: [""]
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
                categories: [""]
            },
            {
                name: "Jewelled_Egg",
                set: "Plunder",
                types: ["Treasure"],
                categories: [""]
            },
            {
                name: "Search",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: [""]
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
                categories: ["Village"]
            },
            {
                name: "Fortune_Hunter",
                set: "Plunder",
                types: ["Action"],
                categories: [""]
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
                categories: [""]
            },
            {
                name: "Maroon",
                set: "Plunder",
                types: ["Action"],
                categories: ["Trasher"]
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
                categories: [""]
            },
            {
                name: "Cutthroat",
                set: "Plunder",
                types: ["Action", "Duration", "Attack"],
                categories: [""]
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
                categories: [""]
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
                categories: ["Trasher"]
            },
            {
                name: "Pilgrim",
                set: "Plunder",
                types: ["Action"],
                categories: [""]
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
                categories: ["Village"]
            },
            {
                name: "Sack_of_Loot",
                set: "Plunder",
                types: ["Treasure"],
                categories: [""]
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
                categories: ["Trasher"]
            },
            {
                name: "Daimyo",
                set: "Rising Sun",
                types: ["Action", "Command"],
                categories: ["Village", "Cantrip"]
            },
            {
                name: "Artist",
                set: "Rising Sun",
                types: ["Action"],
                categories: [""]
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
                categories: ["Village"]
            },
            {
                name: "Craftsman",
                set: "Rising Sun",
                types: ["Action"],
                categories: ["Gainer"]
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
                categories: [""]
            },
            {
                name: "Alley",
                set: "Rising Sun",
                types: ["Action", "Shadow"],
                categories: ["Cantrip"]
            },
            {
                name: "Change",
                set: "Rising Sun",
                types: ["Action"],
                categories: [""]
            },
            {
                name: "Ninja",
                set: "Rising Sun",
                types: ["Action", "Attack", "Shadow"],
                categories: [""]
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
                categories: ["Village"]
            },
            {
                name: "Gold_Mine",
                set: "Rising Sun",
                types: ["Action"],
                categories: ["Cantrip"]
            },
            {
                name: "Imperial_Envoy",
                set: "Rising Sun",
                types: ["Action"],
                categories: [""]
            },
            {
                name: "Kitsune",
                set: "Rising Sun",
                types: ["Action", "Attack", "Omen"],
                categories: ["Village"]
            },
            {
                name: "Litter",
                set: "Rising Sun",
                types: ["Action"],
                categories: ["Village"]
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
                categories: [""]
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
    }
}
</script>

<style scoped>
.section {
    display: flex;
    flex-direction: row !important;
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
    width: 820px;
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
    overflow-y: scroll;
    scrollbar-width: thin;
    scrollbar-color: #888 #242526;
}
.gamepopup::-webkit-scrollbar {
    width: 8px;
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
    width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 25px;
}
.traitCards {
    border: 3.5px solid purple;
}
</style>