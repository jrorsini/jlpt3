var test = {
	value: "Hello",
	getValue: function() {
		return this.value
	}
}

console.log(test.getValue)

let current = {
	occured:[],	
	question: null,
	options: null,
	stats: null,
	userInput: null,
	lvl: null,
	answer: null,
	/**
	 * create id for the question and checks if it's already in there
	 */
	createQuestionId: function(fillInFunc) {
		var objectLen = Object.keys(jlpt3).length,
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
	fillIn: function() {
		let id = this.createQuestionId()
		view.question = jlpt3[id].question,
		view.options = jlpt3[id].options,
		view.stats = jlpt3[id].stats,
		view.userInput = jlpt3[id].user_input,
		view.graspLevel = jlpt3[id].grasp_level,
		view.answer = jlpt3[id].options.map(e => ( e[1] === true) ? e[0] : '').join('')
	}	
}

let view = {
	userStats: {right: 0, wrong:0},
	/**
	 * Displays sentence and add sentence in the occurred array
	 */
	showQuestion: function() {

		let applicableElement = $('#sentence');

		applicableElement.html(`<span>${this.question[0]}</span><input type="text" id="option" onkeyup="checkAnswer(event)"><span>${this.question[1]}</span>`)
	},

	/**
	 * Sets the 'options' variable and displays options 
	 */
	showOptions: function() {
		$('.assignment').html(`<u>Choose between</u><br><b>${this.options.map(e => e[0]).join('</b> - <b>')}</b>`)
	},
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
		this.userStats.right = 0
		this.userStats.fail = 0
		this.showRepetitions()
	},
	/**
	 * Attaches a function to an element
	 */
	attachEvent: function(element, type, func) {
		element.addEventListener(type, func)
	}
};

var 
	// Collects ids that have been already shown.
	occured = [],
	// To retrieve the user input value.
	inputEl = $('#option')[0],
	// Question's length
	len = Object.keys(jlpt3).length,
	// Stat's object
	stats = {
		success:0,
		fail:0
	}

// Current question's object
var curr = {}

/**
 * Displays sentence and add sentence in the occurred array
 */

// function showQuestion() {
// 	updateCurrent()
// 	if(occured.length < len) {

// 		if(occured.indexOf(curr.id) === -1) {

// 			occured.push(curr.id)
// 			$('#sentence').html(`<span>${curr.question[0]}</span><input type="text" id="option" onkeyup="checkAnswer(event)"><span>${curr.question[1]}</span>`)
// 			showOptions()
// 			updateGraspLevel()
// 		} else {

// 			updateCurrent()
// 			showQuestion()
// 		}
// 	} else {

// 		occured = [] // Empty object.
// 		updateCurrent()
// 		showQuestion()
// 	}
// 	wanakana.bind($('#option')[0]);
// 	$('#option')[0].focus()
// }

/**
 * Sets the 'options' variable and displays options 
 */
// function showOptions() {
// 	$('.assignment').html(`<u>Choose between</u><br><b>${curr.options.map(e => e[0]).join('</b> - <b>')}</b>`)
// }


function isNew() {
	console.log(curr)
	if(curr.stats.length !== undefined) {
		$('#new_icon').html('')
	} else {
		$('#new_icon').html('star_border')
	}
}

/**
 * returns a random id for the questions
 */
// function createQuestionId() {
// 	return Math.floor( Math.random() * Object.keys(jlpt3).length ) + 1
// }

/**
 * Checks if the user's input match with the answer
 */
