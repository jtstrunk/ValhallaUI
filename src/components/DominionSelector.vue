<template>
    <div class="section" id="dominionSelector" style="background-color: #18191A; margin: 0px; padding: 0px;">
        <!-- Mobile -->
        <div v-if="isMobile" id="filters">
            <div style="margin-left: 8px; display: flex; flex-direction: row; width: 98%; overflow-x: auto;">
                <div>
                    <p style="margin-top: 6px; margin-bottom: 4px;">Expansions</p>
                    <div style="display: flex; flex-direction: row;">
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
            </div>
            <div style="margin-left: 8px; display: flex; flex-direction: row; width: 98%; overflow-x: auto;">
                <div>
                    <p style="margin-top: 6px; margin-bottom: 4px;">Types</p>
                    <div style="display: flex; flex-direction: row;">
                        <button
                            v-for="type in types"
                            style="margin: 2px 0"
                            :key="type"
                            @click="toggleType(type)"
                            :class="{
                                'btn-dark': !selectedTypes.includes(type),
                                'btn-seleced': selectedTypes.includes(type)
                            }" > {{ type }}
                        </button>
                    </div>
                </div>
                <div>
                    <p style="margin-top: 6px; margin-bottom: 4px;">Categories</p>
                    <div style="display: flex; flex-direction: row;">
                        <button
                            v-for="category in categories"
                            style="margin: 2px 0"
                            :key="category"
                            @click="toggleCategory(category)"
                            :class="{
                                'btn-dark': !selectedCategories.includes(category),
                                'btn-seleced': selectedCategories.includes(category)
                            }" > {{ category }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isMobile" id="cards" class="show-all" style="margin-left: 5px;">
            <div style="display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 7px; margin-top: 7px;">
                <div style="margin-left: 8px;">
                    <p style="margin: 4px 0; font-family: 'Manolo Mono', sans-serif !important;">Filter By</p>
                    <div id="filterByOptions" style="display: flex; flex-direction: row; justify-content: space-between;">
                        <div class="searchType">
                            <input type="radio" id="exclusive" value="exclusive" v-model="searchType">
                            <label for="exclusive">Match Every</label>
                        </div>
                        <div class="searchType" style="margin-left: 12px;">
                            <input type="radio" id="inclusive" value="inclusive" v-model="searchType">
                            <label for="inclusive">Match Any</label>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <button class="btn btn-main" :class="filterMode === 'banned' ? 'btn-customlist' : 'btn-outline'"
                            style="width: 98px; outline: none; margin-left: 2px;" @click="showBanned()">Banned</button>
                        <button class="btn btn-main" :class="filterMode === 'favorites' ? 'btn-customlist' : 'btn-outline'"
                            style="width: 98px; outline: none; margin-left: 2px;" @click="showFavorites()">Favorites</button>
                    </div>
                    <button @click="this.showDialog=!this.showDialog" id="advancedKingdom" 
                        class="btn-option btn-dark" style="width: 198px !important; margin-bottom: 5px; margin-top: 8px;  margin-right: 8px;">Generate Advanced Kingdom</button>
                </div>
            </div>
            <div class="card-wrapper" v-for="card in filteredCards" :key="card.name">
                <img :alt="card.name" :src="getCardImage(card.name)" @click="addCard(card)" />
                <span  v-if="filterMode === 'favorites'" class="delete-icon" 
                    @click.stop="removeFavorite(card)" >×</span>
                <span v-if="filterMode === 'banned'" class="delete-icon"
                    @click.stop="removeBanned(card)" >×</span>
            </div>
        </div>

        <!-- Desktop -->
        <div v-if="!isMobile" id="filters">
            <div id="expansions">
                <button class="btn btn-main" :class="filterMode === 'favorites' ? 'btn-customlist' : 'btn-outline'"
                    style="outline: none; margin-bottom: 2.5px;" @click="showFavorites()">Favorites</button>
                <button id="Set" class="btn" :class="showSets ? 'btn-outline' : 'btn-main'" style="outline: none; margin-bottom: 2px;" @click="toggleCollapse('Set')">Expansions</button>
                <div v-if="this.showSets" id="collapsibleSets">
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
                    <button disabled class="btn-dark" style="margin: 2px 0">Hinterlands</button>
                    <button disabled class="btn-dark" style="margin: 2px 0">Guilds & Cornu</button>
                    <button disabled class="btn-dark" style="margin: 2px 0">Renaissance</button>
                    <button disabled class="btn-dark" style="margin: 2px 0">Allies</button>
                </div>
            </div>
            <div>
                <button class="btn btn-main" :class="filterMode === 'banned' ? 'btn-customlist' : 'btn-outline'"
                    style="outline: none; margin-bottom: 2.5px;" @click="showBanned()">Banned</button>
                <div id="types">
                    <button id="Type" class="btn" :class="showTypes ? 'btn-outline' : 'btn-main'" style="outline: none; margin-bottom: 2px;" @click="toggleCollapse('Type')">Types</button>
                    <div v-if="this.showTypes" id="collapsibleButtons">
                        <button
                            v-for="type in types"
                            style="margin: 2px 0"
                            :key="type"
                            @click="toggleType(type)"
                            :class="{
                                'btn-dark': !selectedTypes.includes(type),
                                'btn-seleced': selectedTypes.includes(type)
                            }" > {{ type }}
                        </button>
                    </div>
                </div>
                <div id="categories">
                    <button id="Category" class="btn" :class="showCategories ? 'btn-outline' : 'btn-main'" style="outline: none; margin: 2px 0;" @click="toggleCollapse('Category')">Categories</button>
                    <div v-if="this.showCategories" id="collapsibleCategories">
                        <button
                            v-for="category in categories"
                            style="margin: 2px 0"
                            :key="category"
                            @click="toggleCategory(category)"
                            :class="{
                                'btn-dark': !selectedCategories.includes(category),
                                'btn-seleced': selectedCategories.includes(category)
                            }" > {{ category }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!isMobile" id="cards" class="show-all">
            <!-- <button @click="console.clear()">clear console</button>
            <button @click="testfunction()">test func</button> -->

            <div style="display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 5px;">
                <div style="margin-left: 8px;">
                    <p style="margin: 4px 0; font-family: 'Manolo Mono', sans-serif !important;">Filter By</p>
                    <div style="display: flex; flex-direction: row; justify-content: space-between;">
                        <div class="searchType">
                            <input type="radio" id="exclusive" value="exclusive" v-model="searchType">
                            <label for="exclusive">Match Every</label>
                        </div>
                        <div class="searchType" style="margin-left: 12px;">
                            <input type="radio" id="inclusive" value="inclusive" v-model="searchType">
                            <label for="inclusive">Match Any</label>
                        </div>
                    </div>
                </div>
                <div v-if="this.filterMode=='favorites'">
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <label for="favoriteSuggestions">Add a Favorite Card</label>
                        <AutoComplete :suggestions="favoriteSuggestions" optionLabel="name" ref="favoritesAutocomplete"
                            @complete="searchFavorites" @item-select="addFavorite($event)" id="favoriteSuggestions" @focus="showFavoriteSuggestions"
                            class="custom-autocomplete" optionValue="name"
                            :pt="{
                                root: {
                                    class: 'customAutocomplete',
                                },
                                option:
                                {
                                    style: { color: 'white', padding: '4px 8px'}
                                },
                                overlay: {
                                    style: { backgroundColor: '#404040', transform: 'translateY(8px) translateX(-6px)',
                                    borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'}
                                },
                                pcInputText: {
                                    style: { '::placeholder': { color: '#2e6da4' } }
                                }
                        }"></AutoComplete>
                    </div>
                </div>
                <div v-if="this.filterMode=='banned'">
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <label for="bannedSuggestions">Add a Banned Card</label>
                        <AutoComplete :suggestions="bannedSuggestions" optionLabel="name" ref="bannedAutocomplete"
                            @complete="searchBanned" @item-select="addBanned($event)" id="bannedSuggestions" @focus="showBannedSuggestions"
                            class="custom-autocomplete" optionValue="name"
                            :pt="{
                                root: {
                                    class: 'customAutocomplete',
                                },
                                option:
                                {
                                    style: { color: 'white', padding: '4px 8px'}
                                },
                                overlay: {
                                    style: { backgroundColor: '#404040', transform: 'translateY(8px) translateX(-6px)',
                                    borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'}
                                },
                                pcInputText: {
                                    style: { '::placeholder': { color: '#2e6da4' } }
                                }
                        }"></AutoComplete>
                    </div>
                </div>
                <div style="margin-top: 21px; margin-right: 5px;">
                    <label id="numCardsLabel" style="font-size: 18px; margin-left: 8px;">Generate Cards</label>
                    <input v-model.number="numGenerateCards" id="numGenerateCards">
                </div>
            </div>
            <div class="card-wrapper" v-for="card in filteredCards" :key="card.name">
                <img :alt="card.name" :src="getCardImage(card.name)" @click="addCard(card)" />
                <span  v-if="filterMode === 'favorites'" class="icon delete-icon" 
                    @click.stop="removeFavorite(card)" >×</span>
                <span v-if="filterMode === 'banned'" class="icon delete-icon"
                    @click.stop="removeBanned(card)" >×</span>
            </div>
        </div>
        <div v-if="!isMobile" id="selectedCards" >
            <span class="special">Start a Game</span>
            <div class="buttons" style="margin-bottom: 8px;">
                <button @click="startCounter()" id="selectedCardsbtn" class="btn-option btn-dark">Use Selected Cards</button>
                <button @click="clearSelections()" id="clearSele" class="btn-option btn-dark">Clear Selections</button>
            </div>
            <button @click="this.showDialog=!this.showDialog" id="advancedKingdom" 
                class="btn-option btn-dark" style="width: 302px !important; margin-bottom: 10px;">Generate Advanced Kingdom</button>
            <div class="buttons">
                <span class="special" style="margin-top: 15px !important;">Select Random Cards From</span>
            </div>
            <div class="buttons">
                <button @click="selectedFill()" id="selectedFill" class="btn-option btn-dark">Selected Filters</button>
                <button @click="anyFill()" id="randomFill" class="btn-option btn-dark">Any Filter</button>
            </div>
            <div id="selcards">
                <img v-for="card in selectedCards" :key="card.name" class="miniCard"
                    :src="getCardImage(card.name)" @click="removeCard(card)" :alt="card.name" />
            </div>
        </div>
    </div>

    <div id="overlay" v-if="this.showDialog" @click="this.showDialog=!this.showDialog"></div>
    <div id="popups" class="gamepopup" v-if="this.showDialog">
        <p v-if="isMobile" id="exitPopupMobile" @click="this.showDialog=!this.showDialog">X</p>
        <div class="popupContainer">
            <p>Dominion Kingdom Creation</p>
            <div id="advancedFilters" >
                <span v-if="isMobile" class="tags">Kingdom Features</span>
                <div id="cardTypeContainer">
                    <button
                        v-for="cardType in cardTypes"
                        :key="cardType"
                        @click="toggleAdvancedcardType(cardType)"
                        class="btn-smaller"
                        :class="{
                            'btn-dark': !selectedAdvancedCardTypes.includes(cardType),
                            'btn-seleced': selectedAdvancedCardTypes.includes(cardType)
                        }" > {{ cardType }}
                    </button>
                </div>
                <span v-if="isMobile" class="tags">Expansions</span>
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; width: 340px; height: 112.5px; justify-content: space-between;">
                    <button
                        v-for="expansion in expansions"
                        :key="expansion"
                        @click="toggleAdvancedExpansion(expansion)"
                        :class="{
                            'btn-dark': !selectedAdvancedExpansions.includes(expansion),
                            'btn-seleced': selectedAdvancedExpansions.includes(expansion)
                        }" > {{ expansion }}
                    </button>
                    <button disabled class="btn-dark">Hinterlands</button>
                </div>
            </div>
            <div>
                <button class="btn-start" @click="generateAdvancedKingdom">Generate Kingdom</button>
                <button class="btn-start" @click="fillFromExpansions()" style="margin-left: 5px;">Populate Cards</button>
                <button class="btn-start" @click="startCounter()" style="margin-left: 5px;">Start Counter</button>
                <!-- <button @click="console.clear()">clear console</button> -->
            </div>
            <div style="display: flex; flex-direction: row;">
                <div id="advancedCards">
                    <img v-for="card in selectedCards" :key="card.name" :alt="card" class="tinyCard"
                        :src="getCardImage(card.name)" :class="{ traitCards: traitCards.includes(card), 
                            obeliskcard: obeliskCard === card.name }"  @click="removeCard(card)" />
                </div>
                <div v-if="this.containsRiverboat && !isMobile" style="display: flex; align-items: center; margin-left: 10px;">
                    <div class="card-wrapper" :key="this.riverboatCard">
                        <img class="riverboatCard" :src="getCardImage(this.riverboatCard)" />
                        <img src="../assets/icons/refresh.webp" class="icon refresh-icon" @click="regenerateRiverboatCard(this.riverboatCard)" />
                    </div>
                </div>
            </div>
            <div id="advancedLandscapes">
                <div class="card-wrapper" v-for="card in selectedAddons" :key="card.name">
                    <img :alt="card" :src="getLandscapesImage(card)" class="tinyLandscape"/>
                    <img src="../assets/icons/refresh.webp" class="icon refresh-icon"  @click="regenerateLandscape(card)"/>
                </div>
                <div v-if="containsTrait && this.numberTraits < 2" @click="addTrait()" style="display: flex; flex-direction: column; justify-content: center; margin-left: 20px">
                    <img id="addRecordImg" src="/src/assets/icons/add.webp">
                    <span style="margin-bottom: 15px; color: #fff; font-family: 'Manolo Mono', sans-serif !important;">Add Trait</span>
                </div>
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
            favorites: [],
            favoriteSuggestions: [],
            banned: [],
            bannedSuggestions: [],
            filterMode: null,
            userName: userState.username,
            userID: userState.userID,
            numGenerateCards: 10,
            searchType: 'exclusive',
            showDialog: false,
            showSets: true,
            showTypes: true,
            showCategories: false,
            expansions: ['Dominion', 'Intrigue', 'Seaside', 'Prosperity', 'Adventures', 'Empires', 'Plunder', 'Rising Sun'],
            types: ['Action', 'Attack', 'Reaction', 'Victory', 'Treasure', 'Duration', 'Command', 'Reserve', 'Castle', 'Gathering', 'Shadow', 'Omen'],
            categories: ['Village', 'Cantrip', 'Gainer', 'Trasher', 'Sifter', 'Terminal Draw', 'Terminal Silver'],
            cardTypes: ['Victory', 'Treasure', 'Gathering', 'Shadow', 'Player Mats', 'Split Pile', 'Debt', 'Loot', 'Event', 'Landmark', 'Trait', 'Prophecy',],
            selectedAdvancedExpansions: ['Dominion', 'Intrigue', 'Seaside', 'Adventures' , 'Empires', 'Plunder'],
            // selectedAdvancedExpansions: ['Rising Sun'],
            selectedAdvancedCardTypes: [],
            selectedExpansions: ['Dominion'],
            selectedExpansionsLandscapeList: [],
            selectedTypes: [],
            selectedCategories: [],
            selectedCards: [],
            selectedAddons: [],
            traitCards: [],
            prophecies: [],
            omenCards: [],
            containsRiverboat: false,
            numberTraits: 0,
            riverboatCard: "",
            obeliskCard: "",
            splitPileCheck: {
                'Treasure_Hunter': 'Page',
                'Warrior': 'Page',
                'Hero': 'Page',
                'Champion': 'Page',
                'Soldier': 'Peasant',
                'Fugitive': 'Peasant',
                'Disciple': 'Peasant',
                'Teacher': 'Peasant',
                'Encampment': 'Encampment_Plunder',
                'Plunder': 'Encampment_Plunder',
                'Patrician': 'Patrician_Emporium',
                'Emporium': 'Patrician_Emporium',
                'Settlers': 'Settlers_Bustling_Village',
                'Bustling_Village': 'Settlers_Bustling_Village',
                'Catapult': 'Catapult_Rocks',
                'Rocks': 'Catapult_Rocks',
                'Gladiator': 'Gladiator_Fortune',
                'Fortune': 'Gladiator_Fortune',
                'Humble_Castle': 'Castles',
                'Crumbling_Castle': 'Castles',
                'Small_Castle': 'Castles',
                'Haunted_Castle': 'Castles',
                'Opulent_Castle': 'Castles',
                'Sprawling_Castle': 'Castles',
                'Grand_Castle': 'Castles',
                "King's_Castle": 'Castles'
            }
        }
    },
    components: {
        
    },
    computed: {
        containsTrait() {
            let traits = this.selectedExpansionsLandscapeList.filter(card => card.types.includes('Trait'));
            if (this.selectedCards.length === 0) {
                return false;
            }
            if (this.selectedAddons.some(item => traits.some(trait => trait.name === item))) {
                return false;
            }
            return true;
        },
        isMobile() {
            return window.innerWidth < 420;
        },
        filteredCards() {
            if (this.filterMode === 'favorites') {
                return [...this.cards].filter(card =>
                    this.favorites.includes(card.name)
                );
            }
            if (this.filterMode === 'banned') {
                return [...this.cards].filter(card =>
                    this.banned.includes(card.name)
                );
            }

            let expansionCards = [...this.cards];
            if (this.selectedExpansions.length === 0 && this.selectedTypes.length === 0 && this.selectedCategories.length === 0) {
                return expansionCards;
            }            
            
            if (this.searchType == 'inclusive') {
                expansionCards = expansionCards.filter(card => {
                    let expansionMatch = this.selectedExpansions.includes(card.set);
                    let typeMatch = this.selectedTypes.some(selectedType => card.types.includes(selectedType));
                    let categoryMatch = this.selectedCategories.some(selectedCategory => card.categories.includes(selectedCategory));

                    return expansionMatch || typeMatch || categoryMatch;
                });
            } else if(this.searchType == 'exclusive') {
                if(this.selectedExpansions.length > 0) {
                    expansionCards = [...this.cards].filter(card =>
                        this.selectedExpansions.includes(card.set)
                    );
                }

                expansionCards = expansionCards.filter(card => {
                    return this.selectedTypes.every(selectedType => card.types.includes(selectedType));
                });
                expansionCards = expansionCards.filter(card => {
                    return this.selectedCategories.every(selectedCategory => card.categories.includes(selectedCategory));
                });
            }

            return expansionCards
        },
        selectedCards() {
            return [...this.selectedCards].sort((a, b) => {
                const debtPriority = (b.costType === 'Debt') - (a.costType === 'Debt')
                return debtPriority || b.cost - a.cost
            })
        }
    },
    methods: {
        testfunction(){
            console.log('test function')
        },
        toggleCollapse(collapseGroup){
            console.log('collapsing', collapseGroup)
            if (collapseGroup == 'Set') {
                this.showSets = !this.showSets
                console.log('new value', this.showSets)
            }
            if (collapseGroup == 'Type') {
                this.showTypes = !this.showTypes
                console.log('new value', this.showTypes)
            }
            if (collapseGroup == 'Category') {
                this.showCategories = !this.showCategories
                console.log('new value', this.showCategories)
            }
        },
        showFavoriteSuggestions() {
            this.$refs.favoritesAutocomplete.search(null, '');
        },
        searchFavorites(event) {
            const searchTerm = event.query.toLowerCase();
            this.favoriteSuggestions = this.cards
                .filter(card => {
                    const cardName = String(card.name).toLowerCase();
                    const isMatch = cardName.includes(searchTerm);
                    const alreadyExists = this.favorites.some(
                        fav => fav.toLowerCase() === card.name.toLowerCase()
                    );
                    
                    return isMatch && !alreadyExists;
                })
                .map(card => ({
                    name: card.name.replace(/_/g, ' '),
                    value: card.name
            }));
        },
        addFavorite(selectedName) {
            this.favorites.push(selectedName.value.name);
            this.insertIntoCustomList(this.userID, selectedName.value.name, 'Favorite');
        },
        removeFavorite(name){
            this.favorites = this.favorites.filter(card => card != name.name);
            this.deleteFromCustomList(this.userID, name.name, 'Favorite');
        },
        showBannedSuggestions(){
            this.$refs.bannedAutocomplete.search(null, '');
        },
        searchBanned(event) {
            const searchTerm = event.query.toLowerCase();
            this.bannedSuggestions = this.cards
                .filter(card => {
                    const cardName = String(card.name).toLowerCase();
                    const isMatch = cardName.includes(searchTerm);
                    const alreadyExists = this.banned.some(
                        fav => fav.toLowerCase() === card.name.toLowerCase()
                    );
                    
                    return isMatch && !alreadyExists;
                })
                .map(card => ({
                    name: card.name.replace(/_/g, ' '),
                    value: card.name
            }));
        },
        addBanned(selectedName) {
            this.banned.push(selectedName.value.name);
            this.insertIntoCustomList(this.userID, selectedName.value.name, 'Banned');
        },
        removeBanned(name){
            this.banned = this.banned.filter(card => card != name.name);
            this.deleteFromCustomList(this.userID, name.name, 'Banned');
        },
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
        showFavorites(){
            this.selectedExpansions = [];
            this.selectedTypes = [];
            this.selectedCategories = [];
            if(this.filterMode === 'favorites') {
                this.filterMode = null;
            } else {
                this.filterMode = 'favorites';
            }
        },
        showBanned(){
            this.selectedExpansions = [];
            this.selectedTypes = [];
            this.selectedCategories = [];
            if(this.filterMode === 'banned') {
                this.filterMode = null;
            } else {
                this.filterMode = 'banned';
            }
        },
        toggleExpansion(expansion) {
            this.filterMode = null;
            if(this.searchType == 'inclusive') {
                if (this.selectedExpansions.includes(expansion)) {
                    this.selectedExpansions = this.selectedExpansions.filter(item => item !== expansion);
                } else {
                    this.selectedExpansions.push(expansion);
                }
            } else if(this.searchType == 'exclusive') {
                if(this.selectedExpansions[0] == expansion) {
                    this.selectedExpansions = [];
                } else {
                    this.selectedExpansions = [];
                this.selectedExpansions.push(expansion);
                }
            }
        },
        toggleType(cardType) {
            this.filterMode = null;
            if (this.selectedTypes.includes(cardType)) {
                this.selectedTypes = this.selectedTypes.filter(item => item !== cardType);
            } else {
                this.selectedTypes.push(cardType);
            }
        },
        toggleCategory(category) {
            this.filterMode = null;
            if (this.selectedCategories.includes(category)) {
                this.selectedCategories = this.selectedCategories.filter(item => item !== category);
            } else {
                this.selectedCategories.push(category);
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
        addCard(card){
            let splitPileCards = this.cards.filter(card => card.tags?.includes('Split_Pile_Card'))
            if (splitPileCards.some(item => item.name === card.name)) {
                let mainCardName = this.splitPileCheck[card.name]
                let mainCard = this.cards.find(card => card.name === mainCardName);
                if (!this.selectedCards.includes(mainCard) & this.selectedCards.length < 10) {
                    this.selectedCards.push(mainCard);
                }
                return;
            }

            if (!this.selectedCards.includes(card) & this.selectedCards.length < 10) {
                this.selectedCards.push(card);
            }
        },
        removeCard(card) {
            const index = this.selectedCards.indexOf(card);
            if (index > -1) {
                this.selectedCards.splice(index, 1);
            }

            if(this.traitCards.includes(card)){
                this.traitCards = this.traitCards.filter(cardname => cardname !== card)
            }
        },
        clearSelections() {
            this.selectedCards = [];
        },
        selectedFill() {
            let tempCardList = [...this.filteredCards];
            let loopCount = this.numGenerateCards;
            if(this.numGenerateCards > 10 - this.selectedCards.length) {
                loopCount = 10 - this.selectedCards.length
            }

            let addedCount = 0;
            let attempts = 0;
            while (addedCount < loopCount && attempts < 100) {
                if (tempCardList.length == 0) {
                    break;
                }

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
        addRandomCard(cardType) {
            let attempts = 0;
            let added = false;
            while (!added && attempts < 20) {
                attempts++;
                const randomIndex = Math.floor(Math.random() * cardType.length);
                const cardName = cardType[randomIndex];

                if (!this.selectedCards.includes(cardName)) {
                    this.selectedCards.push(cardName);
                    added = true;
                }
            }
        },
        startCounter() {
            if(this.selectedAdvancedCardTypes.includes('Col & Plat') == true) {
                this.$store.dispatch('updateColonyGame', true)
            } else {
                this.$store.dispatch('updateColonyGame', false)
            }
            if(this.selectedAdvancedCardTypes.includes('Landmark') == true) {
                this.$store.dispatch('updateLandmarkName', this.selectedAddons[0])
            } else {
                this.$store.dispatch('updateLandmarkName', '')
            }
            if(this.selectedAdvancedCardTypes.includes('Event') == true) {
                let events = this.selectedExpansionsLandscapeList.filter(card => card.types.includes('Event'))
                let matchingEvents = events
                    .filter(event => this.selectedAddons.includes(event.name))
                    .map(event => event.name);
                this.$store.dispatch('updateEventName', matchingEvents)
            } else {
                this.$store.dispatch('updateEventName', [])
            }
            this.$store.dispatch('updateSelectedCards', this.selectedCards)
            this.$router.push('/dominioncounter')
        },
        fillFromExpansions(){
            this.selectedExpansionsCardList = [...this.cards];
            this.selectedExpansionsLandscapeList = [...this.landscapes];
            if (this.selectedAdvancedExpansions.length > 0) {
                this.selectedExpansionsCardList = this.selectedExpansionsCardList.filter(card =>
                    this.selectedAdvancedExpansions.includes(card.set)
                );
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
                    // this.selectedExpansionsCardList.splice(randomIndex, 1);
                    addedCount++;
                }
            }

            let traitNumber = 0;
            let traits = this.selectedExpansionsLandscapeList.filter(card => card.types.includes('Trait'))
            traits.forEach(trait => {
                if (this.selectedAddons.includes(trait.name)) {
                    traitNumber++;
                }
            });

            if(this.traitCards.length < traitNumber){
                let traitCount = this.traitCards.length;
                let attempts = 0;
                while (traitCount < traitNumber && attempts < 20) {
                    let randomNumber = Math.floor(Math.random() * 10);

                    if(!this.traitCards.includes(this.selectedCards[randomNumber])) {
                        this.traitCards.push(this.selectedCards[randomNumber])
                        traitCount++;
                    }
                    attempts++
                }
            }

            if(this.prophecies.some(prophecy => this.selectedAddons.includes(prophecy.name)) &&
                !this.omenCards.some(omen => this.selectedCards.some(card => card.name === omen.name))) {
                    this.selectedAddons = this.selectedAddons.filter(
                        addonName => !this.prophecies.some(prophecy => prophecy.name === addonName)
                    );
            }
            if(!this.prophecies.some(prophecy => this.selectedAddons.includes(prophecy.name)) 
                && this.omenCards.some(omen => this.selectedCards.some(card => card.name === omen.name))) {
                let prophecyRandomIndex = Math.floor(Math.random() * this.prophecies.length);
                let cardName = this.prophecies[prophecyRandomIndex].name;
                if (!this.selectedAddons.includes(cardName)) {
                    this.selectedAddons.push(cardName);
                }
            }

            if (this.selectedCards.some(card => card.name === 'Riverboat')){
                this.potentialRiverboatCards = this.selectedExpansionsCardList.filter(card => card.cost == 5 
                    && card.costType == 'Money' && !card.types.includes('Duration') &&
                    !this.selectedCards.some(selectedCard => selectedCard.name === card.name) 
                );

                let riverboatRandomIndex = Math.floor(Math.random() * this.potentialRiverboatCards.length);
                let card = this.potentialRiverboatCards[riverboatRandomIndex]
                this.riverboatCard = card.name;
                this.containsRiverboat = true;
            } else {
                this.riverboatCard = "";
                this.containsRiverboat = false;
            }
        },
        generateAdvancedKingdom(){
            this.containsRiverboat = false;
            this.riverboatCard = "";
            this.obeliskCard = "";
            this.numberTraits = 0;
            let maxEffectCount = false;
            this.selectedExpansionsCardList = [...this.cards].filter(card => {
                return !this.banned.includes(card.name) && !card.tags?.includes("Split_Pile_Card");
            });
            this.selectedExpansionsLandscapeList = [...this.landscapes];
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

            let victoryCards = this.selectedExpansionsCardList.filter(card => card.types.includes('Victory') || card.tags?.includes('Victory_Token'))
            let treasureCards = this.selectedExpansionsCardList.filter(card => card.types.includes('Treasure'))
            let gatheringCards = this.selectedExpansionsCardList.filter(card => card.types.includes('Gathering'))
            let shadowCards = this.selectedExpansionsCardList.filter(card => card.types.includes('Shadow'))
            let debtCards = this.selectedExpansionsCardList.filter(card => card.tags?.includes('Debt'))
            let playerMatCards = this.selectedExpansionsCardList.filter(card => card.tags?.includes('Player_Mat'))
            let splitPileCards = this.selectedExpansionsCardList.filter(card => card.tags?.includes('Split_Pile'))
            let lootCards = this.selectedExpansionsCardList.filter(card => card.tags?.includes('Loot'))
            let omenCards = this.selectedExpansionsCardList.filter(card => card.types.includes('Omen'))
            let events = this.selectedExpansionsLandscapeList.filter(card => card.types.includes('Event'))
            let landmarks = this.selectedExpansionsLandscapeList.filter(card => card.types.includes('Landmark'))
            let traits = this.selectedExpansionsLandscapeList.filter(card => card.types.includes('Trait'))
            let prophecies = this.selectedExpansionsLandscapeList.filter(card => card.types.includes('Prophecy'))

            this.traits = this.selectedExpansionsLandscapeList.filter(card => card.types.includes('Trait'))
            this.prophecies = this.selectedExpansionsLandscapeList.filter(card => card.types.includes('Prophecy'))
            this.omenCards = this.selectedExpansionsCardList.filter(card => card.types.includes('Omen'))

            const countEffectingTypes = ["Treasure", "Debt", "Prophecy", "Loot", "Victory", "Shadow"];
            if (countEffectingTypes.every(type => this.selectedAdvancedCardTypes.includes(type))) {
                maxEffectCount = true;
            }

            if (this.selectedAdvancedCardTypes.includes('Treasure') && !this.selectedAdvancedExpansions.includes('Intrigue')
                && !this.selectedAdvancedExpansions.includes('Seaside') && !this.selectedAdvancedExpansions.includes('Prospertity')
                && !this.selectedAdvancedExpansions.includes('Plunder')  && !this.selectedAdvancedExpansions.includes('Rising Sun')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Treasure');
                this.showRemovedCard('Treasure')
            }
            if (this.selectedAdvancedCardTypes.includes('Victory') && !this.selectedAdvancedExpansions.includes('Dominion') 
                && !this.selectedAdvancedExpansions.includes('Intrigue') && !this.selectedAdvancedExpansions.includes('Seaside')
                && !this.selectedAdvancedExpansions.includes('Prospertity') && !this.selectedAdvancedExpansions.includes('Empires')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Victory');
                this.showRemovedCard('Victory')
            }
            if (this.selectedAdvancedCardTypes.includes('Shadow') && !this.selectedAdvancedExpansions.includes('Rising Sun')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Shadow');
                this.showRemovedCard('Shadow')
            }
            if (this.selectedAdvancedCardTypes.includes('Gathering') && !this.selectedAdvancedExpansions.includes('Empires')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Gathering');
                this.showRemovedCard('Gathering')
            }
            if (this.selectedAdvancedCardTypes.includes('Debt') && !this.selectedAdvancedExpansions.includes('Rising Sun') 
                && !this.selectedAdvancedExpansions.includes('Empires')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Debt');
                this.showRemovedMechanic('Debt')
            }
            if (this.selectedAdvancedCardTypes.includes('Loot') && !this.selectedAdvancedExpansions.includes('Plunder')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Loot');
                this.showRemovedMechanic('Loot')
            }
            if (this.selectedAdvancedCardTypes.includes('Split Pile') && !this.selectedAdvancedExpansions.includes('Empires')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Split Pile');
                this.showRemovedMechanic('Split Pile')
            }
            if (this.selectedAdvancedCardTypes.includes('Player Mats') && !this.selectedAdvancedExpansions.includes('Seaside')
                && !this.selectedAdvancedExpansions.includes('Adventures')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Player Mats');
                this.showRemovedMechanic('Player Mats')
            }
            if (this.selectedAdvancedCardTypes.includes('Prophecy') && !this.selectedAdvancedExpansions.includes('Rising Sun')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Prophecy');
                this.showRemovedLandscape('Prophecies')
            }
            if (this.selectedAdvancedCardTypes.includes('Event') && !this.selectedAdvancedExpansions.includes('Adventures') &&
                !this.selectedAdvancedExpansions.includes('Empires') && !this.selectedAdvancedExpansions.includes('Rising Sun') && 
                !this.selectedAdvancedExpansions.includes('Plunder')) { 
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Event');
                this.showRemovedLandscape('Events')
            }
            if (this.selectedAdvancedCardTypes.includes('Trait') && !this.selectedAdvancedExpansions.includes('Plunder')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Trait');
                this.showRemovedLandscape('Traits')
            }
            if (this.selectedAdvancedCardTypes.includes('Landmark') && !this.selectedAdvancedExpansions.includes('Empires')) {
                this.selectedAdvancedCardTypes = this.selectedAdvancedCardTypes.filter(type => type !== 'Landmark');
                this.showRemovedLandscape('Landmarks')
            }

            for(let loopCount = 1; loopCount < 4; loopCount++) {
                if(this.selectedAdvancedCardTypes.includes('Victory')) {
                    if(loopCount == 1) {
                        this.addRandomCard(victoryCards)
                    } else if (loopCount == 2){
                        let randomChance = Math.floor(Math.random() * 100)
                        if(randomChance <= 40) {
                            this.addRandomCard(victoryCards)
                        }
                    } else {
                        let randomChance = Math.floor(Math.random() * 100);
                        if(randomChance <= 5) {
                            this.addRandomCard(victoryCards)
                        }
                    }
                }

                if(this.selectedAdvancedCardTypes.includes('Treasure')) {
                    if(loopCount == 1) {
                        this.addRandomCard(treasureCards)
                    } else if(loopCount == 2) {
                        let randomChance = Math.floor(Math.random() * 100);
                        if(this.selectedAdvancedCardTypes.includes('Col & Plat') && randomChance <= 20 ||
                            !this.selectedAdvancedCardTypes.includes('Col & Plat') && randomChance <= 32) {
                            this.addRandomCard(treasureCards)
                        }
                    } else {
                        let randomChance = Math.floor(Math.random() * 100);
                        if(this.selectedAdvancedCardTypes.includes('Col & Plat') && randomChance <= 5 ||
                            !this.selectedAdvancedCardTypes.includes('Col & Plat') && randomChance <= 12) {
                            this.addRandomCard(treasureCards)
                        }
                    }
                }

                if(this.selectedAdvancedCardTypes.includes('Gathering')) {
                    if(loopCount == 1) {
                        this.addRandomCard(gatheringCards)
                    }
                }

                if(this.selectedAdvancedCardTypes.includes('Shadow')) {
                    if(loopCount == 1) {
                        this.addRandomCard(shadowCards)
                    } else if (loopCount == 2){
                        let randomChance = Math.floor(Math.random() * 100);
                        if(randomChance <= 8) {
                            this.addRandomCard(shadowCards)
                        }
                    }
                }

                if(this.selectedAdvancedCardTypes.includes('Debt')) {
                    if(loopCount == 1) {
                        this.addRandomCard(debtCards)
                    } else if (loopCount == 2){
                        let randomChance = Math.floor(Math.random() * 100);
                        if(randomChance <= 32) {
                            this.addRandomCard(debtCards)
                        }
                    } else {
                        let randomChance = Math.floor(Math.random() * 100);
                        if(randomChance <= 10) {
                            this.addRandomCard(debtCards)
                        }
                    }
                }

                if(this.selectedAdvancedCardTypes.includes('Player Mats')) {
                    if(loopCount == 1) {
                        this.addRandomCard(playerMatCards)
                    } else if (loopCount == 2){
                        let randomChance = Math.floor(Math.random() * 100);
                        if(randomChance <= 34) {
                            this.addRandomCard(playerMatCards)
                        }
                    }
                }

                if(this.selectedAdvancedCardTypes.includes('Split Pile') && loopCount == 1) {
                    this.addRandomCard(splitPileCards)
                }
            
                if(this.selectedAdvancedCardTypes.includes('Loot')) {
                    if(loopCount == 1) {
                        this.addRandomCard(lootCards)
                    } else if (loopCount == 2){
                        let randomChance = Math.floor(Math.random() * 100);
                        if(randomChance <= 32) {
                            this.addRandomCard(lootCards)
                        }
                    }
                }
                
                if(this.selectedAdvancedCardTypes.includes('Prophecy')) {
                    if(loopCount == 1) {
                        this.addRandomCard(omenCards)
                    } else if (loopCount == 2){
                        let randomChance = Math.floor(Math.random() * 100);
                        if(randomChance <= 20) {
                            this.addRandomCard(omenCards)
                        }
                    }
                }

                if((this.selectedCards.length > 7 || maxEffectCount == true) && loopCount == 2) {
                    break;
                }
            }

            if(this.selectedAdvancedCardTypes.includes('Landmark')) {
                let landmarkRandomIndex = Math.floor(Math.random() * landmarks.length);
                let cardName = landmarks[landmarkRandomIndex].name;
                if (!this.selectedAddons.includes(cardName)) {
                    this.selectedAddons.push(cardName);
                }
            }

            if(this.selectedAdvancedCardTypes.includes('Event')) {
                let numEvent = 0, addedCount = 0, attempts = 0;
                let randomChance = Math.floor(Math.random() * 100);
                if (this.selectedAdvancedCardTypes.includes('Prophecy') || this.selectedAdvancedCardTypes.includes('Landmark')) {
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
                if(randomChance < 71 || (this.selectedAdvancedCardTypes.includes('Event') && this.selectedAdvancedCardTypes.includes('Landmark') && this.selectedAdvancedCardTypes.includes('Prophecy'))) {
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
                    addedCount++;
                }
            }

            if (this.selectedAddons.includes("Obelisk")) {
                let actionSupplyCards = this.selectedCards.filter(card => card.types.includes("Action"));
                let randomNumber = Math.floor(Math.random() * actionSupplyCards.length);
                this.obeliskCard = actionSupplyCards[randomNumber].name;
            }

            let traitNumber = 0, traitCount = 0, attempts = 0;
            traits.forEach(trait => {
                if (this.selectedAddons.includes(trait.name)) {
                    traitNumber++;
                }
            });
            while (traitCount < traitNumber && attempts < 20) {
                let randomNumber = Math.floor(Math.random() * 10);
                if(!this.traitCards.includes(this.selectedCards[randomNumber]) && this.selectedCards[randomNumber].name != this.obeliskCard) {
                    this.traitCards.push(this.selectedCards[randomNumber])
                    traitCount++;
                }
                attempts++
            }

            if(!prophecies.some(prophecy => this.selectedAddons.includes(prophecy)) 
                && omenCards.some(omen => this.selectedCards.some(card => card.name === omen.name))) {
                let prophecyRandomIndex = Math.floor(Math.random() * prophecies.length);
                let cardName = prophecies[prophecyRandomIndex].name;
                if (!this.selectedAddons.includes(cardName)) {
                    this.selectedAddons.push(cardName);
                }
            }

            if (this.selectedCards.some(card => card.name === 'Riverboat')){
                this.potentialRiverboatCards = this.selectedExpansionsCardList.filter(card => 
                    card.cost == 5 && card.costType == 'Money' && !card.types.includes('Duration')
                    && !this.selectedCards.some(selectedCard => selectedCard.name === card.name) 
                );

                let riverboatRandomIndex = Math.floor(Math.random() * this.potentialRiverboatCards.length);
                let card = this.potentialRiverboatCards[riverboatRandomIndex]
                this.riverboatCard = card.name;
                this.containsRiverboat = true;
            }
        },
        regenerateRiverboatCard(cardName) {
            let newPotentialRiverboatCards = this.potentialRiverboatCards.filter(
                potentialCard => potentialCard.name !== cardName
            );
            let riverboatRandomIndex = Math.floor(Math.random() * newPotentialRiverboatCards.length);
            let card = newPotentialRiverboatCards[riverboatRandomIndex]
            this.riverboatCard = card.name;
        },
        regenerateLandscape(card) {
            let landmarks = this.selectedExpansionsLandscapeList.filter(card => card.types.includes('Landmark'))
            let events = this.selectedExpansionsLandscapeList.filter(card => card.types.includes('Event'))
            let traits = this.selectedExpansionsLandscapeList.filter(card => card.types.includes('Trait'))
            let prophecies = this.selectedExpansionsLandscapeList.filter(card => card.types.includes('Prophecy'))

            if(landmarks.some(landmark => landmark.name.includes(card))) {
                this.obeliskCard = ""
                let index = this.selectedAddons.findIndex(landmark => landmark.includes(card));
                let attempts = 0, inserted = false
                    while (inserted == false && attempts < 20) {

                    if(!landmarks.some(landmark => this.selectedAddons.includes(landmark))) {
                        let landmarkRandomIndex = Math.floor(Math.random() * landmarks.length);
                        let cardName = landmarks[landmarkRandomIndex].name;
                        if (!this.selectedAddons.includes(cardName)) {
                            this.selectedAddons[index] = cardName;
                            if (cardName == "Obelisk") {
                                let actionSupplyCards = this.selectedCards.filter(card => card.types.includes("Action"));
                                let randomNumber = Math.floor(Math.random() * actionSupplyCards.length);
                                this.obeliskCard = actionSupplyCards[randomNumber].name;
                            }
                            inserted = true
                        }
                    }
                    attempts++
                }
            }

            if(events.some(event => event.name.includes(card))) {
                let index = this.selectedAddons.findIndex(event => event.includes(card));
                let attempts = 0, inserted = false
                    while (inserted == false && attempts < 20) {

                    if(!events.some(event => this.selectedAddons.includes(event))) {
                        let eventRandomIndex = Math.floor(Math.random() * events.length);
                        let cardName = events[eventRandomIndex].name;
                        if (!this.selectedAddons.includes(cardName)) {
                            this.selectedAddons[index] = cardName;
                            inserted = true
                        }
                    }
                    attempts++
                }
            }

            if(traits.some(trait => trait.name.includes(card))) {
                let index = this.selectedAddons.findIndex(trait => trait.includes(card));
                let attempts = 0, inserted = false
                    while (inserted == false && attempts < 20) {

                    if(!traits.some(trait => this.selectedAddons.includes(trait))) {
                        let traitRandomIndex = Math.floor(Math.random() * traits.length);
                        let cardName = traits[traitRandomIndex].name;
                        if (!this.selectedAddons.includes(cardName)) {
                            this.selectedAddons[index] = cardName;
                            inserted = true
                        }
                    }
                    attempts++
                }
            }

            if(prophecies.some(prophecy => prophecy.name.includes(card))) {
                let index = this.selectedAddons.findIndex(prophecy => prophecy.includes(card));
                let attempts = 0, inserted = false
                    while (inserted == false && attempts < 20) {

                    if(!prophecies.some(prophecy => this.selectedAddons.includes(prophecy))) {
                        let prophecyRandomIndex = Math.floor(Math.random() * prophecies.length);
                        let cardName = prophecies[prophecyRandomIndex].name;
                        if (!this.selectedAddons.includes(cardName)) {
                            this.selectedAddons[index] = cardName;
                            inserted = true
                        }
                    }
                    attempts++
                }
            }
        },
        addTrait(){
            let traits = this.landscapes.filter(card => card.types.includes('Trait'));
            let randomIndex = Math.floor(Math.random() * traits.length);
            let traitName = traits[randomIndex].name;
            if (!this.selectedAddons.includes(traitName)) {
                this.selectedAddons.push(traitName);
                let randomNumber = Math.floor(Math.random() * 10);
                if(!this.traitCards.includes(this.selectedCards[randomNumber]) && this.selectedCards[randomNumber].name != this.obeliskCard) {
                    this.traitCards.push(this.selectedCards[randomNumber])
                }
            }
            this.numberTraits = this.selectedAddons.filter(addon =>
                traits.some(trait => trait.name === addon)).length;
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
        async fetchUsersCustomLists(user) {
            axios.get(`${import.meta.env.VITE_API_URL}/getusercustomlists/${user}`, {
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                this.favorites = response.data
                    .filter(item => item.list === 'Favorite')
                    .map(item => item.cardname);
                    
                this.banned = response.data
                    .filter(item => item.list === 'Banned')
                    .map(item => item.cardname);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
        async insertIntoCustomList(user, cardName, listName) {
            let insertObject = {
                "id": user,
                "cardname": cardName.replace(/\s+/g, '_'),
                "list": listName
            };

            fetch(`${import.meta.env.VITE_API_URL}/addtocustomlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(insertObject)
            })
            .then(response => {
                console.log('Success:', insertObject);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
        async deleteFromCustomList(user, cardName, listName) {
            let insertObject = {
                "id": user,
                "cardname": cardName.replace(/\s+/g, '_'),
                "list": listName
            }

            fetch(`${import.meta.env.VITE_API_URL}/removefromcustomlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(insertObject)
            })
            .then(response => {
                console.log('Success:', insertObject);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    },
    watch: {
        numGenerateCards(val) {
            if (val > 10) {
                this.numGenerateCards = 10;
            }
        },
        searchType(type) {
            if(type === 'exclusive' && this.selectedExpansions.length > 1) {
                this.selectedExpansions.length = [];
            }
        }
    },
    created() {
        this.fetchUsersCustomLists(this.userName);
        this.cards = [
            {
                name: "Cellar",
                set: "Dominion",
                types: ["Action"],
                categories: ["Sifter"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Chapel",
                set: "Dominion",
                types: ["Action"],
                categories: ["Trasher"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Moat",
                set: "Dominion",
                types: ["Action", "Reaction"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Harbinger",
                set: "Dominion",
                types: ["Action"],
                categories: ["Cantrip"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Merchant",
                set: "Dominion",
                types: ["Action"],
                categories: ["Cantrip"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Vassal",
                set: "Dominion",
                types: ["Action"],
                categories: ["Terminal Silver"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Village",
                set: "Dominion",
                types: ["Action"],
                categories: ["Village"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Workshop",
                set: "Dominion",
                types: ["Action"],
                categories: ["Gainer"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Bureaucrat",
                set: "Dominion",
                types: ["Action", "Attack"],
                categories: [""],
                costType: "Money",
                cost: 4
            },
            {
                name: "Gardens",
                set: "Dominion",
                types: ["Victory"],
                categories: [""],
                costType: "Money",
                cost: 4
            },
            {
                name: "Militia",
                set: "Dominion",
                types: ["Action", "Attack"],
                categories: ["Terminal Silver"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Moneylender",
                set: "Dominion",
                types: ["Action"],
                categories: ["Trasher", "Terminal Silver"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Poacher",
                set: "Dominion",
                types: ["Action"],
                categories: [""],
                costType: "Money",
                cost: 4
            },
            {
                name: "Remodel",
                set: "Dominion",
                types: ["Action"],
                categories: ["Gainer", "Trasher"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Smithy",
                set: "Dominion",
                types: ["Action"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Throne_Room",
                set: "Dominion",
                types: ["Action"],
                categories: ["Village"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Bandit",
                set: "Dominion",
                types: ["Action", "Attack"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Council_Room",
                set: "Dominion",
                types: ["Action"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Festival",
                set: "Dominion",
                types: ["Action"],
                categories: ["Village"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Laboratory",
                set: "Dominion",
                types: ["Action"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Library",
                set: "Dominion",
                types: ["Action"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Market",
                set: "Dominion",
                types: ["Action"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Mine",
                set: "Dominion",
                types: ["Action"],
                categories: ["Gainer", "Trasher"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Sentry",
                set: "Dominion",
                types: ["Action"],
                categories: ["Cantrip", "Trasher", "Sifter"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Witch",
                set: "Dominion",
                types: ["Action", "Attack"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Artisan",
                set: "Dominion",
                types: ["Action"],
                categories: ["Gainer"],
                costType: "Money",
                cost: 6
            },
            {
                name: "Captain",
                set: "Seaside",
                types: ["Action", "Duration", "Command"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Church",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: ["Trasher"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Haven",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: ["Cantrip"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Lighthouse",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: [""],
                costType: "Money",
                cost: 2
            },
            {
                name: "Native_Village",
                set: "Seaside",
                types: ["Action"],
                categories: ["Village", "Trasher"],
                tags: ["Player_Mat"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Astrolabe",
                set: "Seaside",
                types: ["Treasure", "Duration"],
                categories: [""],
                costType: "Money",
                cost: 3
            },
            {
                name: "Fishing_Village",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: ["Village"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Lookout",
                set: "Seaside",
                types: ["Action"],
                categories: ["Trasher", "Sifter"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Monkey",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: [""],
                costType: "Money",
                cost: 3
            },
            {
                name: "Sea_Chart",
                set: "Seaside",
                types: ["Action"],
                categories: ["Cantrip"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Smugglers",
                set: "Seaside",
                types: ["Action"],
                categories: ["Gainer"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Warehouse",
                set: "Seaside",
                types: ["Action"],
                categories: ["Sifter"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Blockade",
                set: "Seaside",
                types: ["Action", "Duration", "Attack"],
                categories: ["Gainer"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Caravan",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: ["Cantrip"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Cutpurse",
                set: "Seaside",
                types: ["Action", "Attack"],
                categories: ["Terminal Silver"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Island",
                set: "Seaside",
                types: ["Action", "Victory"],
                categories: ["Trasher"],
                tags: ["Player_Mat"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Sailor",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: ["Trasher"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Salvager",
                set: "Seaside",
                types: ["Action"],
                categories: ["Trasher"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Tide_Pools",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: [""],
                costType: "Money",
                cost: 4
            },
            {
                name: "Treasure_Map",
                set: "Seaside",
                types: ["Action"],
                categories: [""],
                costType: "Money",
                cost: 4
            },
            {
                name: "Bazaar",
                set: "Seaside",
                types: ["Action"],
                categories: ["Village"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Corsair",
                set: "Seaside",
                types: ["Action", "Duration", "Attack"],
                categories: ["Terminal Silver"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Merchant_Ship",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: ["Terminal Silver"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Outpost",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Pirate",
                set: "Seaside",
                types: ["Action", "Duration", "Reaction"],
                categories: ["Gainer"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Sea_Witch",
                set: "Seaside",
                types: ["Action", "Duration", "Attack"],
                categories: ["Sifter", "Terminal Draw"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Tactician",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: ["Village"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Treasury",
                set: "Seaside",
                types: ["Action"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Wharf",
                set: "Seaside",
                types: ["Action", "Duration"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Courtyard",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Lurker",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Gainer", "Trasher"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Pawn",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Cantrip"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Masquerade",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Trasher", "Trasher", "Terminal Draw"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Shanty_Town",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Village"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Steward",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Trasher", "Terminal Draw", "Terminal Silver"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Swindler",
                set: "Intrigue",
                types: ["Action", "Attack"],
                categories: ["Terminal Silver"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Wishing_Well",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Cantrip"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Baron",
                set: "Intrigue",
                types: ["Action"],
                categories: [""],
                costType: "Money",
                cost: 4
            },
            {
                name: "Bridge",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Terminal Silver"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Conspirator",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Terminal Silver"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Diplomat",
                set: "Intrigue",
                types: ["Action", "Reaction"],
                categories: ["Village", "Sifter", "Terminal Draw"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Ironworks",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Cantrip", "Gainer"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Mill",
                set: "Intrigue",
                types: ["Action", "Victory"],
                categories: ["Cantrip"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Mining_Village",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Village"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Secret_Passage",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Sifter"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Courtier",
                set: "Intrigue",
                types: ["Action"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Duke",
                set: "Intrigue",
                types: ["Victory"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Minion",
                set: "Intrigue",
                types: ["Action", "Attack"],
                categories: ["Sifter"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Patrol",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Replace",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Gainer", "Trasher"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Torturer",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Trading_Post",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Trasher"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Upgrade",
                set: "Intrigue",
                types: ["Action"],
                categories: ["Cantrip", "Gainer", "Trasher"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Harem",
                set: "Intrigue",
                types: ["Treasure", "Victory"],
                categories: [""],
                costType: "Money",
                cost: 6
            },
            {
                name: "Nobles",
                set: "Intrigue",
                types: ["Action", "Victory"],
                categories: ["Village", "Terminal Draw"],
                costType: "Money",
                cost: 5
            },
            {
                name : "Anvil",
                set: "Prosperity",
                types: ["Treasure"],
                categories: ["Gainer"],
                costType: "Money",
                cost: 3
            },
            {
                name : "Watchtower",
                set: "Prosperity",
                types: ["Action", "Reaction"],
                categories: ["Trasher", "Terminal Draw"],
                costType: "Money",
                cost: 3
            },
            {
                name : "Bishop",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Trasher"],
                tags: ["Victory_Token"],
                costType: "Money",
                cost: 4
            },
            {
                name : "Clerk",
                set: "Prosperity",
                types: ["Action", "Reaction", "Attack"],
                categories: ["Terminal Silver"],
                costType: "Money",
                cost: 4
            },
            {
                name : "Investment",
                set: "Prosperity",
                types: ["Treasure"],
                categories: ["Trasher"],
                costType: "Money",
                cost: 4
            },
            {
                name : "Monument",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Terminal Silver"],
                tags: ["Victory_Token"],
                costType: "Money",
                cost: 4
            },
            {
                name : "Quarry",
                set: "Prosperity",
                types: ["Treasure"],
                categories: [""],
                costType: "Money",
                cost: 4
            },
            {
                name : "Tiara",
                set: "Prosperity",
                types: ["Treasure"],
                categories: [""],
                costType: "Money",
                cost: 4
            },
            {
                name : "Worker's_Village",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Village"],
                costType: "Money",
                cost: 4
            },
            {
                name : "Charlatan",
                set: "Prosperity",
                types: ["Action", "Attack"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name : "City",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Village"],
                costType: "Money",
                cost: 5
            },
            {
                name : "Collection",
                set: "Prosperity",
                types: ["Treasure"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name : "Crystal_Ball",
                set: "Prosperity",
                types: ["Treasure"],
                categories: ["Trasher", "Sifter"],
                costType: "Money",
                cost: 5
            },
            {
                name : "Magnate",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 5
            },
            {
                name : "Mint",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Gainer", "Trasher"],
                costType: "Money",
                cost: 5
            },
            {
                name : "Rabble",
                set: "Prosperity",
                types: ["Action", "Attack"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 5
            },
            {
                name : "Vault",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 5
            },
            {
                name : "War_Chest",
                set: "Prosperity",
                types: ["Treasure"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name : "Grand_Market",
                set: "Prosperity",
                types: ["Action"],
                categories: [""],
                costType: "Money",
                cost: 6
            },
            {
                name : "Hoard",
                set: "Prosperity",
                types: ["Treasure"],
                categories: [""],
                costType: "Money",
                cost: 6
            },
            {
                name : "Expand",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Gainer", "Trasher"],
                costType: "Money",
                cost: 7
            },
            {
                name : "Forge",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Gainer", "Trasher"],
                costType: "Money",
                cost: 7
            },
            {
                name : "King's_Court",
                set: "Prosperity",
                types: ["Action"],
                categories: ["Village"],
                costType: "Money",
                cost: 7
            },
            {
                name : "Peddler",
                set: "Prosperity",
                types: ["Action"],
                categories: [""],
                costType: "Money",
                cost: 8
            },
            {
                name: "Cage",
                set: "Plunder",
                types: ["Treasure", "Duration"],
                categories: ["Trasher"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Grotto",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Sifter"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Jewelled_Egg",
                set: "Plunder",
                types: ["Treasure"],
                categories: [""],
                tags: ["Loot"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Search",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Terminal Silver"],
                tags: ["Loot"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Shaman",
                set: "Plunder",
                types: ["Action"],
                categories: ["Gainer", "Trasher"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Secluded_Shrine",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Trasher"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Siren",
                set: "Plunder",
                types: ["Action", "Duration", "Attack"],
                categories: ["Trasher"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Stowaway",
                set: "Plunder",
                types: ["Action", "Duration", "Reaction"],
                categories: [""],
                costType: "Money",
                cost: 3
            },
            {
                name: "Taskmaster",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Village"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Abundance",
                set: "Plunder",
                types: ["Treasure", "Duration"],
                categories: [""],
                costType: "Money",
                cost: 4
            },
            {
                name: "Cabin_Boy",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Cantrip"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Crucible",
                set: "Plunder",
                types: ["Treasure"],
                categories: ["Trasher"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Flagship",
                set: "Plunder",
                types: ["Action", "Duration", "Command"],
                categories: ["Village", "Terminal Silver"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Fortune_Hunter",
                set: "Plunder",
                types: ["Action"],
                categories: ["Terminal Silver"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Gondola",
                set: "Plunder",
                types: ["Treasure", "Duration"],
                categories: ["Village"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Harbor_Village",
                set: "Plunder",
                types: ["Action"],
                categories: ["Village"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Landing_Party",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Village"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Mapmaker",
                set: "Plunder",
                types: ["Action", "Reaction"],
                categories: ["Sifter", "Terminal Draw"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Maroon",
                set: "Plunder",
                types: ["Action"],
                categories: ["Trasher", "Terminal Draw"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Rope",
                set: "Plunder",
                types: ["Treasure", "Duration"],
                categories: ["Trasher"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Swamp_Shacks",
                set: "Plunder",
                types: ["Action"],
                categories: ["Village"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Tools",
                set: "Plunder",
                types: ["Treasure"],
                categories: ["Gainer"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Buried_Treasure",
                set: "Plunder",
                types: ["Treasure", "Duration"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Crew",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Cutthroat",
                set: "Plunder",
                types: ["Action", "Duration", "Attack"],
                categories: [""],
                tags: ["Loot"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Enlarge",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Gainer", "Trasher"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Figurine",
                set: "Plunder",
                types: ["Treasure"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 5
            },
            {
                name: "First_Mate",
                set: "Plunder",
                types: ["Action"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Frigate",
                set: "Plunder",
                types: ["Action", "Duration", "Attack"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Longship",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Village"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Mining_Road",
                set: "Plunder",
                types: ["Action"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Pendant",
                set: "Plunder",
                types: ["Treasure"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Pickaxe",
                set: "Plunder",
                types: ["Treasure"],
                categories: ["Trasher"],
                tags: ["Loot"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Pilgrim",
                set: "Plunder",
                types: ["Action"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Quartermaster",
                set: "Plunder",
                types: ["Action", "Duration"],
                categories: ["Gainer"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Silver_Mine",
                set: "Plunder",
                types: ["Treasure"],
                categories: ["Gainer"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Trickster",
                set: "Plunder",
                types: ["Action", "Attack"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Wealthy_Village",
                set: "Plunder",
                types: ["Action"],
                categories: ["Village"],
                tags: ["Loot"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Sack_of_Loot",
                set: "Plunder",
                types: ["Treasure"],
                categories: [""],
                tags: ["Loot"],
                costType: "Money",
                cost: 6
            },
            {
                name: "King's_Cache",
                set: "Plunder",
                types: ["Treasure"],
                categories: [""],
                costType: "Money",
                cost: 7
            },
            {
                name: "Mountain_Shrine",
                set: "Rising Sun",
                types: ["Action", "Omen"],
                categories: ["Trasher", "Terminal Draw", "Terminal Silver"],
                tags: ["Debt"],
                costType: "Debt",
                cost: 5
            },
            {
                name: "Daimyo",
                set: "Rising Sun",
                types: ["Action", "Command"],
                categories: ["Village", "Cantrip"],
                tags: ["Debt"],
                costType: "Debt",
                cost: 6
            },
            {
                name: "Artist",
                set: "Rising Sun",
                types: ["Action"],
                categories: [""],
                tags: ["Debt"],
                costType: "Debt",
                cost: 8
            },
            {
                name: "Fishmonger",
                set: "Rising Sun",
                types: ["Action", "Shadow"],
                categories: [""],
                costType: "Money",
                cost: 2
            },
            {
                name: "Snake_Witch",
                set: "Rising Sun",
                types: ["Action", "Attack"],
                categories: ["Cantrip"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Aristocrat",
                set: "Rising Sun",
                types: ["Action"],
                categories: ["Village", "Terminal Draw"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Craftsman",
                set: "Rising Sun",
                types: ["Action"],
                categories: ["Gainer"],
                tags: ["Debt"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Riverboat",
                set: "Rising Sun",
                types: ["Action", "Duration"],
                categories: [""],
                costType: "Money",
                cost: 3
            },
            {
                name: "Root_Cellar",
                set: "Rising Sun",
                types: ["Action"],
                categories: [""],
                tags: ["Debt"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Alley",
                set: "Rising Sun",
                types: ["Action", "Shadow"],
                categories: ["Cantrip", "Sifter"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Change",
                set: "Rising Sun",
                types: ["Action"],
                categories: [""],
                tags: ["Debt"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Ninja",
                set: "Rising Sun",
                types: ["Action", "Attack", "Shadow"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Poet",
                set: "Rising Sun",
                types: ["Action", "Omen"],
                categories: ["Cantrip"],
                costType: "Money",
                cost: 4
            },
            {
                name: "River_Shrine",
                set: "Rising Sun",
                types: ["Action", "Omen"],
                categories: ["Gainer", "Trasher"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Rustic_Village",
                set: "Rising Sun",
                types: ["Action", "Omen"],
                categories: ["Village", "Sifter"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Gold_Mine",
                set: "Rising Sun",
                types: ["Action"],
                categories: ["Cantrip", "Gainer"],
                tags: ["Debt"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Imperial_Envoy",
                set: "Rising Sun",
                types: ["Action"],
                categories: ["Terminal Draw"],
                tags: ["Debt"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Kitsune",
                set: "Rising Sun",
                types: ["Action", "Attack", "Omen"],
                categories: ["Village", "Terminal Silver"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Litter",
                set: "Rising Sun",
                types: ["Action"],
                categories: ["Village"],
                tags: ["Debt"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Rice_Broker",
                set: "Rising Sun",
                types: ["Action"],
                categories: ["Trasher"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Ronin",
                set: "Rising Sun",
                types: ["Action", "Shadow"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Tanuki",
                set: "Rising Sun",
                types: ["Action", "Shadow"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Tea_House",
                set: "Rising Sun",
                types: ["Action", "Omen"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Samurai",
                set: "Rising Sun",
                types: ["Action", "Duration", "Attack"],
                categories: [""],
                costType: "Money",
                cost: 6
            },
            {
                name: "Rice",
                set: "Rising Sun",
                types: ["Treasure"],
                categories: [""],
                costType: "Money",
                cost: 7
            },
            {
                name: "Coin_of_the_Realm",
                set: "Adventures",
                types: ["Treasure"],
                categories: ["Village"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Page",
                set: "Adventures",
                types: ["Action", "Traveller"],
                categories: ["Cantrip"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Treasure_Hunter",
                set: "Adventures",
                types: ["Action", "Traveller"],
                categories: [""],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Warrior",
                set: "Adventures",
                types: ["Action", "Attack", "Traveller"],
                categories: ["Terminal Draw"],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Hero",
                set: "Adventures",
                types: ["Action", "Traveller"],
                categories: ["Gainer", "Terminal Silver"],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Champion",
                set: "Adventures",
                types: ["Action", "Duration"],
                categories: ["Village"],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 6
            },
            {
                name: "Peasant",
                set: "Adventures",
                types: ["Action", "Traveller"],
                categories: [""],
                costType: "Money",
                cost: 2
            },
            {
                name: "Soldier",
                set: "Adventures",
                types: ["Action", "Attack", "Traveller"],
                categories: [""],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Fugitive",
                set: "Adventures",
                types: ["Action", "Traveller"],
                categories: ["Sifter"],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Disciple",
                set: "Adventures",
                types: ["Action", "Traveller"],
                categories: ["Village", "Gainer"],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Teacher",
                set: "Adventures",
                types: ["Action", "Reserve"],
                categories: [""],
                tags: ["Split_Pile_Card", "Player_Mat"],
                costType: "Money",
                cost: 6
            },
            {
                name: "Ratcatcher",
                set: "Adventures",
                types: ["Action", "Reserve"],
                categories: ["Cantrip"],
                tags: ["Player_Mat"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Raze",
                set: "Adventures",
                types: ["Action"],
                categories: ["Trasher"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Amulet",
                set: "Adventures",
                types: ["Action", "Duration"],
                categories: ["Gainer", "Trasher"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Caravan_Guard",
                set: "Adventures",
                types: ["Action", "Duration", "Reaction"],
                categories: ["Cantrip"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Dungeon",
                set: "Adventures",
                types: ["Action", "Duration"],
                categories: ["Sifter"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Gear",
                set: "Adventures",
                types: ["Action", "Duration"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Guide",
                set: "Adventures",
                types: ["Action", "Reserve"],
                categories: ["Cantrip", "Sifter"],
                tags: ["Player_Mat"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Duplicate",
                set: "Adventures",
                types: ["Action", "Reserve"],
                categories: ["Gainer"],
                tags: ["Player_Mat"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Magpie",
                set: "Adventures",
                types: ["Action"],
                categories: ["Cantrip", "Gainer"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Messenger",
                set: "Adventures",
                types: ["Action"],
                categories: ["Gainer", "Terminal Silver"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Miser",
                set: "Adventures",
                types: ["Action"],
                categories: ["Trasher"],
                tags: ["Player_Mat"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Port",
                set: "Adventures",
                types: ["Action"],
                categories: ["Village", "Gainer"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Ranger",
                set: "Adventures",
                types: ["Action"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Transmogrify",
                set: "Adventures",
                types: ["Action", "Reserve"],
                categories: ["Gainer", "Trasher"],
                tags: ["Player_Mat"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Artificer",
                set: "Adventures",
                types: ["Action"],
                categories: ["Cantrip", "Gainer"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Bridge_Troll",
                set: "Adventures",
                types: ["Action", "Duration", "Attack"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Distant_Lands",
                set: "Adventures",
                types: ["Action", "Reserve", "Victory"],
                categories: [""],
                tags: ["Player_Mat"],
                costType: "Money",
                cost: 5
            },

            {
                name: "Giant",
                set: "Adventures",
                types: ["Action", "Attack"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Haunted_Woods",
                set: "Adventures",
                types: ["Action", "Duration", "Attack"],
                categories: ["Terminal Draw"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Lost_City",
                set: "Adventures",
                types: ["Action"],
                categories: ["Village"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Relic",
                set: "Adventures",
                types: ["Treasure", "Attack"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Royal_Carriage",
                set: "Adventures",
                types: ["Action", "Reserve"],
                categories: ["Village"],
                tags: ["Player_Mat"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Storyteller",
                set: "Adventures",
                types: ["Action"],
                categories: ["Cantrip"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Swamp_Hag",
                set: "Adventures",
                types: ["Action", "Duration", "Attack"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Treasure_Trove",
                set: "Adventures",
                types: ["Treasure"],
                categories: ["Gainer"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Wine_Merchant",
                set: "Adventures",
                types: ["Action", "Reserve"],
                categories: [""],
                tags: ["Player_Mat"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Hireling",
                set: "Adventures",
                types: ["Action", "Duration"],
                categories: [""],
                costType: "Money",
                cost: 6
            },
            {
                name: "Engineer",
                set: "Empires",
                types: ["Action"],
                categories: ["Gainer"],
                tags: ["Debt"],
                costType: "Debt",
                cost: 4
            },
            {
                name: "City_Quarter",
                set: "Empires",
                types: ["Action"],
                categories: ["Village"],
                tags: ["Debt"],
                costType: "Debt",
                cost: 8
            },
            {
                name: "Overlord",
                set: "Empires",
                types: ["Action", "Command"],
                categories: [""],
                tags: ["Debt"],
                costType: "Debt",
                cost: 8
            },
            {
                name: "Royal_Blacksmith",
                set: "Empires",
                types: ["Action"],
                categories: ["Sifter", "Terminal Draw"],
                tags: ["Debt"],
                costType: "Debt",
                cost: 8
            },
            {
                name: "Encampment_Plunder",
                set: "Empires",
                types: ["Action"],
                categories: ["Village"],
                tags: ["Victory_Token", "Split_Pile"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Encampment",
                set: "Empires",
                types: ["Action"],
                categories: ["Village"],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Plunder",
                set: "Empires",
                types: ["Treasure"],
                categories: [""],
                tags: ["Victory_Token", "Split_Pile_Card"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Patrician_Emporium",
                set: "Empires",
                types: ["Action"],
                categories: ["Cantrip"],
                tags: ["Victory_Token", "Split_Pile"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Patrician",
                set: "Empires",
                types: ["Action"],
                categories: ["Cantrip"],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Emporium",
                set: "Empires",
                types: ["Action"],
                categories: ["Cantrip"],
                tags: ["Victory_Token", "Split_Pile_Card"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Settlers_Bustling_Village",
                set: "Empires",
                types: ["Action"],
                categories: ["Village", "Cantrip"],
                tags: ["Split_Pile"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Settlers",
                set: "Empires",
                types: ["Action"],
                categories: ["Cantrip"],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 2
            },
            {
                name: "Bustling_Village",
                set: "Empires",
                types: ["Action"],
                categories: ["Village"],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Castles",
                set: "Empires",
                types: ["Victory", "Castle"],
                categories: ["Gainer", "Trasher"],
                tags: ["Split_Pile"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Humble_Castle",
                set: "Empires",
                types: ["Victory", "Castle"],
                categories: [""],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Crumbling_Castle",
                set: "Empires",
                types: ["Victory", "Castle"],
                categories: ["Gainer"],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Small_Castle",
                set: "Empires",
                types: ["Victory", "Castle"],
                categories: ["Gainer", "Trasher"],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Haunted_Castle",
                set: "Empires",
                types: ["Victory", "Castle"],
                categories: ["Gainer"],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 6
            },
            {
                name: "Opulent_Castle",
                set: "Empires",
                types: ["Victory", "Castle"],
                categories: [""],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 7
            },
            {
                name: "Sprawling_Castle",
                set: "Empires",
                types: ["Victory", "Castle"],
                categories: ["Gainer"],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 8
            },
            {
                name: "Grand_Castle",
                set: "Empires",
                types: ["Victory", "Castle"],
                categories: [""],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 9
            },
            {
                name: "King's_Castle",
                set: "Empires",
                types: ["Victory", "Castle"],
                categories: [""],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 10
            },
            {
                name: "Catapult_Rocks",
                set: "Empires",
                types: ["Action", "Attack"],
                categories: ["Gainer", "Trasher"],
                tags: ["Split_Pile"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Catapult",
                set: "Empires",
                types: ["Action", "Attack"],
                categories: ["Trasher"],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Rocks",
                set: "Empires",
                types: ["Treasure"],
                categories: ["Gainer"],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Chariot_Race",
                set: "Empires",
                types: ["Action"],
                categories: [""],
                tags: ["Victory_Token"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Enchantress",
                set: "Empires",
                types: ["Action", "Attack", "Duration"],
                categories: ["Cantrip"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Farmers'_Market",
                set: "Empires",
                types: ["Action", "Gathering"],
                categories: ["Terminal Silver"],
                tags: ["Victory_Token"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Gladiator_Fortune",
                set: "Empires",
                types: ["Action"],
                categories: ["Trasher", "Terminal Silver"],
                tags: ["Debt", "Split_Pile"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Gladiator",
                set: "Empires",
                types: ["Action"],
                categories: ["Trasher", "Terminal Silver"],
                tags: ["Split_Pile_Card"],
                costType: "Money",
                cost: 3
            },
            {
                name: "Fortune",
                set: "Empires",
                types: ["Treasure"],
                categories: [""],
                tags: ["Debt", "Split_Pile_Card"],
                costType: "Debt",
                cost: 8
            },
            {
                name: "Sacrifice",
                set: "Empires",
                types: ["Action"],
                categories: ["Village", "Trasher", "Terminal Silver"],
                tags: ["Victory_Token"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Temple",
                set: "Empires",
                types: ["Action", "Gathering"],
                categories: ["Trasher"],
                tags: ["Victory_Token"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Villa",
                set: "Empires",
                types: ["Action"],
                categories: ["Village"],
                costType: "Money",
                cost: 4
            },
            {
                name: "Archive",
                set: "Empires",
                types: ["Action", "Duration"],
                categories: ["Cantrip"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Capital",
                set: "Empires",
                types: ["Treasure"],
                categories: [""],
                tags: ["Debt"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Charm",
                set: "Empires",
                types: ["Treasure"],
                categories: ["Gainer"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Crown",
                set: "Empires",
                types: ["Action", "Treasure"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Forum",
                set: "Empires",
                types: ["Action"],
                categories: ["Sifter"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Groundskeeper",
                set: "Empires",
                types: ["Action"],
                categories: ["Cantrip"],
                tags: ["Victory_Token"],
                costType: "Money",
                cost: 5
            },
            {
                name: "Legionary",
                set: "Empires",
                types: ["Action", "Attack"],
                categories: [""],
                costType: "Money",
                cost: 5
            },
            {
                name: "Wild_Hunt",
                set: "Empires",
                types: ["Action", "Gathering"],
                categories: ["Terminal Draw"],
                tags: ["Victory_Token"],
                costType: "Money",
                cost: 5
            },
        ]
        this.landscapes = [
            {
                name: "Summon",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Alms",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Ball",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Bonfire",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Borrow",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Expedition",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Ferry",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Inheritance",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Lost_Arts",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Mission",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Pathfinding",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Pilgrimage",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Plan",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Quest",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Raid",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Save",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Scouting_Party",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Seaway",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Trade",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Training",
                set: "Adventures",
                types: ["Event"]
            },
            {
                name: "Travelling_Fair",
                set: "Adventures",
                types: ["Event"]
            },

            {
                name: "Advance",
                set: "Empires",
                types: ["Event"]
            },
            {
                name: "Annex",
                set: "Empires",
                types: ["Event"]
            },
            {
                name: "Banquet",
                set: "Empires",
                types: ["Event"]
            },
            {
                name: "Conquest",
                set: "Empires",
                types: ["Event"]
            },
            {
                name: "Delve",
                set: "Empires",
                types: ["Event"]
            },
            {
                name: "Dominate",
                set: "Empires",
                types: ["Event"]
            },
            {
                name: "Donate",
                set: "Empires",
                types: ["Event"]
            },
            {
                name: "Ritual",
                set: "Empires",
                types: ["Event"]
            },
            {
                name: "Salt_the_Earth",
                set: "Empires",
                types: ["Event"]
            },
            {
                name: "Tax",
                set: "Empires",
                types: ["Event"]
            },
            {
                name: "Triumph",
                set: "Empires",
                types: ["Event"]
            },
            {
                name: "Wedding",
                set: "Empires",
                types: ["Event"]
            },
            {
                name: "Windfall",
                set: "Empires",
                types: ["Event"]
            },
            {
                name: "Aqueduct",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Arena",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Bandit_Fort",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Basilica",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Baths",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Battlefield",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Colonnade",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Defiled_Shrine",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Fountain",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Keep",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Labyrinth",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Mountain_Pass",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Museum",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Obelisk",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Orchard",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Palace",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Tomb",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Tower",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Triumphal_Arch",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Wall",
                set: "Empires",
                types: ["Landmark"]
            },
            {
                name: "Wolf_Den",
                set: "Empires",
                types: ["Landmark"]
            },
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
.searchType label {
    color: #fff;
    font-family: 'Manolo Mono', sans-serif !important;
}
.searchType input {
    margin-right: 5px;
}

#numGenerateCards {
    font-size: 17px;
    width: 33px;
    background-color: #404040;
    border: 1px solid #404040;
    border-radius: 5px;
    color: white;
    padding: 3px 5px;
    margin-left: 8px;
    font-family: 'Manolo Mono', sans-serif !important;
}
#numCardsLabel {
    font-family: 'Manolo Mono', sans-serif !important;
}
#advancedKingdom {
    margin-top: 0px;
    font-family: 'Manolo Mono', sans-serif !important;
}

.buttons button {
    font-family: 'Manolo Mono', sans-serif !important;
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
.btn-dark:disabled {
    background-color: #2d2d2d;
    border-color: #333;
    opacity: 0.8;
    cursor: not-allowed;
    position: relative;
}
.btn-customlist {
    width: 110px;
    height: 32px;
    color: #618B4A !important;
    background-color: #404040;
    border: 2px solid #618B4A;
    outline: none;
    padding: 4px 7px;
    border-radius: 5px;
}
.btn-customlist:hover {
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
.p-autocomplete-panel {
    z-index: 1101 !important;
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
    width: 685px;
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

.card-wrapper {
    position: relative;
    display: inline-block;
}

.icon {
    position: absolute;
    right: 0px;
    background: red;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
    z-index: 2;
    font-weight: bold;
}
.delete-icon {
    background: red;
    color: white;
}
.delete-icon:hover {
    background: darkred;
}
.refresh-icon {
    background: gray;
    border: 2px solid gray;
}
.refresh-icon:hover {
    background: darkred;
    border: 2px solid darkred;
}

#selectedCards {
    position: sticky;
    top: 65px;
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
.riverboatCard {
    width: 118px;
    height: 185px;
    margin: 2px;
    border: 2px solid orange;
}
#advancedLandscapes {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 875px;
    margin-left: 15px;
}
.tinyLandscape {
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
#advancedFilters {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 820px;
}
#cardTypeContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 450px;
    height: 112.5px;
    justify-content: space-between;
}
#advancedCards {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 720px;
}
.traitCards {
    border: 3.5px solid purple;
}
.obeliskcard {
    border: 3.5px solid green;
}
#exitPopupMobile:hover {
    cursor: pointer;
}

#addRecordImg {
    width: 70px;
    height: 70px;
    border: none;
}
#addRecordImg:hover {
    cursor: pointer !important;
}

@media (max-width: 	420px) {
    .btn-smaller {
        width: 82px;
    }
    #dominionSelector {
        width: 100%;
        display: flex;
        flex-direction: column !important;
        align-items: center;
    }
    
    #filters {
        display: flex;
        flex-direction: column;
        width: 100%;
        position: relative;
        top: 0;
        margin-left: 0px;
        margin-right: 0px;
    }
    #cards {
        width: 98%;
        margin-left: 0px;
        margin-right: 0px;
        position: relative;
        top: 0;
    }
    img {
        height: 170px;
        width: 94px;
        border: 3px solid black;
        border-radius: 5px;
        margin: 1px;
    }

    #filterByOptions {
        display: flex; flex-direction: column !important;
    }
    #filterByOptions div {
        margin: 3px 0px !important;
    }
    label {
        font-size: smaller;
    }

    .gamepopup {
        margin-top: 80px;
        width: 400px;
        overflow-y: auto;
        height: 700px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #242526;
        border-radius: 2%;
        text-align: center;
        z-index: 1001;
        margin-bottom: 120px;
    }
    .popupContainer {
        width: 400px !important;
    }
    .popupContainer p { 
        margin-top: 0px;
        margin-bottom: 6px;
    }
    #exitPopupMobile {
        text-align: right;
        margin-right: 12px;
        color: white;
        margin-bottom: 0px;
        margin-top: 6px; 
        font-family: 'Manolo Mono', sans-serif !important;
    }
    #advancedFilters {
        width: 340px;
        flex-direction: column;
    }
    #cardTypeContainer {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 340px;
        height: 112.5px;
        justify-content: space-between;
    }
    .tags {
        text-align: left;
        color: white;
        margin-bottom: 5px;
        font-size: smaller;
        font-family: 'Manolo Mono', sans-serif !important;
    }
    #advancedCards {
        width: 380px !important;
    }
    .tinyCard {
        width: 72px;
        height: 110px;
        margin: 2px;
    }
    #advancedLandscapes {
        margin-top: 2px;
        width: 380px !important;
        flex-wrap: wrap;
        margin-left: 0px;
        margin-bottom: 90px;
    }
    .tinyLandscape {
        width: 160px;
        height: 105px;
        margin: 2px;
    }

    .icon {
        width: 20px;
        height: 20px;
    }
}
</style>