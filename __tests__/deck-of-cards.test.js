const { expect, assert } = require('chai');
const rewire = require('rewire');

const doc = rewire('../lib/deck-of-cards');

const chooseTrump = doc.__get__('chooseTrump');
const dealCards = doc.__get__('dealCards');
const createDeck = doc.__get__('createDeck');
const shuffledDeck = doc.__get__('shuffledDeck');
const choosePlayingOrder = doc.__get__('choosePlayingOrder');
const evaluateHand = doc.__get__('evaluateHand');

const { playGame } = require('../lib/deck-of-cards');

describe('deck of cards test case', () => {
  xit('chooseTrump should return the trump suite', () => {
    const actual = chooseTrump();
    expect(['HEARTS', 'CLUBS', 'SPADES', 'DIAMONDS']).to.include(actual);
    expect(actual).to.not.eql('NON_EXISTINg');
  });

  xit('dealCards should properly distribute 13 cards amongs the 4 players', () => {
    const deck = shuffledDeck();
    const numberOfPlayers = 4;
    const hands = dealCards(numberOfPlayers, deck);

    expect(hands[0].length).to.eql(13);
    expect(hands[1].length).to.eql(13);
    expect(hands[2].length).to.eql(13);
    expect(hands[3].length).to.eql(13);
  });

  xit('dealCards should properly distribute 8 cards amongs the 6 players', () => {
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

  xit('createDeck should return a pack of 52 cards', () => {
    const deck = createDeck();
    expect(deck).to.have.lengthOf(52);
  });

  xit('shuffledDeck should create a shuffled deck properly', () => {
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
  xit('evaluateHand should return the winning hand in case trump suite is played', () => {
    const trumpSuite = 'SPADES';

    const hands = [
      {
        card: {
          value: 1,
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
      value: 1,
      suite: 'SPADES',
    });
  });

  xit('evaluateHand should return the winning hand in case of higest suite of hand is played', () => {
    const trumpSuite = 'SPADES';

    const hands = [
      {
        card: {
          value: 1,
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
      value: 5,
      suite: 'CLUBS',
    });
  });

  it('evaluateHand should return the winning hand in case of when neither trump suite nor more than 1 suite of hand card is played', () => {
    const trumpSuite = 'SPADES';

    const hands = [
      {
        card: {
          value: 1,
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
});