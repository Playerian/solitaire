// JavaScript File
/* global $*/
/*suit
1 -- diamond
2 -- club
3 -- heart
4 -- spade
*/
$(document).ready(function(){
    var cards = {};
    var trash = [];
    var reveal = [];
    
    //misc functions
    function duang(thing, string){
        thing.splice(thing.indexOf(string),1);
    }
    
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    
    //card functions
    function setCard(num, suit){
        this.name = (num - 1) * 4 + suit;
        this.number = num;
        this.suit = suit;
        this.row = 0;
        this.column = 0;
        this.inTrash = function(){
            if (trash.includes(this.name)){
                return true;
            } else {
                return false;
            }
        };
        this.inFound = false;
        this.foundZ = 0;
        this.show = false;
    }
    
    function getCard(num, suit){
        return cards[(num - 1) * 4 + suit];
    }
    
    function getCardPos(column, row){
        for (var i = 1; i <= 52; i ++){
            if (cards[i].row === row && cards[i].inTrash() === false && cards[i].inFound === false){
                if (cards[i].column === column){
                    return cards[i];
                }
            }
        }
        return undefined;
    }
    
    //card declare
    for (var i = 1; i <= 13; i ++){
        for (var i2 = 1; i2 <= 4; i2 ++){
            cards[(i - 1) * 4 + i2] = new setCard(i, i2);
        }
    }
        
    //deck create
    var deck = [];
    for (var i = 1; i <= 52; i ++){
        deck.push(i);
    }
    
    //place cards to field
    for (var i = 1; i <= 7; i ++){
        for (var i2 = 1; i2 <= i; i2 ++){
            var card = deck[randomInt(0, deck.length - 1)];
            duang(deck, card);
            cards[card].column = i;
            cards[card].row = i2;
            if (i == i2){
                cards[card].show = true;
            } else {
                cards[card].show = false;
            }
        }
    }
    //place cards to trash
    for (var i = 0; i < deck.length; i ++){
        var card = deck[randomInt(0, deck.length - 1)];
        duang(deck, card);
        trash.push(card);
    }
    
    //rendering
    var render = function (){
        //remove all cards from view
        $(".card").remove();
        //render in field
        for (var i = 1; i <= 7; i ++){
            for (var i2 = 1; i2 <= 17; i2 ++){
                var card = getCardPos(i, i2);
                if (card !== undefined){
                    var element = $("<img>").attr("class","card");
                    element.attr("id", card.name);
                    element.addClass("c"+i);
                    element.addClass("r"+i2);
                    if (card.show === true){
                            element.attr("src", "cards/" + card.number + "_" + card.suit + ".png");
                        } else {
                            element.attr("src", "cards/back.png");
                    }
                    $("#c"+i).append(element);
                }
            }
        }
        //render in trash
        for (var i = 1; i <= 52; i ++){
            if (cards[i].inTrash()){
                var element = $("<img>").attr("class","card");
                element.attr("id", i);
                element.addClass("trash");
                element.attr("src", "cards/back.png");
                $("#trash").append(element);
            }
        }
        //render in reveal
        for (var i = 0; i < reveal.length; i ++){
            var card = cards[reveal[i]];
            var element = $("<img>").attr("class","card");
            element.attr("id", i);
            element.addClass("reveal");
            if (card.show === true){
                element.attr("src", "cards/" + card.number + "_" + card.suit + ".png");
            } else {
                element.attr("src", "cards/back.png");
            }
            $("#reveal").append(element);
        }
    };
    
    render();

    setInterval(function(){
        window.cards = cards;
        window.render = render;
        window.trash = trash;
        window.reveal = reveal;
    }, 2000);
    
    //open the trash
    $("#trash").click(function(){
        //reveal a card if trash is not empty
        if (trash.length > 0){
            var card = trash.shift();
            reveal.push(card);
            cards[card].show = true;
            render();
        } else{
            //..else place reveals back into the trash
            //pre-record the length of reveal
            var length = reveal.length;
            for (var i = 0; i < length; i ++){
                //shift back
                trash.push(reveal.shift());
            }
            render();
        }
    });
    
    
    
    
    
    
    
    
    
});