export const GAME_PLAYER_COUNTS = {
  'Dominion': '2 - 4 Players',
  'Moonrakers': '1 - 5 Players',
  'Clank': '2 - 4 Players',
  'Lords of Waterdeep': '2 - 6 Players',
  'Slay the Spire': '1 - 4 Players',
  'Race for the Galaxy': '2 - 4 Players',
  'Heat': '1 - 6 Players',
  'Space Base': '2 - 5 Players',
  '7 Wonders': '2 - 7 Players',
  'Root': '2 - 6 Players',
  'Puerto Rico': '3 - 5 Players',
  'Cosmic Encounter': '3 - 5 Players',
  'Catan': '3 - 6 Players',
  'Munchkin': '3 - 6 Players',
  'Dune Imperium': '1 - 4 Players',
  'Stratego': '2 Players',
  '5 Minute Marvel': '2 - 5 Players',
  '7 Wonders Duel': '2 Players',
  'Boss Monster': '1 - 4 Players',
  'Star Wars The Deckbuilding Game': '2 Players',
  'Clank Catacombs': '2 - 4 Players',
  'Duel for Middle-Earth': '2 Players'
};

export function getGamePlayerCounts() {
  return { ...GAME_PLAYER_COUNTS };
}
