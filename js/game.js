// Memory Game
// © 2014 Nate Wiley
// License -- MIT
// best in full screen, works on phones/tablets (min height for game is 500px..) enjoy ;)
// Follow me on Codepen

(function(){
	
	var Memory = {

		init: function(backgroundCard, cards){
			this.$backgroundCard = backgroundCard;
			this.$game = $(".game");
			this.$modal = $(".modal");
			this.$overlay = $(".modal-overlay");
			this.$restartButton = $("button.restart");
			this.$copyCards = JSON.parse(JSON.stringify(cards));
			this.modifyCards(cards);
			this.cardsArray = $.merge(cards, this.$copyCards);
			this.shuffleCards(this.cardsArray);
			this.setup();
		},

		modifyCards: function(cardsArray){
			for (var i in cardsArray) {
				delete cardsArray[i]["img2"];
			};
		},

		shuffleCards: function(cardsArray){
			this.$cards = $(this.shuffle(this.cardsArray));
		},

		setup: function(){
			this.html = this.buildHTML();
			this.$game.html(this.html);
			this.$memoryCards = $(".card");
			this.paused = false;
     		this.guess = null;
			this.binding();
		},

		binding: function(){
			this.$memoryCards.on("click", this.cardClicked);
			this.$restartButton.on("click", $.proxy(this.reset, this));
		},
		// kinda messy but hey
		cardClicked: function(){
			// https://www.soundjay.com
			
			var flipSound = document.getElementById("click");
			setTimeout(function(){
				flipSound.play();
			} , 350);
			var sound = null;
			var _ = Memory;
			var $card = $(this);
			var guessId = $(_.guess).attr("data-id");
			if(!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
				$card.find(".inside").addClass("picked");
				// $card.addClass("picked");
				if(!_.guess){
					_.guess = this;
				} else if(guessId == $(this).attr("data-id") && !$(this).hasClass("picked")){
					$(".picked").addClass("matched");
					_.guess = null;
					sound = document.getElementById("match");
				} else {
					sound = document.getElementById("no_match");
					_.paused = true;
					setTimeout(function(){
						$card.find(".inside").removeClass("picked");
						$(_.guess).find(".inside").removeClass("picked");
						Memory.paused = false;
						Memory.guess = null;
					}, 600);
				}
				if (sound != null)	sound.play();
				if($(".matched").length == $(".card").length){
					sound = document.getElementById("finished");
					sound.play();
					_.win();
				}
			}
		},

		win: function(){
			this.paused = true;
			setTimeout(function(){
				Memory.showModal();
				Memory.$game.fadeOut();
			}, 1000);
		},

		showModal: function(){
			this.$overlay.show();
			this.$modal.fadeIn("slow");
		},

		hideModal: function(){
			this.$overlay.hide();
			this.$modal.hide();
		},

		reset: function(){
			this.hideModal();
			this.shuffleCards(this.cardsArray);
			this.setup();
			this.$game.show("slow");
		},

		// Fisher--Yates Algorithm -- https://bost.ocks.org/mike/shuffle/
		shuffle: function(array){
			var counter = array.length, temp, index;
			// While there are elements in the array
			while (counter > 0) {
				// Pick a random index
				index = Math.floor(Math.random() * counter);
				// Decrease counter by 1
				counter--;
				// And swap the last element with it
				temp = array[counter];
				array[counter] = array[index];
				array[index] = temp;
				}
				return array;
		},

		buildHTML: function(){

			var items = [];
			this.$cards.each(function(k, v){
				items.push(v);
			});
			var frag = '';
			var elementIndex = 0;
			var img = '';
			for (i = 0; i < items.length; i++){
				var v = items[elementIndex];
				elementIndex++;
				img = v.img;
				if(v.hasOwnProperty('img2')){
					img = v.img2
				}
				frag += '<div class="card" data-id="'+ v.id +'">\
					<div class="inside">\
						<div class="front">\
							<img src="'+ img +'" alt="'+ v.name +'" />\
						</div>\
						<div class="back">\
							<img src="'+this.$backgroundCard+'"	alt="" />\
						</div>\
					</div>\
				</div>';
			}
			return frag;
		}
	};

	// $.getJSON("config.json", function(json) {
	
	(function() {

		var json = JSON.parse(gameConfig)
		var rows = json.rows;
		var columns = json.columns;
		
		var background = json.background;
		if (background) {
			$('body').css("background-image", "url(" + background + ")");
		}

		var wrapDiv = $('.wrap');

		var backgroundCard = json.backgroundCard;

		var winnerColor = json.winnerColor;

		var styleBackCard = document.createElement('style');
		styleBackCard.type = 'text/css';


		var backModalWinner = json.backModalWinner;
		$('.modal').css("background-image", "url(" + backModalWinner + ")");

		var titleModalWinner = json.titleModalWinner;
		$('.modal .winner').html(titleModalWinner);

		var textBtnModalWinner = json.textBtnModalWinner;
		var backBtnModalWinner = json.backBtnModalWinner;
		var btnRestart = $('.modal .restart');
		btnRestart.html(textBtnModalWinner);
		btnRestart.css("background", backBtnModalWinner);

		var cards = json.cards;
		var count = 0;
		for(var prop in cards) {
			if(cards.hasOwnProperty(prop)) ++count;
		}
		// if (rows * columns != cards.length * 2 || rows > columns){
		if (rows * columns != cards.length * 2 ){
			window.alert("Invalid Grid Size");
			return;
		}
		Memory.init(backgroundCard, cards);

		var body = $('body');
		var bodyWidth = body.width();
		var bodyHeight = body.height();
		
		var cardHeight = bodyHeight / rows;
		$('.card').css("height", cardHeight);

		var cardWidth = cardHeight * 0.75;
		$('.card').css("width", cardWidth);

		var requiredWidth = (cardWidth * columns) + 1;

		if (requiredWidth > bodyWidth + 50){

			cardWidth = bodyWidth / columns;
			$('.card').css("width", cardWidth);
			
			cardHeight = cardWidth * 1.33;
			$('.card').css("height", cardHeight);
			
			requiredWidth = (cardWidth * columns) + 1;

			var topPadding = (bodyHeight - (cardHeight * rows)) / 2;
			$('.wrap').css("padding-top", topPadding)

		}
		
		wrapDiv.css("margin-left", 'auto');
		wrapDiv.css("margin-right", 'auto');
		var newWidth = requiredWidth;
		wrapDiv.css("width", `${newWidth}`);

	})();
    
})();