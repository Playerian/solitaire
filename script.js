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
    var holding = false;
    var holder;
    var found = {
        f1: [],
        f2: [],
        f3: [],
        f4: []
    };
    var height = 120;
    var width = 88;
    var showPercentOfCard = 25;
    var timer;
    var time = 0;
    var beginned = false;
    var preventer = false;
    //cardname,action,from,to
    /*action list:
    move found trash
    */
    var lastAct = "";
    
    //misc functions
    function duang(thing, string){
        if (thing.includes(string)){
            thing.splice(thing.indexOf(string),1);
        }
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
        this.inFound = function(){
            for (var i = 1; i <= 4; i ++){
                if (found["f"+i].includes(this)){
                    return true;
                }
            }
            return false;
        };
        this.foundNo = function(){
            if (this.inFound() === true){
                for (var i = 1; i <= 4; i ++){
                    if (found["f"+i].includes(this)){
                        return i;
                    }
                }
            } else{
                return undefined;
            }
        };
        this.zAxis = 0;
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
        //check if this card is 1 number higher
        this.isOneHigher = function(card){
            if (this.number - 1 === card.number){
                return true;
            }
            return false;
        };
        //reset pos(change position to 0, 0, also remove from reveal and trash and foundation)
        this.reset = function(){
            this.row = 0;
            this.column = 0;
            if (this.inTrash() === true){
                duang(trash, this.name);
                duang(reveal, this.name);
            }
            if (this.inFound() === true){
                duang(found["f"+this.foundNo()], this);
            }
        };
        //get the whole column of cards of this card's column
        this.getColumn = function(){
            if (this.column === 0){
                return 0;
            } else {
                //get all cards of this column
                var columnCards = [];
                for (var i = 1; i <= 52; i ++){
                    var card = cards[i];
                    if (parseInt(card.column) === parseInt(this.column)){
                        columnCards.push(card);
                    }
                }
                //sort them by their row
                var output = [];
                var breaker = 0;
                while (columnCards.length > 0){
                    breaker ++;
                    if (breaker >= 100){
                        console.log("exceed maximum loop");
                        break;
                    }
                    for (var i = 0; i < columnCards.length; i ++){
                        if (columnCards[i].row === 1){
                            output.push(columnCards[i]);
                            columnCards.splice(parseInt(i), 1);
                        }
                        if (output.length > 0 && output[output.length - 1] !== undefined){
                            if (columnCards.length > 0 && columnCards[i] !== undefined){
                                if ( parseInt(columnCards[i].row - 1) === parseInt(output[output.length - 1].row) ){
                                    output.push(columnCards[i]);
                                    columnCards.splice(parseInt(i), 1);
                                }
                            }
                        }
                    }
                }
                //return output
                return output;
            }
        };
        //check if this card is below holding 
        this.isBelowHolder = function(){
            if (holding === true){
                //get holder's column and check if columns are the same 
                var column = holder.column;
                if (column === this.column){
                    //if so check if this card is below holder
                    if (holder.row < this.row){
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            return undefined;
        };
    }
    
    function getCard(num, suit){
        return cards[(num - 1) * 4 + suit];
    }
    
    function getCardPos(column, row){
        for (var i = 1; i <= 52; i ++){
            if (cards[i].row === row && cards[i].inTrash() === false && cards[i].inFound() === false){
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
    
    //init function
    function init(){
        cards = {};
        trash = [];
        found = {
        f1: [],
        f2: [],
        f3: [],
        f4: []};
        reveal = [];
        holder = undefined;
        holding = false;
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
        console.log("original deck: "+deck.length);
        
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
        console.log("placed to field: "+deck.length);
        //place cards to trash
        var deckLength = deck.length;
        for (var i = 0; i < deckLength; i ++){
            var card = deck[randomInt(0, deck.length - 1)];
            duang(deck, card);
            trash.push(card);
        }
        console.log("placed to trash: "+deck.length);
        //hides preload docs
        $(".preload").hide();
        
        //render up
        render();
        
        //reset timer
        time = 0;
        $("#timer").text("00:00");
        
        //only once
        if (beginned === false){
            beginned = true;
            setInterval(function(){
                window.cards = cards;
                window.render = render;
                window.trash = trash;
                window.reveal = reveal;
                window.holding = holding;
                window.holder = holder;
                window.found = found;
                window.lastAct = lastAct;
                //function
                window.duang = duang;
                window.columnHeight = columnHeight;
                window.getCardPos = getCardPos;
            }, 2000);
            timer = setInterval(function(){
                time ++;
                var second = time;
                var minute = 0;
                while (second >= 60){
                    second -= 60;
                    minute ++;
                }
                minute = minute.toString(10);
                second = second.toString(10);
                while (minute.length < 2){
                    minute = "0" + minute;
                }
                while (second.length < 2){
                    second = "0" + second;
                }
                $("#timer").text(minute+":"+second);
            }, 1000);
        }
        
        //end of init
    }
    
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
                    //add height to each cards
                    element.css("top", (i2 - 1) * (100 - showPercentOfCard) / 100 * height * -1+"px");
                    //add z-axis to each cards
                    element.css("z-index", i);
                    //add highlight if holder is same 
                    if (holder === card){
                        //check if holder is last card
                        if (holder.getColumn()[holder.getColumn().length - 1] === holder){
                            element.addClass("highlightLoner");
                        } else {
                            element.addClass("highlight");
                        }
                    }
                    //add midlight if below holder
                    //add lowlight if last below holder
                    if (card.isBelowHolder() === true){
                        if (card.getColumn()[card.getColumn().length - 1] === card){
                            element.addClass("lowlight");
                        } else {
                            element.addClass("midlight");
                        }
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
            element.attr("src", "cards/" + card.number + "_" + card.suit + ".png");
            if (holder === card){
                element.addClass("highlight");
            }
            $("#reveal").append(element);
        }
        //render in foundation
        for (var i2 = 1; i2 <= 4; i2 ++){
            var foundation = found["f"+i2];
            for (var i = 0; i < foundation.length; i ++){
                var card = foundation[i];
                var element = $("<img>").attr("class","card");
                element.attr("id", foundation[i].name);
                element.addClass("foundCard");
                element.addClass("unclickable");
                element.attr("src", "cards/" + card.number + "_" + card.suit + ".png");
                if (holder === card){
                    element.addClass("highlight");
                }
                $("#f"+i2).append(element);
            }
        }
        
        //add click handlers onto all the cards
        cardClickF();
        
        //render stuff outside the game
        $(".card, .top, .bottom").css("width", width+"px");
        $(".card, .top, .bottom").css("height", height+"px");
    }
    
    //open the trash
    $("#trash").click(function(){
        //record move
        lastAct = "undefined,trash,undefined,undefined";
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
        //clicking cards at field
        $(".card").click(function(){
            var card = cards[parseInt($(this).attr("id"))];
            console.log(card);
            //main function (just for quick use of return)
            function mainDish(){
                //check if card is face up
                if (card.show === true){
                    //release a card if holding a card
                    if (holding === true){
                        //check if holding the same card
                        if (card === holder){
                            //check if can move to foundation
                            for (var i = 4; i >= 1; i --){
                                var foundation = found["f"+i];
                                //check if not empty
                                if (foundation.length > 0){
                                    //get last card in foundation
                                    var last = foundation[foundation.length - 1];
                                    if (holder.isOneHigher(last)){
                                        //then check if suits are the same
                                        if (holder.suit === last.suit){
                                            //then check if the holder card is the last card at the column
                                            //or in trash
                                            if (getCardPos(holder.column, holder.row + 1) === undefined || holder.inTrash() === true){
                                                //record action
                                                if (holder.inTrash() === true){
                                                    lastAct = holder.name + "," + "found" + "," + "trash" +"," + number;
                                                } else {
                                                    lastAct = holder.name + "," + "found" + "," + "C"+holder.column + "R"+holder.row + "," + number;
                                                }
                                                //reset the card's position
                                                holder.reset();
                                                //then move holder to the foundation
                                                foundation.push(holder);
                                            }
                                        }
                                    }
                                } else{
                                    //if not empty
                                    //if ace push to found
                                    if (card.number === 1){
                                        //record action
                                        if (holder.inTrash() === true){
                                            lastAct = holder.name + "," + "found" + "," + "trash" +"," + number;
                                        } else {
                                            lastAct = holder.name + "," + "found" + "," + "C"+holder.column + "R"+holder.row + "," + number;
                                        }
                                        //reset the card's position
                                        holder.reset();
                                        //then move holder to the foundation
                                        foundation.push(holder);
                                    }
                                }
                            }
                            //remove holding status
                            holder = undefined;
                            holding = false;
                            return;
                        }
                        //check if releasing onto the right card
                        //check if clicked card is not on trash and foundation
                        if (card.inTrash() === false && card.inFound() === false){
                            //then check if able to move
                            if (holder.isDiffColor(card) && holder.isOneLower(card) && card.getColumn()[card.getColumn().length - 1] === card){
                                //if holder is on the field
                                if (holder.inTrash() === false && holder.inFound() === false){
                                    var row = holder.row;
                                    var column = holder.column;
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
                                    //record moving act
                                    lastAct = holder.name + "," + "move" + "," + "C" + column + "R" + row + "," + "C" + holder.column + "R" + holder.row;
                                } else {
                                    //if in trash then move directly to field
                                    if (holder.inTrash() === true){
                                        holder.column = card.column;
                                        holder.row = card.row + 1;
                                        //also remove holder in reveal pile
                                        duang(reveal, holder.name);
                                        //record moving act
                                        lastAct = holder.name + "," + "move" + "," + "trash" + "," + "C" + holder.column + "R" + holder.row;
                                    }
                                    //if in foundation then remove foundation status
                                    if (holder.inFound() === true){
                                        var number = found["f"+holder.foundNo()];
                                        holder.column = card.column;
                                        holder.row = card.row + 1;
                                        //same as trash
                                        duang(number, holder);
                                        //record moving act
                                        lastAct = holder.name + "," + "move" + "," + holder.foundNo() + "," + "C" + holder.column + "R" + holder.row;
                                    }
                                }
                                //remove holding status
                                holding = false;
                                holder = undefined;
                                //and that's it
                                return;
                            }
                        }
                        
                        
                        
                        //end of if holding
                    }
                    //take up a card if holding nothing
                    if (holding === false){
                        holding = true;
                        holder = card;
                        return;
                    }
                    //end of if card is face up
                }
            };
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
            var row = holder.row;
            if (holder.number === 13){
                //check if column is empty
                if (columnHeight(column) === 0){
                    //if it's empty then move the whole thing under it
                    //gathering list(done by c & p)
                    var list = [];
                    list.push(holder);
                    for (var i = holder.row + 1; i <= 17; i ++){
                        var cardBelow = getCardPos(holder.column, i);
                        if (cardBelow !== undefined){
                            list.push(cardBelow);
                        } else {
                            break;
                        }
                    }
                    //move them under the column
                    for (var i = 0; i < list.length; i ++){
                        //move to correct place
                        list[i].column = parseInt(column);
                        list[i].row = i + 1;
                    }
                    if (holder.inTrash() === true){
                        lastAct = holder.name + "," + "move" + "," + "trash" + "," + "C" + holder.column + "R" + holder.row;
                    } else if (holder.inFound() === true) {
                        lastAct = holder.name + "," + "move" + "," + "found" + "," + "C" + holder.column + "R" + holder.row;
                    } else {
                        lastAct = holder.name + "," + "move" + "," + "C" + column + "R" + row + "," + "C" + holder.column + "R" + holder.row;
                    }
                    //if holder is in trash, remove from trash(or reveal)
                    if (holder.inTrash() === true){
                        duang(reveal, holder.name);
                    }
                    //if holder is in foundation, then the player is dumb
                    if (holder.inFound() === true){
                        duang(found["f"+holder.foundNo()], holder);
                    }
                    //remove holding status
                    holder = undefined;
                    holding = false;
                    render();
                }
            }
        }
    });
    
    //when top row is clicked
    $(".top").click(function(){
        //move cards to foundation
        var number = parseInt($(this).attr("id")[1]);
        //check if it's a number
        if (!isNaN(number)){
            //if so then the player clicks the foundation (which is an array)
            var foundation = found["f"+number];
            //check if holding a card
            if (holding === true){
                //check if holding card is in foundation
                if (holder.inFound() === true){
                    //wat wat wat wat wat wat wat
                    holding = false;
                    holder = undefined;
                    render();
                    return;
                }
                //check if foundation is empty
                if (foundation.length === 0){
                    //check if the card holding is an ace
                    if (parseInt(holder.number) === 1){
                        //record action
                        if (holder.inTrash() === true){
                             lastAct = holder.name + "," + "found" + "," + "trash" +"," + number;
                        } else {
                            lastAct = holder.name + "," + "found" + "," + "C"+holder.column + "R"+holder.row + "," + number;
                        }
                        //reset the card's position
                        holder.reset();
                        //then move the card to foundation
                        foundation.push(holder);
                        //remove holding status
                        holding = false;
                        holder = undefined;
                        render();
                    }
                } else {
                    var last = foundation[foundation.length - 1];
                    //else check if the card that is holding is one more number than the last card in foundation
                    if (holder.isOneHigher(last)){
                        //then check if suits are the same
                        if (holder.suit === last.suit){
                            //then check if the holder card is the last card at the column
                            if (getCardPos(holder.column, holder.row + 1) === undefined){
                                //record action
                                if (holder.inTrash() === true){
                                    lastAct = holder.name + "," + "found" + "," + "trash" +"," + number;
                                } else {
                                    lastAct = holder.name + "," + "found" + "," + "C"+holder.column + "R"+holder.row + "," + number;
                                }
                                //reset the card's position
                                holder.reset();
                                //then move holder to the foundation
                                foundation.push(holder);
                                //remove holding status
                                holding = false;
                                holder = undefined;
                                render();
                            }
                        }
                    }
                }
            } else {
            //if not holding a card then check if any card is on foundation
                if (foundation.length > 0){
                    //if so hold the last card in the foundation
                    var card = foundation[foundation.length - 1];
                    holding = true
                    holder = card;
                    render();
                }
            }
        }
        
    });
    
    //takeback!
    $("#tb").click(function(){
        console.log(lastAct);
        if (lastAct !== undefined){
            var code = lastAct.split(",");
            console.log(code);
            var name = code[0];
            var action = code[1];
            var prev = code[2];
            var next = code[3];
            //move action
            if (action === "move"){
                //aka move from anywhere to field
                //from trash or found
                if (prev === "trash" || prev.length === 1){
                    //reset card
                    cards[name].reset();
                    //then push back to reveal
                    if (prev === "trash"){
                        reveal.push(parseInt(name));
                    } else {
                        //push back to foundation
                        found["f"+prev].push(parseInt(name));
                    }
                    lastAct = undefined;
                }
                //from field
                if (prev.length > 1){
                    //get previous location
                    var cPos = prev.indexOf("C");
                    var rPos = prev.indexOf("R");
                    //get the card's column
                    var columnCards = cards[name].getColumn();
                    var descend = [];
                    //loop through the columns starting from the moved card
                    for (var i = cards[name].row; i <= columnCards.length; i ++){
                        //push any cards below the worked card to the array
                        descend.push(columnCards[i - 1]);
                    }
                    console.log("descend: "+descend);
                    //send all cards back in time
                    var targetRow = parseInt(prev.substring(cPos + 1, rPos));
                    var targetColumn = parseInt(prev.substring(rPos + 1));
                    for (var i = targetRow; i < targetRow + descend.length; i ++){
                        descend[i - targetRow].column = targetColumn;
                        descend[i - targetRow].row = i;
                    }
                    console.log("getting pos");
                    console.log(getCardPos(cards[name].column, cards[name].row - 1));
                    //cover up the exposed card
                    if (getCardPos(cards[name].column, cards[name].row - 1) !== undefined){
                        getCardPos(cards[name].column, cards[name].row - 1).show = false;
                    }
                    lastAct = undefined;
                }
            }
            //trash action
            if (action === "trash"){
                //aka when trash is clicked
                trash.unshift(reveal.pop());
                lastAct = undefined;
            }
            //found action
            if (action === "found"){
                //aka move from anywhere to found
                //if prev loaction is trash
                if (prev === "trash"){
                    //reset card
                    cards[name].reset();
                    //then push back to reveal
                    reveal.push(parseInt(name));
                    lastAct = undefined;
                } else {
                    //reset card
                    cards[name].reset();
                    //set to previous location
                    var cPos = prev.indexOf("C");
                    var rPos = prev.indexOf("R");
                    cards[name].column = parseInt(prev.substring(cPos + 1, rPos));
                    cards[name].row = parseInt(prev.substring(rPos + 1));
                    lastAct = undefined;
                }
            }
        }
        //render stuff
        render();
    });
    
    //when input changes
    $("#showPercent").on("input", function(e) {
        showPercentOfCard = parseInt($("#showPercent").val());
        render();
    });
    
    //start the game
    $("#start").click(function(){
        init();
    });
    
    
    
    
});
