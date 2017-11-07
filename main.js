var 
	localData = {}
	// Collects ids that have been already shown.
	occured = [],
	// To retrieve the user input value.
	inputEl = $('#option')[0],
	// Question's length
	len = Object.keys(jlpt3).length,
	// Stat's object
	stats = {
		rep:0,
		success:0,
		fail:0
	}

// Current question's object
var curr = {}

/**
 * Displays sentence and add sentence in the occurred array
 */

function showQuestion() {
	update_current()
	if(occured.length < len) {

		if(occured.indexOf(curr.id) === -1) {

			occured.push(curr.id)
			$('#sentence').html(`<span>${curr.question[0]}</span><input type="text" id="option" onkeyup="checkAnswer(event)"><span>${curr.question[1]}</span>`)
			showOptions()
			update_grasp_class()
		} else {

			update_current()
			showQuestion()
		}
	} else {

		occured = [] // Empty object.
		update_current()
		showQuestion()
	}
	wanakana.bind($('#option')[0]);
	$('#option')[0].focus()
}


/**
 * resetRepetition() Reset Repetitions to 0
 */

function resetRepetitions() {

}

/**
 * showRepetitions() Updates the repetition stats
 */
// 
function showRepetitions() {
	var percentage = stats.rep === 0 ? 0 : Math.round(stats.success / stats.rep * 100)
	$('#repetition').html(` ${stats.rep}`)
	$('#success').html(` ${stats.success}`)
	$('#failure').html(` ${stats.fail}`)
	$('#percentage').html(` ${percentage}%`)
}

/**
 * showOptions() Sets the 'options' variable and displays options 
 */
function showOptions() {
	$('.assignment').html(`<u>Choose between</u><br><b>${curr.options.map(e => e[0]).join('</b> - <b>')}</b>`)
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
 * createQuestionId() returns a random id for the questions
 */
function createQuestionId() {
	return Math.floor( Math.random() * Object.keys(jlpt3).length ) + 1
}


/**
 * optionMatch() Checks if the input matches with any options 
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
 * checkAnswer() Checks if the user's input match with the answer
 */
function checkAnswer(e, inputVal = $('#option')[0].value) { // Checks input value to the answer.		
	if(e.keyCode === 13) {
		if(optionMatch(inputVal)) {

			stats.rep++
			layout_update(inputVal === curr.answer)

			if(inputVal !== curr.answer) {

				if(curr.user_input[inputVal]) {

					curr.user_input[inputVal]++

					if(curr.user_input[inputVal] > 2) {

						Materialize.toast(
							`You made that mistake &nbsp;
							<b>${curr.user_input[inputVal]}</b>&nbsp; 
							times with &nbsp;「
							<b>${inputVal}</b>」, be careful`,
							4000
						)
					}
				} else {

					curr.user_input[inputVal] = 1
				}
			}

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
function layout_update (output) {
	var successMsg 	= 'Right on!',
		errorMsg	= 'Try again!',
		option_id	= curr.options.map(e => e[0]).indexOf($('#option')[0].value)
	curr.stats.count++
	if(output === true) {

		Materialize.toast(successMsg, 1000)
		$('.assignment b').removeClass('prep--missed')
		$('.sentence').addClass('sentence--success')
		$('#definition').addClass('definition--success')
		stats.success++
		curr.lvl++

		setTimeout( function() {
			$('.sentence').removeClass('sentence--success') 
		}, 500)

		curr.id = createQuestionId()
		setTimeout(showQuestion, 500)
	} else {

		stats.fail++
		Materialize.toast(errorMsg, 1000)
		$('.assignment b').eq(option_id).removeClass('prep--missed').addClass('prep--missed')
		$('.sentence').addClass('shaky'), setTimeout( function() {

			$('.sentence').removeClass('shaky') 
		}, 820);
		curr.stats.fail++
		$('#option')[0].value = ''
		if(curr.lvl > 0){

			curr.lvl++
		}
	}
	showRepetitions()
}

/**
 * Updates question's grasp level
 */
function update_grasp_class() {

	if ($('.sentence')[0].classList.length > 1) {
		$('.sentence').removeClass( $('.sentence')[0].classList[1] );
	}
	$('.sentence').addClass(`grasp--${curr.lvl}`);

}

/**
 * Updates the current object.
 */
function update_current() {
	curr.id 			= createQuestionId()
	curr.question 		= jlpt3[curr.id].question
	curr.options 		= jlpt3[curr.id].options
	curr.stats 			= jlpt3[curr.id].options
	curr.user_input 	= jlpt3[curr.id].user_input
	curr.lvl 			= jlpt3[curr.id].grasp_level
	curr.answer 		= curr.options.map(e => ( e[1] === true) ? e[0] : '').join('')
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

	localStorage.setItem( 'jlpt3-grammar', JSON.stringify(jlpt3) )
	localStorage.setItem( 'jlpt3-grammar-stats', JSON.stringify(stats) )
	
	jlpt3 = localstorageSetUp('jlpt3-grammar',jlpt3)
	stats = localstorageSetUp('jlpt3-grammar-stats',stats)	
}

// Set input field to Hiragana characters

jlpt3 = localstorageSetUp('jlpt3-grammar',jlpt3)
stats = localstorageSetUp('jlpt3-grammar-stats',stats)
showRepetitions()
showQuestion()
showOptions()