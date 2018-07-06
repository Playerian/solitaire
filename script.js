// JavaScript File
/* global $*/
/*suit
1 -- diamond
2 -- club
3 -- heart
4 -- spade
*/
var a = 1;
$(document).ready(function(){
    var cards = {};
    var trash = [];
    var reveal = [];
    var holding = false;
    var holder;
    var intervaling = false;
    
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
            if (trash.includes(this.name) || (reveal.includes(this.name))){
                return true;
            } else {
                return false;
            }
        };
        this.inFound = false;
        this.foundZ = 0;
        this.show = false;
        //check if another card is different color
        this.isDiffColor = function(card){
            //if black
            if (this.suit === 1 || this.suit === 3){
                if (card.suit === 2 || card.suit === 4){
                    return true;
                }
            }
            //if red
            if (this.suit === 2 || this.suit === 4){
                if (card.suit === 1 || card.suit === 3){
                    return true;
                }
            }
            return false;
        };
        //check if another card is 1 number higher
        this.isOneLower = function(card){
            if (this.number + 1 === card.number){
                return true;
            }
            return false;
        };
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
    
    function columnHeight(columnNo){
        var count = 0;
        for (var i = 1; i <= 52; i++){
            var c = cards[i].column;
            if (parseInt(cards[i].column) === parseInt(columnNo)){
                count ++;
            }
        }
        return count;
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
    
    //hides preload docs
    $(".preload").hide();
    
    //rendering
    function render(){
        //Any necessary changes relative to cards
        //if the bottommost card in a column is facedown, then flip it up
        for (var i = 1; i <= 7; i ++){
            for (var i2 = 1; i2 <= 17; i2 ++){
                var card = getCardPos(i, i2);
                if (card !== undefined){
                    if (card.show === false && getCardPos(i, i2 + 1) === undefined){
                        card.show = true;
                    }
                }
            }
        }
        
        //real rendering process
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
                            element.addClass("unclickable");
                            element.attr("src", "cards/back.png");
                    }
                    if (holder === card){
                        element.addClass("holding");
                    }
                    $("#c"+i).append(element);
                }
            }
        }
        //render in trash
        for (var i = 0; i < trash.length; i ++){
            var element = $("<img>").attr("class","card");
            element.attr("id", cards[trash[i]]);
            element.addClass("trash");
            element.addClass("unclickable");
            element.attr("src", "cards/back.png");
            $("#trash").append(element);
        }
        //render in reveal
        for (var i = 0; i < reveal.length; i ++){
            var card = cards[reveal[i]];
            var element = $("<img>").attr("class","card");
            element.attr("id", reveal[i]);
            element.addClass("reveal");
            if (card.show === true){
                element.attr("src", "cards/" + card.number + "_" + card.suit + ".png");
            } else {
                element.attr("src", "cards/back.png");
            }
            if (holder === card){
                element.addClass("holding");
            }
            $("#reveal").append(element);
        }
        
        //add click handlers onto all the cards
        cardClickF();
    }
    
    render();
    
    if (intervaling === false){
        intervaling = true;
        setInterval(function(){
            window.cards = cards;
            window.render = render;
            window.trash = trash;
            window.reveal = reveal;
            window.holding = holding;
            window.holder = holder;
        }, 2000);
    }
    
    
    //open the trash
    $("#trash").click(function(){
        //clear all selections
        holding = false;
        holder = undefined;
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
                //change them into facedown
                var card = reveal.shift();
                cards[card].show = false;
                //shift back
                trash.push(card);
            }
            render();
        }
    });
    
    //moving the cards
    function cardClickF(){
        //clicking cards at reveal
        //clicking cards at field
        $(".card").click(function(){
            var card = cards[parseInt($(this).attr("id"))];
            console.log(card);
            function mainDish(){
                //check if card is face up
                if (card.show === true){
                    //release a card if holding a card
                    if (holding === true){
                        //check if holding the same card
                        if (card === holder){
                            //if so remove holding status
                            holder = undefined;
                            holding = false;
                            return;
                        }
                        //check if releasing onto the right card
                        //check if clicked card is not on trash and foundation
                        if (card.inTrash() === false && card.inFound === false){
                            //then check if able to move
                            if (holder.isDiffColor(card) && holder.isOneLower(card)){
                                //if holder is on the field
                                if (holder.inTrash() === false){
                                    //if so then move the the holder and cards under holder under the card
                                    //put all cards under the holder into a list
                                    var list = [];
                                    for (var i = holder.row; i <= 17; i ++){
                                        var cardBelow = getCardPos(holder.column, i);
                                        if (cardBelow !== undefined){
                                            list.push(cardBelow);
                                        } else {
                                            break;
                                        }
                                    }
                                    //after the list has been filled(or not) move them under the (clicked)card
                                    //store the list length first
                                    var listLength = list.length;
                                    //iterate the list
                                    for (var i = 0; i < listLength; i ++){
                                        //set column same as the card
                                        list[i].column = card.column;
                                        //set row below the card in a fast way
                                        list[i].row = card.row + i + 1;
                                    }
                                } else {
                                    //if in trash then move directly to field
                                    holder.column = card.column;
                                    holder.row = card.row + 1;
                                    //also remove holder in reveal pile
                                    duang(reveal, holder.name);
                                }
                                //remove holding status
                                holding = false;
                                holder = undefined;
                                //and that's it
                                return;
                            }
                        }
                    }
                    //take up a card if holding nothing
                    if (holding === false){
                        holding = true;
                        holder = card;
                        return;
                    }
                }
            }
            //just add a function to use return
            mainDish();
            
            render();
        });
    }
    
    //move card to empty space (Kings only btw)
    $(".bottom").click(function(){
        var column = $(this).attr("id")[1];
        //check if holding a card and is a king
        if (holding === true){
            if (holder.number === 13){
                //check if column is empty
                if (columnHeight(column) === 0){
                    //if it's empty then move the whole thing under it
                    //gathering list(done by c & p)
                    var list = [];
                    for (var i = holder.row; i <= 17; i ++){
                        var cardBelow = getCardPos(holder.column, i);
                        if (cardBelow !== undefined){
                            list.push(cardBelow);
                        } else {
                            break;
                        }
                    }
                    //move them under the column
                    for (var i = 0; i < list.length; i ++){
                        list[i].column = parseInt(column);
                        list[i].row = i + 1;
                    }
                    //remove holding status
                    holder = undefined;
                    holding = false;
                    render();
                }
            }
        }
    });
    
    
    
    
    
    
    
});