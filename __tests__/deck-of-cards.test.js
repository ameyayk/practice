const { expect, assert } = require('chai');
const rewire = require('rewire');

const doc = rewire('../lib/deck-of-cards');

const chooseTrump = doc.__get__('chooseTrump');
const dealCards = doc.__get__('dealCards');
const createDeck = doc.__get__('createDeck');
const shuffledDeck = doc.__get__('shuffledDeck');
const choosePlayingOrder = doc.__get__('choosePlayingOrder');
const evaluateHand = doc.__get__('evaluateHand');

describe('deck of cards test case', () => {
  it('chooseTrump should return the trump suite', () => {
    const actual = chooseTrump();
    expect(['HEARTS', 'CLUBS', 'SPADES', 'DIAMONDS']).to.include(actual);
    expect(actual).to.not.eql('NON_EXISTINg');
  });

  xit('dealCards should properly distribute 13 cards amongs the 4 players', () => {
    const deck = shuffledDeck();
    const numberOfPlayers = 4;
    const hands = dealCards(numberOfPlayers, deck);

    for (let i = 0; i < numberOfPlayers; i = +1) {
      expect(hands[i]).to.have.lengthOf(13);
    }
  });

  xit('dealCards should properly distribute 8 cards amongs the 6 players', () => {
    const numberOfPlayers = 6;
    const deck = shuffledDeck();
    const hands = dealCards(numberOfPlayers, deck);
    for (let i = 0; i < numberOfPlayers; i = +1) {
      expect(hands[i]).to.have.lengthOf(8);
    }
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

  xit('choosePlayingOrder should get random playing order', () => {
    const numberOfPlayers = 4;
    const playingOrder1 = choosePlayingOrder(numberOfPlayers);
    const playingOrder2 = choosePlayingOrder(numberOfPlayers);
    assert.notSameOrderedMembers(playingOrder1, playingOrder2);
  });
  xit('evaluateHand should return the winning hand in case trump suite is played', () => {
    const trumpSuite = 'SPADES';

    const hands = [
      {
        value: 1,
        suite: 'SPADES',
      },
      {
        value: 13,
        suite: 'HEARTS',
      },
      {
        value: 2,
        suite: 'DIAMONDS',
      },
      {
        value: 5,
        suite: 'CLUBS',
      },
    ];
    const winningHand = evaluateHand(hands, trumpSuite);
    expect(winningHand).to.deep.eql({
      value: 1,
      suite: 'SPADES',
    });
  });

  it('evaluateHand should return the winning hand in case of higest suite of hand is played', () => {
    const trumpSuite = 'SPADES';

    const hands = [
      {
        value: 1,
        suite: 'CLUBS',
      },
      {
        value: 13,
        suite: 'HEARTS',
      },
      {
        value: 2,
        suite: 'DIAMONDS',
      },
      {
        value: 5,
        suite: 'CLUBS',
      },
    ];
    const winningHand = evaluateHand(hands, trumpSuite);
    expect(winningHand).to.deep.eql({
      value: 5,
      suite: 'CLUBS',
    });
  });

  it('evaluateHand should return the winning hand in case of when neither trump suite nor sui', () => {
    const trumpSuite = 'SPADES';

    const hands = [
      {
        value: 1,
        suite: 'CLUBS',
      },
      {
        value: 13,
        suite: 'HEARTS',
      },
      {
        value: 2,
        suite: 'DIAMONDS',
      },
      {
        value: 5,
        suite: 'HEARTS',
      },
    ];
    const winningHand = evaluateHand(hands, trumpSuite);
    expect(winningHand).to.deep.eql({
      value: 13,
      suite: 'HEARTS',
    });
  });
});
