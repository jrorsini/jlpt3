var 
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

localstorageSync()
localstorageUpdate()
showQuestion()
showOptions()
showRepetitions()


// Sets the input field to Hiragana
//**********************************
wanakana.bind(inputEl); 

// Creates question's ID
//***********************
function create_question_id() {
	return Math.floor(Math.random() * Object.keys(jlpt3).length) + 1
}

// Dispkay sentence and add sentence in the occurred array
//*********************************************************
function showQuestion() {
	inputEl.value = '';
	update_current()
	if(occured.length < len) {
		if(occured.indexOf(curr.id) === -1) {
			occured.push(curr.id)
			$('#sentence_prt_1').text(curr.question[0])
			$('#sentence_prt_2').text(curr.question[1])
			showOptions()
			update_grasp_class()
		} else {
			update_current()
			showQuestion()
		}
	} else {
		occured = [] // Empty object.
	}
}

// Sets the 'options' variable and displays options 
//**************************************************
function showOptions() {
	$('.assignment').html(
		'<u>Choose between</u><br><b>'
		+ curr.options.map(e=>e[0]).join('</b> - <b>') +
		'</b>'
	)
}

// Checks if there's anything in localstorage and assign jlpt3 var to current state
//**********************************************************************************
function localstorageSync() {
	if(localStorage.getItem('jlpt3-grammar') === null) {
		localStorage.setItem('jlpt3-grammar', JSON.stringify(jlpt3))
	} 
	jlpt3=JSON.parse(localStorage.getItem('jlpt3-grammar'))

	if(localStorage.getItem('jlpt3-grammar-stats') === null) {
		localStorage.setItem('jlpt3-grammar-stats', JSON.stringify(stats))
	} 
	stats=JSON.parse( localStorage.getItem('jlpt3-grammar-stats') )
}

// Set the the updated data set version to localstorage
//******************************************************
function localstorageUpdate() {
	localStorage.setItem( 'jlpt3-grammar', JSON.stringify(jlpt3) )
	localStorage.setItem( 'jlpt3-grammar-stats', JSON.stringify(stats) )
	localstorageSync()
}

// Checks if the input matches with any options 
//**********************************************
function option_match(option) { // Checks the input value, sees if it match any of the prepostions.
	if(option !== '') {
		for(var i = 0, len = curr.options.length; i < len; i++){
			if(option.trim() === curr.options[i][0]) { return true }
		}
	}
	return false
}

// Checks if the user's input match with the answer
//**************************************************
function check_answer(e, inputVal = inputEl.value) { // Checks input value to the answer.		
	if(e.keyCode === 13) {
		if(option_match(inputVal)) {
			stats.rep++
			layout_update(inputVal === curr.answer)
			if(inputVal !== curr.answer) {
				if(curr.user_input[inputVal]) {
					curr.user_input[inputVal]++
					if(curr.user_input[inputVal] > 2) {
						Materialize.toast(
							'You made that mistake &nbsp;<b>'
							+ curr.user_input[inputVal] +
							'</b>&nbsp; times with &nbsp;「<b>'
							+ inputVal +'</b>」, be careful ', 4000)
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

function layout_update (output) {
	var successMsg 	='Right on!', 
		errorMsg	='Try again!',
		option_id	=curr.options.map(e => e[0]).indexOf(inputEl.value)
	curr.stats.count++
	if(output === true) {
		stats.success++
		Materialize.toast(successMsg, 1000)
		$('.assignment b').removeClass('prep--missed')
		$('.sentence').addClass('sentence--success')
		$('#definition').addClass('definition--success')
		curr.stats.success++
		curr.lvl++
		setTimeout( function() {
			$('.sentence').removeClass('sentence--success') 
		}, 500)
		curr.id = create_question_id()
		setTimeout(showQuestion, 500)
	} else {
		stats.fail++
		Materialize.toast(errorMsg, 1000)
		$('.assignment b').eq(option_id).removeClass('prep--missed').addClass('prep--missed')
		$('.sentence').addClass('shaky'),setTimeout( function() {
			$('.sentence').removeClass('shaky') 
		}, 820);
		curr.stats.fail++
		inputEl.value = ''
		if(curr.lvl > 0){
			curr.lvl++
		}
	}
	showRepetitions()

}

// Updates question's grasp level
//********************************
function update_grasp_class() {
	if ($('.sentence')[0].classList.length > 1) $('.sentence').removeClass( $('.sentence')[0].classList[1] );
	$('.sentence').addClass(`grasp--${curr.lvl}`);
}

// Updates the repetition stats
//******************************
function showRepetitions() {
	$('#repetition').text(` ${stats.rep}`)
	$('#success').text(` ${stats.success}`)
	$('#failure').text(` ${stats.fail}`)
}

function update_current() {
	curr.id 			= create_question_id()
	curr.question 		= jlpt3[curr.id].question
	curr.options 		= jlpt3[curr.id].options
	curr.stats 			= jlpt3[curr.id].options
	curr.user_input 	= jlpt3[curr.id].user_input
	curr.lvl 			= jlpt3[curr.id].grasp_level
	curr.answer 		= curr.options.map(e=>(e[1] === true) ? e[0] : '').join('')
}
