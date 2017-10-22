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

// Displays question question and fill in occured sentences array
//****************************************************************
var show_question = function() { // Dispkay sentence and add sentence in the occurred array.
	current_question=jlpt3[current_question_id]
	inputEl.value=''
	if(occured_questions_id.length<q_len)
	{
		if(occured_questions_id.indexOf(current_question_id)===-1)
		{
			occured_questions_id.push(current_question_id)
			$('#sentence_prt_1').text(current_question.question[0])
			$('#sentence_prt_2').text(current_question.question[1])
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

// var wrongAnswer = function(pv, m) {// PhrasalVerb and Meaning being passed to the function.
// 	if($('.wrong_answer:visible').length===0){
// 		var rightAnswerClasses='s5 offset-s1'
// 		$('#definition').removeClass('s6 offset-s3').addClass(rightAnswerClasses)
// 		setTimeout(function(){$('.wrong_answer').fadeIn()},200)
// 	}
// 	$('.wrong_answer span').text(pv)
// 	$('.wrong_answer h5').text(m)
// }


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
		successMsg='Right on!', //success message
		errorMsg='Try again!' //fail message
	if(option_match(inputVal)) // Check if preposition correctly inputted
	{
		var option_id=options.map(e=>e[0]).indexOf(inputVal)
		var answer=options.map(e=>(e[1]===true)?e[0]:'').join('')
		count_rep++
		// Order of actions
		// = crosslines missed preposition
		if(inputVal===answer)
		{
			// = Counter iteration
			count_success++

			// = notification
			Materialize.toast(successMsg, 4000)

			$('.assignment b').removeClass('prep--missed')
			
			// Highlights the sentence
			$('.sentence').addClass('sentence--success')
			$('#definition').addClass('definition--success')

			setTimeout(function(){$('.sentence').removeClass('sentence--success')},500)
				
			// Re generateId
			current_question_id=create_question_id()
			// Add success class to the sentence.
			setTimeout(show_question,500)
		} else {
			// = Counter iteration
			count_fail++

			// = notification
			Materialize.toast(errorMsg, 4000)

			$('.assignment b').eq(option_id).removeClass('prep--missed').addClass('prep--missed')

			// Highlights the sentence
			$('.sentence').addClass('shaky'),setTimeout(function(){$('.sentence').removeClass('shaky')},820);

			inputEl.value=''

			// if(sentences[ps.verb][inputVal]!==undefined){
			// 	// wrongAnswer(ps.verb+' '+inputVal,sentences[ps.verb][inputVal][1]['m'])
			// }
		}
		show_repetitions()
	}
}

var show_repetitions = function() {
	$('#repetition').text(' '+count_rep)
	$('#success').text(' '+count_success)
	$('#failure').text(' '+count_fail)
}

current_question_id=create_question_id()
show_question()
show_options()
show_repetitions()