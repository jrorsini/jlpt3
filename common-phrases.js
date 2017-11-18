
commonPhrases = localstorageSetUp('common-phrases',commonPhrases)
stats = localstorageSetUp('common-phrases-stats',stats)	
localstorageUpdate()
current.createQuestionId()
current.fillInView()
view.showQuestion()
view.showRepetitions()


/**
 * Displays sentence and add sentence in the occurred array
 */
function showQuestion() {

	let applicableElement = $('#sentence');

	applicableElement.html(`
		<span>${view.english}</span><input type="text" id="option" class="commonPhrasesInput" onkeyup="checkAnswer(event)">
	`)
	wanakana.bind($('#sentence')[0]);	
	$('#option').focus()	
}

let current = {
	occured:[],	
	/**
	 * create id for the question and checks if it's already in there
	 */
	createQuestionId: function() {

		var objectLen = Object.keys(commonPhrases).length - 1,
			id = Math.floor( Math.random() * objectLen ) + 1

		while(this.occured.indexOf(id) !== -1) {

			id = Math.floor( Math.random() * objectLen ) + 1
		}

		this.occured.push(id)

		if (this.occured.length === objectLen) {

			this.occured = []
		}
		return id
	},
	/**
	 * Updates the current object.
	 */
	fillInView: function() {
		
		let id = this.createQuestionId()
		view.english = commonPhrases[id].english,
		view.japanese = commonPhrases[id].japanese,
		view.romaji = commonPhrases[id].romaji
	}
}

let view = {
	userStats: {right: 0, wrong:0},
	/**
	 * Updates the repetition stats
	 */
	showRepetitions: function() {

		let repetitions = this.userStats.right + this.userStats.wrong,
			percentage = repetitions === 0 ? 0 : Math.round(this.userStats.right / repetitions * 100)

		$('#repetition').html(` ${repetitions}`)
		$('#success').html(` ${this.userStats.right}`)
		$('#failure').html(` ${this.userStats.wrong}`)
		$('#percentage').html(` ${percentage}%`)
	},
	/**
	 * Reset Repetitions to 0
	 */
	resetRepetitions: function() {
		console.log('test')
		this.userStats.right = 0
		this.userStats.fail = 0
		this.showRepetitions()
	},
	/**
	 * Attaches a function to an element
	 */
	attachEvent: function(element, type, func) {
		element.addEventListener(type, func)
	},
	/**
	 * Updates question's grasp level
	 */
	updateGraspLevel: function () {
	
		if ($('.sentence')[0].classList.length > 1) {
	
			$('.sentence').removeClass( $('.sentence')[0].classList[1] );
		}
	
		$('.sentence').addClass(`grasp--${this.graspLevel}`);
	},
	
};

var 
	// Collects ids that have been already shown.
	occured = [],
	// To retrieve the user input value.
	inputEl = $('#option')[0],
	// Question's length
	len = Object.keys(commonPhrases).length,
	// Stat's object
	stats = {
		success:0,
		fail:0
	}

function isNew() {
	console.log(curr)
	if(curr.stats.length !== undefined) {
		$('#new_icon').html('')
	} else {
		$('#new_icon').html('star_border')
	}
}

/**
 * Checks if the user's input match with the answer
 */
function checkAnswer(e) { // Checks input value to the answer.

	var answer = view.romaji.map(e => {
		e = e.split(''), e.pop()
		return wanakana.toHiragana(e.join('').replace(/\swa[\s\,]/g,' ha ').replace(/\so[\s\,]/g,' wo ').replace(/\s/g,''))
	})
	var inputVal = $('#option')[0].value

	if(e.keyCode === 13) {
		console.log(answer)
		console.log(view.japanese)
		console.log()
		if(answer.indexOf(inputVal) !== -1) {
			console.log('Right Answer')
			current.createQuestionId()
			current.fillInView()
			view.showQuestion()
			$('#tempAnswer').text('?')
		} else {
			$('#tempAnswer').text(view.japanese.join(' / '))
			console.log('Wrong Answer')
		}
	}
}



/**
 * Check if the answer matches a grammatical point.
 * And returns it
 */
function match_grammar_point() {
	var match_len = 0, grammar_point;

	for (var i = 0; i < jlpt3_grammar_list.length; i++) {

		var re = RegExp(jlpt3_grammar_list[i][0],'g')

		if(view.answer.match(re)!==null && view.answer.match(re).length > match_len){

			match_len = view.answer.match(re).length
			grammar_point = jlpt3_grammar_list[i]
		}
	}

	return match_len > 0 ? grammar_point : false
}

/**
 * Sets status and questions into localstorage.
 */
function localstorageSetUp(name, object) {

	if(localStorage.getItem(name) === null) {

		localStorage.setItem(name, JSON.stringify(object))
	} 

	return JSON.parse( localStorage.getItem(name) )
}

/**
 * localstorageUpdate() Set the the updated data set version to localstorage
 */
function localstorageUpdate() {

	localStorage.setItem( 'common-phrases', JSON.stringify(commonPhrases) )
	localStorage.setItem( 'common-phrases-stats', JSON.stringify(stats) )
	
	commonPhrases = localstorageSetUp('common-phrases',commonPhrases)
	stats = localstorageSetUp('common-phrases-stats',stats)	
}

// Set input field to Hiragana characters


// view.attachEvent($('#repResetIcon')[0],'click',view.resetRepetitions)
