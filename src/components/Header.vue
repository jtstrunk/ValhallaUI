<template>
    <nav>
        <h2>Valhalla's Tabletop Games</h2>
        <div style="display: flex; flex-direction: row;" >
            <a href="/home" class="">Return Home</a>
            <a href="/addGame" class="">Add Record</a>
            <div class="dropdown MobileHide">
                <button class="dropbtn" style="width: 85px !important;">View Tools</button>
                <div class="dropdown-content">
                    <a href="/showGames">View Records</a>
                    <a href="/DominionSelect">Dominion Selector</a>
                </div>
            </div>
            <a href="/profile?name=current" class="">Your Profile</a>
            <a href="/logout" class="">Log Out</a>
        </div>
    </nav>
</template>

<style>
nav{
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: #333333;
    width: 100%;
    position: sticky;
    top: 0px;
    z-index: 1000;
}

nav a {
    margin: 10px;
    height: 20px;
    text-decoration: none;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 6px;
    padding-right: 6px;
    border: 1px solid black;
    border-radius: 8px;
    text-align: center;
    color: black;
    background-color: white;
}

nav h2 {
    margin-top: 10px;
    margin-bottom: 12px;
    margin-right: 100px;
    color: white;
}

/* Style the dropdown button */
.dropbtn {
    margin: 10px;
    height: 30px;
    text-decoration: none;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 6px;
    padding-right: 6px;
    border: 1px solid black;
    border-radius: 8px;
    text-align: center;
    color: black;
    background-color: white;
    display: block;
    cursor: pointer;
    font-size: 15px;
}

.dropbtn:hover {
    margin: 10px;
    height: 30px;
    text-decoration: none;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 6px;
    padding-right: 6px;
    border: 1px solid black;
    border-radius: 8px;
    text-align: center;
    color: black;
    background-color: white;
    display: block;
    cursor: pointer;
    font-size: 15px;
}
  
/* Style the dropdown content (hidden by default) */
.dropdown-content {
    display: none;
    position: absolute;
    z-index: 1;
    /* display: block;
    width: 90px; */
}

.dropdown:hover a {
    width: 130px;
    display: block;
    margin: 0 10px;
    margin-bottom: 2px;
}
  
/* Show the dropdown content on hover */
.dropdown:hover .dropdown-content {
    display: block;
    width: 90px;
}
</style>