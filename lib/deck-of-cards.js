const suites = ['HEARTS', 'CLUBS', 'SPADES', 'DIAMONDS'];
const faceValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const shuffle = require('shuffle-array');
const _ = require('lodash');
const consola = require('consola');

const chooseTrump = () => {
  const trumpIndex = Math.floor(Math.random() * 3) + 1;
  return suites[trumpIndex];
};

const dealCards = (numberOfPlayers, deck) => {
  const totalNumberOfCards = suites.length * faceValues.length;
  const cardsForEachPlayer = Math.floor(totalNumberOfCards / numberOfPlayers);

  const hands = Array(numberOfPlayers)
    .fill(null)
    .map(() => Array(cardsForEachPlayer).fill({}));

  for (let i = 0; i < numberOfPlayers; i += 1) {
    for (let j = 0; j < cardsForEachPlayer; j += 1) {
      const topCard = deck.shift();
      hands[i][j] = topCard;
    }
  }

  return hands;
};

const createDeck = () => {
  const deck = [];
  for (let suitesIndex = 0; suitesIndex < suites.length; suitesIndex += 1) {
    for (let faceValueIndex = 0; faceValueIndex < faceValues.length; faceValueIndex += 1) {
      const card = { value: faceValues[faceValueIndex], suite: suites[suitesIndex] };
      deck.push(card);
    }
  }
  return deck;
};

const shuffledDeck = () => {
  const originalDeck = createDeck();
  return shuffle(originalDeck);
};

const choosePlayingOrder = (numberOfPlayers) => {
  const players = [];
  for (let i = 1; i <= numberOfPlayers; i += 1) {
    players.push(i);
  }
  return shuffle(players);
};

const evaluateHand = (hands, trumpSuite) => {
  // first evaluate whether anyone played the trump suite
  consola.info(hands);
  const playedTrumpCards = _.filter(hands, (h) => h.card.suite === trumpSuite);

  if (playedTrumpCards.length > 0) {
    // return the winningHand by the value
    const winningHand = _.maxBy(playedTrumpCards, 'card.value');
    return winningHand;
  }

  // if no one played the winning suite go for evaluation of suite of hands
  const suiteOfHand = hands[0].suite;
  const playedSuiteOfHands = _.filter(hands, (h) => h.card.suite === suiteOfHand);

  if (playedSuiteOfHands.length > 1) {
    // return the highest value of the suite of hands played
    const winningHand = _.maxBy(playedSuiteOfHands, 'card.value');
    return winningHand;
  }

  // if neither trump or suite of hand was played
  return _.maxBy(hands, 'card.value');
};

const playCard = (hand, cardsLeft) => {
  const cardIndex = Math.floor(Math.random() * cardsLeft) + 1;
  return hand[cardIndex];
};

module.exports.playGame = (numberOfPlayers) => {
  const trumpSuite = chooseTrump();
  const initialPlayingOrder = choosePlayingOrder(numberOfPlayers);
  const deckToPlayWith = shuffledDeck();
  const dealtHands = dealCards(numberOfPlayers, deckToPlayWith);
  const numberOfRounds = Math.floor(52 / numberOfPlayers);
  let currentPlayingOrder = initialPlayingOrder;
  for (let rnd = 0; rnd < numberOfRounds; rnd += 1) {
    const currentRound = [];
    while (currentPlayingOrder.length > 0) {
      const currentPlayerIndex = currentPlayingOrder.shift() - 1;
      currentRound.push({
        card: playCard(dealtHands[currentPlayerIndex], numberOfRounds - rnd),
        playerIndex: currentPlayerIndex,
      });
    }
    const winningHand = evaluateHand(currentRound, trumpSuite);
    const a = initialPlayingOrder.slice(initialPlayingOrder.indexOf(winningHand.playerIndex));
    const b = _.difference(initialPlayingOrder, a);
    currentPlayingOrder = _.concat(a, b);
  }
};