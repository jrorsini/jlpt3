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
var create_question_id = function() { 
	return Math.floor(Math.random()*Object.keys(jlpt3).length)+1
}


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
	options=jlpt3[current_question_id].options.map(e=>e[0])
	$('.assignment').html('<u>Choose between</u><br><b>'+options.join('</b> - <b>')+'</b>')
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
var option_match = function(prep){ // Checks the input value, sees if it match any of the prepostions.
	var preps=['across','along','around','away','back','into','on','out','over','with','through','up','off']
	if(prep==='')
	{
		return false
	} else{
		for(var i=0,len=preps.length;i<len;i++)
		{
			if(prep.toLowerCase().trim()===preps[i])
			{
				return true
			}
		}
	}
	return false
}

var checkAnswer = function(e,inputVal=inputEl.value) { // Checks input value to the answer.
	var ps=jlpt3[current_question_id] // ps stands for Phrasal Verbs
		successMsg='Right on!', //success message
		errorMsg='Try again!' //fail message
	if(option_match(inputVal)) // Check if preposition correctly inputted
	{
		count_rep++
		// Order of actions
		// = crosslines missed preposition
		if(ps.answer===inputVal)
		{
			// = Counter iteration
			count_success++

			// = notification
			Materialize.toast(successMsg, 4000)

			$('.assignment b').removeClass('prep--missed')
			
			// Highlights the sentence
			$('.sentence').addClass('sentence--success')
			$('#definition').addClass('definition--success')

			setTimeout(function(){$('.sentence').removeClass('sentence--success'),$('#definition').removeClass('definition--success')},2000)
	
			// Fills question marks with the right preposition
			$('#definition span').text($('#definition span')[0].innerHTML.replace('???',inputVal))
			
			$('#definition h5').text($('#definition h5')[0].innerHTML.replace('???',inputVal))

			// Re generateId
			current_question_id=create_question_id()

			// Play audio 
			var audioSrc=$('#sentence_prt_1').text()+inputVal+$('#sentence_prt_2').text();
			audioSrc=audioSrc.replace(/\s/g,'_');
			$('.audio').attr('src','audio/'+audioSrc+'.mp3')
			$('.audio').trigger("play")

			// Add success class to the sentence.
			setTimeout(show_question,2000)

			if($('.wrong_answer:visible').length===1){
				$('.wrong_answer').fadeOut(200)
				setTimeout(function(){
					$('#definition').removeClass('s5 offset-s1').addClass('s6 offset-s3')
				},200)
			}
		} else {
			// = Counter iteration
			count_fail++

			// = notification
			Materialize.toast(errorMsg, 4000)

			$('#prep_'+inputVal).removeClass('prep--missed').addClass('prep--missed')
			
			// Highlights the sentence
			$('.sentence').addClass('shaky'),setTimeout(function(){$('.sentence').removeClass('shaky')},820);

			inputEl.value=''

			// if(sentences[ps.verb][inputVal]!==undefined){
			// 	// wrongAnswer(ps.verb+' '+inputVal,sentences[ps.verb][inputVal][1]['m'])
			// }
		}
		showRepetition()
	}
}

var showRepetition = function() {
	$('#repetition').text(' '+count_rep)
	$('#success').text(' '+count_success)
	$('#failure').text(' '+count_fail)
}

current_question_id=create_question_id()
show_question()
show_options()
showRepetition()