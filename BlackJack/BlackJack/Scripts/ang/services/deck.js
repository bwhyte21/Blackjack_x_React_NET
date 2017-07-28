'use strict';

app.factory("Deck", function () {
    // create a random deck of cards and stack em!
    var cards = [];
    var suits = ["spade", "diamond", "club", "heart"];
    var values = [
        "two", "three", "four", "five", "six", "seven", "eight",
        "nine", "ten", "jack", "queen", "king", "ace"];
    var valuesMap = {
        "two": 2, "three": 3, "four": 4, "five": 5,
        "six": 6, "seven": 7, "eight": 8, "nine": 9,
        "ten": 10, "jack": 10, "queen": 10, "king": 10,
        "ace": 1
    };

    // The Fischer-Yates shuffle
    function shuffle(array) {
        var counter = array.length, temp, index;

        // while there are elements in the array
        while (counter > 0) {
            // pick a random index
            index = Math.floor(Math.random() * counter);
            // decrease counter by 1
            counter--;
            // and swap the last element with it
            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    }
    function newDeck() {
        cards = [];
        for (var i = 0; i < values.length; i++) {
            for (var j = 0; j < suits.length; j++) {
                cards.push({ value: values[i], suit: suits[j] });
            }
        }
        shuffle(cards);
    }

    function containsAce(array) {
        //works for modern browsers
        return array.indexOf('ace') !== -1;
    }

    newDeck();

    return {
        drawCard: function () {
            console.log("cards left:", cards.length);
            return cards.pop();
        },

        getRemainingCards: function () {
            return cards.length;
        },

        addScore: function (array) {
            var cardValues = [];
            for (var k = 0; k < array.length; k++) {
                cardValues.push(array[k].value);
            }

            var sum = 0;

            for (var i = 0; i < cardValues.length; i++) {
                sum += valuesMap[cardValues[i]];
            }

            //deal with ace condition
            //if ace as 11 is <= 21 go with it
            if (containsAce(cardValues)) {
                console.log("Another potential score is: ", sum - 1 + 11);
                var ace_11_score = sum + 10;

                if (ace_11_score <= 21) {
                    sum = ace_11_score;
                }
                else {
                    console.log("The ace makes you bust, use it as 1 instead");
                }
            }

            console.log("Best current score is now", sum);

            return sum;
        },

        shuffleDeck: function () {
            newDeck();
        }
    };
});