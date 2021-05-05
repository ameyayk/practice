const { expect, assert } = require('chai');
const rewire = require('rewire');

const doc = rewire('../lib/deck-of-cards');

const chooseTrump = doc.__get__('chooseTrump');
const dealCards = doc.__get__('dealCards');
const createDeck = doc.__get__('createDeck');
const shuffledDeck = doc.__get__('shuffledDeck');
const choosePlayingOrder = doc.__get__('choosePlayingOrder');
const evaluateHand = doc.__get__('evaluateHand');
const areArraysEqualOrdered = doc.__get__('areArraysEqualOrdered');
const findIndexOfCardOfHighestFaceValue = doc.__get__('findIndexOfCardOfHighestFaceValue');
const findOptimumCardMatchingSuiteOfHand = doc.__get__('findOptimumCardMatchingSuiteOfHand');

const { playGame } = require('../lib/deck-of-cards');

describe('deck of cards test case', () => {
  it('chooseTrump should return the trump suite', () => {
    const actual = chooseTrump();
    expect(['HEARTS', 'CLUBS', 'SPADES', 'DIAMONDS']).to.include(actual);
    expect(actual).to.not.eql('NON_EXISTINg');
  });

  it('dealCards should properly distribute 13 cards amongs the 4 players', () => {
    const deck = shuffledDeck();
    const numberOfPlayers = 4;
    const hands = dealCards(numberOfPlayers, deck);

    expect(hands[0].length).to.eql(13);
    expect(hands[1].length).to.eql(13);
    expect(hands[2].length).to.eql(13);
    expect(hands[3].length).to.eql(13);
  });

  it('dealCards should properly distribute 8 cards amongs the 6 players', () => {
    const numberOfPlayers = 6;
    const deck = shuffledDeck();
    const hands = dealCards(numberOfPlayers, deck);
    expect(hands[0].length).to.eql(8);
    expect(hands[1].length).to.eql(8);
    expect(hands[2].length).to.eql(8);
    expect(hands[3].length).to.eql(8);
    expect(hands[4].length).to.eql(8);
    expect(hands[5].length).to.eql(8);
  });

  it('createDeck should return a pack of 52 cards', () => {
    const deck = createDeck();
    expect(deck).to.have.lengthOf(52);
  });

  it('shuffledDeck should create a shuffled deck properly', () => {
    const deck = createDeck();
    const randomizedDeck = shuffledDeck(deck);
    assert.notSameOrderedMembers(deck, randomizedDeck);
  });

  it('choosePlayingOrder should get random playing order', () => {
    const numberOfPlayers = 4;
    const playingOrder1 = choosePlayingOrder(numberOfPlayers);
    const playingOrder2 = choosePlayingOrder(numberOfPlayers);

    assert.notSameOrderedMembers(playingOrder1, playingOrder2);
  });
  it('evaluateHand should return the winning hand in case trump suite is played', () => {
    const trumpSuite = 'SPADES';

    const hands = [
      {
        card: {
          value: 2,
          suite: 'SPADES',
        },
        playerIndex: 4,
      },
      {
        card: {
          value: 13,
          suite: 'HEARTS',
        },
        playerIndex: 2,
      },
      {
        card: {
          value: 2,
          suite: 'DIAMONDS',
        },
        playerIndex: 1,
      },
      {
        card: {
          value: 5,
          suite: 'CLUBS',
        },
        playerIndex: 3,
      },
    ];
    const winningHand = evaluateHand(hands, trumpSuite);
    expect(winningHand).to.deep.eql({
      card: {
        value: 2,
        suite: 'SPADES',
      },
      playerIndex: 4,
    });
  });

  it('evaluateHand should return the winning hand in case of higest suite of hand is played', () => {
    const trumpSuite = 'SPADES';

    const hands = [
      {
        card: {
          value: 2,
          suite: 'CLUBS',
        },
        playerIndex: 2,
      },
      {
        card: {
          value: 13,
          suite: 'HEARTS',
        },
        playerIndex: 4,
      },
      {
        card: {
          value: 2,
          suite: 'DIAMONDS',
        },
        playerIndex: 1,
      },
      {
        card: {
          value: 5,
          suite: 'CLUBS',
        },
        playerIndex: 3,
      },
    ];
    const winningHand = evaluateHand(hands, trumpSuite);
    expect(winningHand).to.deep.eql({
      card: {
        value: 5,
        suite: 'CLUBS',
      },
      playerIndex: 3,
    });
  });

  it('evaluateHand should return the winning hand in case of when neither trump suite nor more than 1 suite of hand card is played', () => {
    const trumpSuite = 'SPADES';

    const hands = [
      {
        card: {
          value: 2,
          suite: 'CLUBS',
        },
        playerIndex: 1,
      },
      {
        card: {
          value: 13,
          suite: 'HEARTS',
        },
        playerIndex: 2,
      },
      {
        card: {
          value: 2,
          suite: 'DIAMONDS',
        },
        playerIndex: 3,
      },
      {
        card: {
          value: 5,
          suite: 'HEARTS',
        },
        playerIndex: 4,
      },
    ];
    const winningHand = evaluateHand(hands, trumpSuite);
    expect(winningHand).to.deep.eql({
      card: {
        value: 13,
        suite: 'HEARTS',
      },
      playerIndex: 2,
    });
  });

  it('playGame should exercise the game', () => {
    const numberOfPlayers = 4;
    playGame(numberOfPlayers);
  });

  it('areArraysEqualOrdered should return true for ordered arrays', () => {
    const a = [1, 2, 3, 4];
    const b = [1, 2, 3, 4];
    const areEqual = areArraysEqualOrdered(a, b);
    expect(areEqual).to.eql(true);
  });

  it('areArraysEqualOrdered should return false for unordered arrays', () => {
    const a = [2, 3, 1, 4];
    const b = [1, 2, 3, 4];
    const areEqual = areArraysEqualOrdered(a, b);
    expect(areEqual).to.eql(false);
  });

  it('findCardOfHighestFaceValue should return the maximum faceValue card', () => {
    const hands = [
      { value: 5, suite: 'SPADES' },
      { value: 2, suite: 'SPADES' },
      { value: 14, suite: 'CLUBS' },
      { value: 13, suite: 'SPADES' },
      { value: 7, suite: 'CLUBS' },
      { value: 9, suite: 'DIAMONDS' },
      { value: 11, suite: 'SPADES' },
      { value: 12, suite: 'DIAMONDS' },
      { value: 3, suite: 'CLUBS' },
      { value: 3, suite: 'SPADES' },
      { value: 3, suite: 'HEARTS' },
      { value: 7, suite: 'DIAMONDS' },
      { value: 4, suite: 'DIAMONDS' },
    ];

    const actual = findIndexOfCardOfHighestFaceValue(hands);
    expect(actual).to.eql(2);
  });

  it('findCardOfHighestFaceValue should return the first maximum faceValue card in case of collision', () => {
    const hands = [
      { value: 5, suite: 'SPADES' },
      { value: 2, suite: 'SPADES' },
      { value: 7, suite: 'CLUBS' },
      { value: 9, suite: 'DIAMONDS' },
      { value: 14, suite: 'SPADES' },
      { value: 14, suite: 'CLUBS' },
      { value: 11, suite: 'SPADES' },
      { value: 12, suite: 'DIAMONDS' },
      { value: 3, suite: 'CLUBS' },
      { value: 3, suite: 'SPADES' },
      { value: 3, suite: 'HEARTS' },
      { value: 7, suite: 'DIAMONDS' },
      { value: 4, suite: 'DIAMONDS' },
    ];

    const actual = findIndexOfCardOfHighestFaceValue(hands);
    expect(actual).to.eql(4);
  });

  // it('findOptimumCardMatchingSuiteOfHand should play the max value of suite of hand in order to win', () => { });

  // it('findOptimumCardMatchingSuiteOfHand should play the min value of suite of hand if there ', () => { });
});
