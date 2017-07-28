'use strict';

app.controller('GameCtrl', ['$scope', 'Deck', '$timeOut'], function ($scope, Deck, $timeOut) {
    // init
    var dealerScore = null;
    var playerOneScore = null;
    //var playerTwoScore = null;
    //var playerThreeScore = null;

    $scope.dealerRoundsWon = 0;
    $scope.playerOneRoundsWon = 0;
    //$scope.playerTwoRoundsWon = 0;
    //$scope.playerThreeRoundsWon = 0;

    $scope.gameOver = false;

    newHand();

    // draw cards while checking if the dealer got 21
    $scope.hit = function () {
        $scope.playerOneCards.push(Deck.drawCard());
        playerOneScore = Deck.addScore($scope.playerOneCards);

        $timeOut(function () {
            if (playerOneScore > 21) {
                displayScores();
                alert("Busted!");
                $scope.dealerRoundsWon++;
                newHand();
            }
        }, 300);
    };

    // dealer draws until 17+ and will either win or lose to player(s)
    $scope.stand = function () {
        dealerScore = Deck.addScore($scope.dealerCards);
        if (dealerScore < 17) {
            console.log("dealer draws a card");
            alert("dealer draws a card");
            $scope.dealerCards.push(Deck.drawCard());
            $timeOut($scope.stand, 300); // ToDo: add a longer pause later if wanted
        }
        else if (dealerScore > 21) {
            displayScores();
            alert("Dealer Busted!");
            $scope.playerOneRoundsWon++; // ToDo: Replace with currency instead of points
            newHand();
        }
        else {
            displayScores();
            if (playerOneScore === dealerScore) {
                alert("Push!");
                newHand();
            }
            else if (playerOneScore > dealerScore) {
                alert("Player One Wins!");
                newHand();
            }
            else if (playerOneScore < dealerScore) {
                alert("Dealer Wins!");
                newHand();
            }
        }
    };

    function newHand() {
        console.log("Game is over, getting new hand...");
        $scope.gameOver = true;

        $timeOut(function () {
            // shuffle when the deck is halfway done
            if (Deck.getRemainingCards() < 26) {
                console.log('Reshuffling Deck');
                Deck.shuffleDeck();
            }
            // [card one, card two]
            $scope.dealerCards = [Deck.drawCard(), Deck.drawCard()];
            $scope.playerOneCards = [Deck.drawCard(), Deck.drawCard()];

            // scores
            dealerScore = Deck.addScore();
            playerOneScore = Deck.addScore();

            // game over
            $scope.gameOver = false;
        }, 800);
    }

    var displayScores = function () {
        console.log("|-----Player One: ", playerOneScore, "----- Dealer: ", dealerScore, "-----|");
    };
});