function checkAnswer(e, inputVal = $('#option')[0].value) { // Checks input value to the answer.		
	if(e.keyCode === 13 && optionMatch(inputVal)) {

		if(inputVal !== curr.answer) {
			stats.fail++			
			if(jlpt3[curr.id].user_input[inputVal]) {

				jlpt3[curr.id].user_input[inputVal]++
				jlpt3[curr.id].stats.fail++

				if(jlpt3[curr.id].user_input[inputVal] > 2) {

					Materialize.toast(
						`You made that mistake &nbsp;
						<b>${jlpt3[curr.id].user_input[inputVal]}</b>&nbsp; 
						times with &nbsp;「
						<b>${inputVal}</b>」, be careful`,
						4000
					)
				}
			} else {

				jlpt3[curr.id].user_input[inputVal] = 1
			}
		} else {
			stats.success++
			jlpt3[curr.id].stats.success++
			jlpt3[curr.id].lvl++
		}

		layoutUpdate(inputVal === curr.answer)		

		if(inputVal === curr.answer && match_grammar_point()){

			var g_point = match_grammar_point()

			$('#see-more').html(
				`${curr.question[0]}<b>${curr.answer}</b>${curr.question[1]}
				<br>
				<a target="_blank" id="see-more_link" href="${g_point[1]}">
				See more about <b>${g_point[0]}</b></a>`
			)
		}
		
		localstorageUpdate()
	}
}

/**
 * Checks if the input matches with any options 
 */
function optionMatch(option) { // Checks the input value, sees if it match any of the prepostions.
	if(option !== '') {

		for(var i = 0, len = curr.options.length; i < len; i++){
			
			if(option.trim() === curr.options[i][0]) { return true }
		}
	}
	return false
}

/**
 * Check if the answer matches a grammatical point.
 * And returns it
 */
function match_grammar_point() {
	var match_len = 0, grammar_point;

	for (var i = 0; i < jlpt3_grammar_list.length; i++) {

		var re = RegExp(jlpt3_grammar_list[i][0],'g')

		if(curr.answer.match(re)!==null && curr.answer.match(re).length > match_len){

			match_len = curr.answer.match(re).length
			grammar_point = jlpt3_grammar_list[i]
		}
	}

	return match_len > 0 ? grammar_point : false
}

/**
 * Check if the answer matches a grammatical point.
 * And returns it
 */
function layoutUpdate (output) {
	var successMsg 	= 'Right on!',
		errorMsg	= 'Try again!',
		option_id	= jlpt3[curr.id].options.map(e => e[0]).indexOf($('#option')[0].value)
	jlpt3[curr.id].stats.count++
	if(output === true) {

		Materialize.toast(successMsg, 1000)
		$('.assignment b').removeClass('prep--missed')
		$('.sentence').addClass('sentence--success')
		$('#definition').addClass('definition--success')

		setTimeout( function() {

			$('.sentence').removeClass('sentence--success') 
		}, 500)

		jlpt3[curr.id].id = createQuestionId()
		setTimeout(showQuestion, 500)
	} else {

		Materialize.toast(errorMsg, 1000)
		$('.assignment b').eq(option_id).removeClass('prep--missed').addClass('prep--missed')
		$('.sentence').addClass('shaky')
		
		setTimeout( function() {

			$('.sentence').removeClass('shaky') 
		}, 820);
		
		$('#option')[0].value = ''
		if(jlpt3[curr.id].lvl > 0){

			jlpt3[curr.id].lvl++
		}
	}
	view.showRepetitions()
}

/**
 * Updates question's grasp level
 */
function updateGraspLevel() {

	if ($('.sentence')[0].classList.length > 1) {

		$('.sentence').removeClass( $('.sentence')[0].classList[1] );
	}

	$('.sentence').addClass(`grasp--${jlpt3[curr.id].lvl}`);
}

/**
 * Updates the current object.
 */

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

	localStorage.setItem( 'jlpt3-grammar', JSON.stringify(jlpt3) )
	localStorage.setItem( 'jlpt3-grammar-stats', JSON.stringify(stats) )
	
	jlpt3 = localstorageSetUp('jlpt3-grammar',jlpt3)
	stats = localstorageSetUp('jlpt3-grammar-stats',stats)	
}

// Set input field to Hiragana characters

jlpt3 = localstorageSetUp('jlpt3-grammar',jlpt3)
stats = localstorageSetUp('jlpt3-grammar-stats',stats)	
localstorageUpdate()
current.fillIn()
view.showRepetitions()
view.showQuestion()
view.showOptions()