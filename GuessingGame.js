function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}


Game.prototype.playersGuessSubmission = function(num){
    if (isNaN(num) || num<1 || num>100){
        throw "That is an invalid guess."
    } else{
         this.playersGuess = num;
         return this.checkGuess();
    }
};

Game.prototype.checkGuess = function(){
    if (this.pastGuesses.indexOf(this.playersGuess) !== -1){
        $('#pretitle').text("Oops...");
        $('#title').text('You already guessed that one, silly!');
        $('#subtitle').text("Guess again-- a different number this time!");
        return "You have already guessed that number."
    } else if (this.playersGuess===this.winningNumber){
        $('#hintOutput').hide();
        $('#pretitle').text("Yes! You got it!");
        $('#title').text(this.playersGuess + " is correct. You WIN!");
        $('#subtitle').text("Press reset to play again!");
        //TURN OFF SUBMIT AND HINT:
        $('#hint, #submit').prop("disabled",true);
        return this.playersGuess + " is correct! You WIN!";
    } else {
        //ADD GUESS TO GUESSES UL:
        $('#guesses-list li:nth-child('+ (this.pastGuesses.length + 1) +')').text(this.playersGuess);
        $('#title').text('The Guessing Game!');
        this.pastGuesses.push(this.playersGuess);
        if (this.pastGuesses.length>4){
            $('#pretitle').text("Oh no! All out of guesses!");
            $('#title').text("You Lose.");
            $('#subtitle').text("Aw, shucks... Turns out the answer was " +this.winningNumber+ "! But that's okay-- just press reset to try again!");
            //TURN OFF SUBMIT AND HINT:
            $('#hint, #submit').prop("disabled",true);
            return "You Lose.";
        } else {
            $('#pretitle').text("Not quite...");
            if (this.isLower()){
                $('#subtitle').text("Try guessing higher!");
            } else {
                $('#subtitle').text("Try guessing lower!");
            }
            var difference = this.difference();
            if (difference < 10) {
                $('#title').text("You\'re getting so close you\'re burning up!");
                return "You\'re burning up!";
            }
            else if (difference < 25) {
                $('#title').text("You\'re getting lukewarm!");
                return "You\'re lukewarm.";
            }
            else if (difference < 50) {
                $('#title').text("You\'re a bit chilly!");
                return "You\'re a bit chilly.";
            }
            else {
                $('#pretitle').text("Not even close...");
                $('#title').text("You\'re ice cold!");
                return "You\'re ice cold!";
            }
        }
    }
};

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess-this.winningNumber);
};

Game.prototype.isLower = function(){
    return this.playersGuess<this.winningNumber;
};

Game.prototype.provideHint = function(){
    var hintArray = [this.winningNumber, generateWinningNumber(),generateWinningNumber(),generateWinningNumber(),generateWinningNumber(),generateWinningNumber()];
    return shuffle(hintArray);
};


function generateWinningNumber(){
    return Math.floor((Math.random() * 100) + 1);
}

function newGame(){
    return new Game();
}

function shuffle(array){
    //The fisher-yates shuffle algorithm
    var m = array.length;
    // While there remain elements to shuffle…
    while (m) {
    // Pick a remaining element…
        var i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        var t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

// EXTRA JQUERY:

$(document).ready(function(){
    var game = newGame();
    var guess;
    var clickedSubmit = function(){
        guess = $('#player-input').val();
        $('#player-input').val("");
        var output = game.playersGuessSubmission(parseInt(guess,10));
        console.log(output);
    };

    $('#submit').on('click',clickedSubmit);
    $(document).keypress(function(e) {      
        if(e.which == 13 && ($('#submit').is('[disabled]') === false)) {    // or thru JS: if(e.which == 13 && !document.getElementById('submit').hasAttribute('disabled'))
          clickedSubmit(game);  
        }
    });

    $('#hint').click(function(){
        //GIVE HINT
        var hint = game.provideHint();
        $('#hintOutput').show();
        $('#hintOutput').text("Hmm... I could've sworn I heard the fates whispering earlier about the numbers " + hint[0] + ", " + hint[1] + ", " + hint[2] + ", " + hint[3] + ", " + hint[4] + ", and " + hint[5]+ "...");
            console.log("give hint");
        $('#hint').prop('disabled', true);
    });
    
    $('#reset').on('click',function(){
        game = newGame();
        $('#submit, #hint').removeAttr('disabled');
        $('#pretitle').text("Come right up and play...");
        $('#title').text('The Guessing Game!');
        $('#subtitle').text("Go ahead: Try guessing a number between 1-100");
        $('.guess').text('');
        $('#hintOutput').hide();
        console.log("reset");
    });

    

});



