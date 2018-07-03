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
    
    //misc functions
    function duang(thing, string){
        thing.splice(thing.indexOf(string),1);
    }
    
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    
    //card functions
    function setCard(num, suit){
        this.number = num;
        this.suit = suit;
        this.row = 0;
        this.column = 0;
        this.inTrash = false;
        this.trashZ = 0;
        this.show = false;
        this.name = (num - 1) * 4 + suit;
    }
    
    function getCard(num, suit){
        return cards[(num - 1) * 4 + suit];
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
            if (i === i2){
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
        cards[card].inTrash = true;
        cards[card].trashZ = i + 1;
    }
    
    //rendering
    function render(){
        $(".card").remove();
        for (var i = 1; i <= 52; i ++){
            var element = $("<img>").attr("class","card");
            element.attr("src", "cards/" + cards[i].number + "_" + cards[i].suit + ".png");
            $("#c" + cards[i].column).append(element);
            cards[i];
        }
    }
    
    render();
    
    
    
    
    
    
    
    
    
    
    
    
    
});