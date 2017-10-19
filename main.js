var questions = {
	1:{
		'q':['二度とあの部屋に入らないと約束しろ','言われたけど、僕は約束しなかった。'],
		'a':[['を',false],['って',true],['のを',false],['だ',false]]
	},
	2:{
		'q':['私は何百回もこの手紙を読み返した。そして読み返す','たまらなく哀しい気持になった。'],
		'a':[['うちに',false],['はじめに',false],['たびに',true],['だけに',false]]
	},
	3:{
		'q':['3. 本を読んでいたら','五時間も経ってしまった。'],
		'a':[['そろそろ',false],['だんだん',false],['ようやく',false],['いつの間にか',true]]
	}
};

var inputEl= $('#option')[0]

var occured_questions_id=[],
	questionId,
	count_rep=0,
	count_success=0,
	count_fail=0

var qLen = function(){ // Function that returns the number of sentences
	var questionsLen=Object.keys(questions);

	return questionsLen
}

var genQuestionId = function() { // Function that create a snetence id that get throughs the array.
	return Math.floor(Math.random()*Object.keys(questions).length)+1
}

var showSentence = function() { // Dispkay sentence and add sentence in the occurred array.
	var obj=questions[questionId]
	inputEl.value=''
	if(occured_questions_id.length<qLen())
	{
		if(occured_questions_id.indexOf(questionId.join(''))===-1)
		{
			occured_questions_id.push(questionId.join(''))
			$('#sentence_prt_1').html(obj.s[0])
			$('#sentence_prt_2').html(obj.sentence[1])
			$('#aimed_context').html(obj.context)
		} else {
			questionId=genQuestionId()
			showSentence(questionId)
		}
	} else {
		occured_questions_id=[] // Empty object.
	}
}

var wrongAnswer = function(pv, m) {// PhrasalVerb and Meaning being passed to the function.
	if($('.wrong_answer:visible').length===0){
		var rightAnswerClasses='s5 offset-s1'
		$('#definition').removeClass('s6 offset-s3').addClass(rightAnswerClasses)
		setTimeout(function(){$('.wrong_answer').fadeIn()},200)
	}
	$('.wrong_answer span').text(pv)
	$('.wrong_answer h5').text(m)
}

var prepositionInputted = function(prep){ // Checks the input value, sees if it match any of the prepostions.
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
	var ps=questions[questionId] // ps stands for Phrasal Verbs
		successMsg='Right on!', //success message
		errorMsg='Try again!' //fail message
	if(prepositionInputted(inputVal)) // Check if preposition correctly inputted
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
			questionId=genQuestionId()

			// Play audio 
			var audioSrc=$('#sentence_prt_1').text()+inputVal+$('#sentence_prt_2').text();
			audioSrc=audioSrc.replace(/\s/g,'_');
			$('.audio').attr('src','audio/'+audioSrc+'.mp3')
			$('.audio').trigger("play")

			// Add success class to the sentence.
			setTimeout(showSentence,2000)

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

			if(sentences[ps.verb][inputVal]!==undefined){
				wrongAnswer(ps.verb+' '+inputVal,sentences[ps.verb][inputVal][1]['m'])
			}
		}
		showRepetition()
	}
}

var showRepetition = function() {
	$('#repetition').text(' '+count_rep)
	$('#success').text(' '+count_success)
	$('#failure').text(' '+count_fail)
}

questionId=genQuestionId()
showSentence(questionId)
showRepetition()