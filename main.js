var occured_questions_id=[],
	inputEl= $('#option')[0],
	q_len = Object.keys(jlpt3).length,
	count_rep=0,
	count_success=0,
	count_fail=0,
	current_question_id,
	current_question,
	options


// Sets the input field to Hiragana
//**********************************
wanakana.bind(inputEl); 

// Creates question's ID
//***********************
var create_question_id = () => Math.floor(Math.random()*Object.keys(jlpt3).length)+1

// Dispkay sentence and add sentence in the occurred array
//*********************************************************
var show_question = function() {
	current_question=jlpt3[current_question_id]
	inputEl.value=''
	if(occured_questions_id.length<q_len)
	{
		if(occured_questions_id.indexOf(current_question_id)===-1)
		{
			occured_questions_id.push(current_question_id)
			$('#sentence_prt_1').text(current_question.question[0])
			$('#sentence_prt_2').text(current_question.question[1])
			show_options()
		} else {
			current_question_id=create_question_id()
			show_question(current_question_id)
		}
	} else {
		occured_questions_id=[] // Empty object.
	}
	return q_len
}

// Sets the 'options' variable and displays options 
//**************************************************
var show_options = function() {
	options=jlpt3[current_question_id].options
	options_to_show=options.map(e=>e[0])
	$('.assignment').html('<u>Choose between</u><br><b>'+options_to_show.join('</b> - <b>')+'</b>')
}


// Checks if there's anything in localstorage and assign jlpt3 var to current state
//**********************************************************************************
var localstorage_sync = function () {
	if(localStorage.getItem('jlpt3-grammar')===null){
		localStorage.setItem('jlpt3-grammar',JSON.stringify(jlpt3))
	} 
	jlpt3=JSON.parse(localStorage.getItem('jlpt3-grammar'))
}


var localstorage_update = function () {
	localStorage.setItem('jlpt3-grammar',JSON.stringify(jlpt3))
	localstorage_sync()
}


// Checks if the input matches with any options 
//**********************************************
var option_match = function(option){ // Checks the input value, sees if it match any of the prepostions.
	if(option===''){
		return false
	} else {
		for(var i=0,len=options.length;i<len;i++){
			if(option.trim()===options[i][0]) { return true }
		}
	}
	return false
}

var check_answer = function(e,inputVal=inputEl.value) { // Checks input value to the answer.
	var q=jlpt3[current_question_id] // ps stands for Phrasal Verbs
		
	if(option_match(inputVal)) // Check if preposition correctly inputted
	{
		var answer=options.map(e=>(e[1]===true)?e[0]:'').join('')
		count_rep++
		// Order of actions
		// = crosslines missed preposition
		layout_update(inputVal===answer)
		if(inputVal!==answer){
			if(jlpt3[current_question_id].user_input[inputVal]){
				jlpt3[current_question_id].user_input[inputVal]++
			} else {
				jlpt3[current_question_id].user_input[inputVal]=1
			}
		}
		localstorage_update()
	}
}

function layout_update (output){
	var successMsg='Right on!', 
		errorMsg='Try again!',
		option_id=options.map(e=>e[0]).indexOf(inputEl.value)
	jlpt3[current_question_id].stats.count++
	if(output===true){
		count_success++
		Materialize.toast(successMsg, 4000)
		$('.assignment b').removeClass('prep--missed')
		$('.sentence').addClass('sentence--success')
		$('#definition').addClass('definition--success')
		jlpt3[current_question_id].stats.success++
		jlpt3[current_question_id].grasp_level++
		setTimeout(function(){$('.sentence').removeClass('sentence--success')},500)
		current_question_id=create_question_id()
		setTimeout(show_question,500)

	} else {
		count_fail++
		Materialize.toast(errorMsg, 4000)
		$('.assignment b').eq(option_id).removeClass('prep--missed').addClass('prep--missed')
		$('.sentence').addClass('shaky'),setTimeout(function(){$('.sentence').removeClass('shaky')},820);
		jlpt3[current_question_id].stats.fail++
		inputEl.value=''
		if(jlpt3[current_question_id].grasp_level>0){
			jlpt3[current_question_id].grasp_level++
		}
	}
	show_repetitions()

}

// Updates the repetition stats
//******************************
function show_repetitions() {
	$('#repetition').text(' '+count_rep)
	$('#success').text(' '+count_success)
	$('#failure').text(' '+count_fail)
}

current_question_id=create_question_id()
show_question()
show_options()
show_repetitions()
localstorage_sync()
localstorage_update()



