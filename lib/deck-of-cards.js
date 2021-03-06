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
  let randomisedPlayingOrder = _.shuffle(initialPlayingOrder);
  while (areArraysEqualOrdered(randomisedPlayingOrder, initialPlayingOrder)) {
    randomisedPlayingOrder = _.shuffle(randomisedPlayingOrder);
  }
  return _.shuffle(initialPlayingOrder);
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

const findIndexOfCardOfHighestFaceValue = (hands) => {
  const maxFaceValueCard = _.maxBy(hands, 'value');
  return _.indexOf(hands, maxFaceValueCard);
};
const findIndexOfOptimumCardToPlay = (hand, currentRound, trumpSuite) => {
  if (currentRound.length > 0) {
    const openingHand = currentRound[0];
    const trumpCardsWithThePlayer = _.filter(hand, (h) => h.suite === trumpSuite);
    const suiteofHandsCardsWithPlayer = _.filter(hand, (h) => h.suite === openingHand.card.suite);
    const trumpCardsInTheRound = _.filter(currentRound, (r) => r.card.suite === trumpSuite);

    if (trumpCardsInTheRound.length > 1 && trumpCardsWithThePlayer.length > 1) {
      // if the trump card is played in the round and the player also has a trump card,
      // select the card which is going to maximise the chances of winning
      //  const maxTrumpCard = _.maxBy(trumpCardsWithThePlayer, 'value');
      const cardsWithPlayerOfTrumpSuiteWithValueMoreThanAlreadyPlayed = _.chain(hand)
        .filter((h) => h.suite === trumpSuite && h.value > openingHand.card.value)
        .orderBy('value', 'asc')
        .value();
      return _.indexOf(hand, cardsWithPlayerOfTrumpSuiteWithValueMoreThanAlreadyPlayed[0]);
    }
    if (trumpCardsInTheRound.length === 0 && suiteofHandsCardsWithPlayer.length > 1) {
      // if no trump cards are played but the player has got the suite of hand
      const cardsWithPlayerWithValueMoreThanOpeningCard = _.chain(hand)
        .filter((h) => h.suite === openingHand.card.suite && h.value > openingHand.card.value)
        .orderBy('value', 'asc')
        .value();

      if (cardsWithPlayerWithValueMoreThanOpeningCard.length > 0) {
        // card with suite of hand and face value more than the opening card.Possibility to win
        return _.indexOf(hand, cardsWithPlayerWithValueMoreThanOpeningCard[0]);
      }
      // cards with suite of hand and face value less than the opening card.No Chance to win.
      const cardsWithPlayerWithValueLessThanOpeningCard = _.chain(hand)
        .filter((h) => h.suite === openingHand.card.suite)
        .orderBy('value', 'asc')
        .value();
      if (cardsWithPlayerWithValueMoreThanOpeningCard.length > 0) {
        // card with suite of hand and face value more than the opening card.Possibility to win
        return _.indexOf(hand, cardsWithPlayerWithValueLessThanOpeningCard[0]);
      }
    }
    if (
      trumpCardsInTheRound.length === 0 &&
      suiteofHandsCardsWithPlayer.length === 0 &&
      trumpCardsWithThePlayer.length > 1
    ) {
      // no trump card played in the current round
      // no suite of hand present with the player
      // play the max trump card
      const maxTrumpCard = _.maxBy(trumpCardsWithThePlayer, 'value');
      return _.indexOf(hand, maxTrumpCard);
    }
    /*    
      In all other cases, put the least face value card, preferably non trump 
    */
    return -1;
  }

  // starting the round
  const cardsOfHigestFaceValues = _.maxBy(hand, 'value');
  return _.indexOf(hand, cardsOfHigestFaceValues);
};

const playCard = (hand, cardsLeft, currentRound, trumpSuite) => {
  if (currentRound.length > 1) {
    let indexOfCardToPlay = -1;

    indexOfCardToPlay = findIndexOfOptimumCardToPlay(hand, currentRound, trumpSuite);

    if (indexOfCardToPlay === -1) {
      // if suite if hand is not found then return a random card
      indexOfCardToPlay = Math.floor(Math.random() * cardsLeft);
    }

    // play the hand
    const handToPlay = hand[indexOfCardToPlay];
    // remove the card from the hand
    hand.splice(indexOfCardToPlay, 1);

    return handToPlay;
  }
  // this is hit when the user is the first to play
  const indexOfCardToStartTheRound = findIndexOfCardOfHighestFaceValue(hand);
  const playedHand = hand[indexOfCardToStartTheRound];
  hand.splice(indexOfCardToStartTheRound, 1);
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
        card: playCard(
          dealtHands[currentPlayerIndex],
          numberOfRounds - rnd,
          currentRound,
          trumpSuite,
        ),
        playerIndex: currentPlayerIndex,
      });
    }

    const winningHand = evaluateHand(currentRound, trumpSuite);
    const a = currentPlayingOrder.slice(currentPlayingOrder.indexOf(winningHand.playerIndex + 1));
    const b = _.difference(initialPlayingOrder, a);
    currentPlayingOrder = _.concat(a, b);
  }
};
