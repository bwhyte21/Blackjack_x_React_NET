'use strict';

app.directive('card', function () {
    return {
        restrict: 'A',
        replace: true,
        scope: true,
        template: "<div class='col-xs-1'>" +
                      "<div class='card slide-right'></div>" +
                  "</div>",
        link: function (scope, elem, attr) {
            var cardElem = angular.element(elem.children());

            //flip the dealer hole card when game ends
            scope.$watch(function () {
                return scope.gameOver; }, function () {
                if (scope.gameOver) {
                    cardElem.removeAttr('class');
                    cardElem.addClass(attr.suit);
                    cardElem.addClass(attr.value);
                    cardElem.addClass('card');
                }
            });

            //for facedown card
            if (attr.first === 'true') {
                cardElem.removeAttr('class');
                cardElem.addClass('back');
                cardElem.addClass('card');
            }

            else {
                cardElem.addClass(attr.suit);
                cardElem.addClass(attr.value);
                cardElem.addClass('card');
            }
        }
    };
});