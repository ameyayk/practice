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

const areArraysEqualOrdered = (array1, array2) => {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; i += 1) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
};

const choosePlayingOrder = (numberOfPlayers) => {
  const initialPlayingOrder = [];
  for (let i = 1; i <= numberOfPlayers; i += 1) {
    initialPlayingOrder.push(i);
  }
  const randomisedPlayingOrder = shuffle(initialPlayingOrder);

  /* while (areArraysEqualOrdered(randomisedPlayingOrder, initialPlayingOrder)) {
    randomisedPlayingOrder = shuffle(initialPlayingOrder);
    consola.info(initialPlayingOrder.join(','), randomisedPlayingOrder.join(','));
  } */
  return randomisedPlayingOrder;
};

const evaluateHand = (hands, trumpSuite) => {
  // first evaluate whether anyone played the trump suite
  const playedTrumpCards = _.filter(hands, (h) => h.card.suite === trumpSuite);
  if (playedTrumpCards.length > 0) {
    // return the winningHand by the value
    const winningHand = _.maxBy(playedTrumpCards, 'card.value');
    return winningHand;
  }

  // if no one played the winning suite go for evaluation of suite of hands
  const suiteOfHand = hands[0].card.suite;
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
  const cardIndex = Math.floor(Math.random() * cardsLeft);
  const playedHand = hand[cardIndex];
  hand.splice(cardIndex, 1);
  return playedHand;
};

module.exports.playGame = (numberOfPlayers) => {
  const trumpSuite = chooseTrump();
  const initialPlayingOrder = choosePlayingOrder(numberOfPlayers);
  const deckToPlayWith = shuffledDeck();
  const dealtHands = dealCards(numberOfPlayers, deckToPlayWith);
  const numberOfRounds = Math.floor(52 / numberOfPlayers);
  let currentPlayingOrder = initialPlayingOrder;
  for (let rnd = 0; rnd < numberOfRounds; rnd += 1) {
    consola.info(`playing order for round  ${rnd} - ${currentPlayingOrder.join(',')}`);
    const currentRound = [];
    const tempCurrentPlayingOrder = currentPlayingOrder.slice();
    while (tempCurrentPlayingOrder.length > 0) {
      // playing order is a one indexed array while the cards dealt is a 0 indexed one
      const currentPlayerIndex = tempCurrentPlayingOrder.shift() - 1;
      currentRound.push({
        card: playCard(dealtHands[currentPlayerIndex], numberOfRounds - rnd),
        playerIndex: currentPlayerIndex,
      });
    }

    const winningHand = evaluateHand(currentRound, trumpSuite);
    consola.info('winner-', winningHand.playerIndex + 1);
    const a = currentPlayingOrder.slice(currentPlayingOrder.indexOf(winningHand.playerIndex + 1));
    const b = _.difference(initialPlayingOrder, a);
    currentPlayingOrder = _.concat(a, b);
  }
};
