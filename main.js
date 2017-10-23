var 
	// Collects ids that have been already shown.
	occured=[],
	// To retrieve the user input value.
	inputEl= $('#option')[0],
	// Question's length
	len = Object.keys(jlpt3).length,
	count_rep=0,
	count_success=0,
	count_fail=0,

// Current question's object
var curr = {}

// Sets the input field to Hiragana
//**********************************
wanakana.bind(inputEl); 

// Creates question's ID
//***********************
var create_question_id = function () {
	return Math.floor(Math.random()*Object.keys(jlpt3).length)+1
}
// Dispkay sentence and add sentence in the occurred array
//*********************************************************
var show_question = function () {
	inputEl.value=''
	if(occured.length<len)
	{
		if(occured.indexOf(curr.id)===-1)
		{
			occured.push(curr.id)
			$('#sentence_prt_1').text(curr.question[0])
			$('#sentence_prt_2').text(curr.question[1])
			show_options()
			update_grasp_class()
		} else {
			update_current()
			show_question(curr.id)
		}
	} else {
		occured=[] // Empty object.
	}
	
}

// Sets the 'options' variable and displays options 
//**************************************************
var show_options = function () {
	$('.assignment').html('<u>Choose between</u><br><b>'+curr.options.map(e=>e[0]).join('</b> - <b>')+'</b>')
}


// Checks if there's anything in localstorage and assign jlpt3 var to current state
//**********************************************************************************
var localstorage_sync = function () {
	if(localStorage.getItem('jlpt3-grammar')===null){
		localStorage.setItem('jlpt3-grammar',JSON.stringify(jlpt3))
	} 
	jlpt3=JSON.parse(localStorage.getItem('jlpt3-grammar'))
}


// Set the the updated data set version to localstorage
//******************************************************
var localstorage_update = function () {
	localStorage.setItem('jlpt3-grammar',JSON.stringify(jlpt3))
	localstorage_sync()
}


// Checks if the input matches with any options 
//**********************************************
var option_match = function (option){ // Checks the input value, sees if it match any of the prepostions.
	if(option===''){
		return false
	} else {
		for(var i=0,len=options.length;i<len;i++){
			if(option.trim()===options[i][0]) { return true }
		}
	}
	return false
}

var check_answer = function (e,inputVal=inputEl.value) { // Checks input value to the answer.
	var q=jlpt3[curr.id] // ps stands for Phrasal Verbs
		
	if(e.keyCode===13){
		if(option_match(inputVal)) // Check if preposition correctly inputted
		{
			var answer=options.map(e=>(e[1]===true)?e[0]:'').join('')
			count_rep++
			// Order of actions
			// = crosslines missed preposition
			layout_update(inputVal===answer)
			if(inputVal!==answer){
				if(jlpt3[curr.id].user_input[inputVal]){
					jlpt3[curr.id].user_input[inputVal]++
					if(jlpt3[curr.id].user_input[inputVal]>2){
						Materialize.toast(
							'You made that mistake &nbsp;<b>'
							+jlpt3[curr.id].user_input[inputVal]+
							'</b>&nbsp; times with &nbsp;「<b>'
							+inputVal+'</b>」, be careful ', 4000)
					}
				} else {
					jlpt3[curr.id].user_input[inputVal]=1
				}
			}
			if(inputVal===answer){
				$('#see-more_link').html('See more about <b>'+answer+'</b>')
				$('#see-more_link').attr('href','http://japanesetest4you.com/flashcard/learn-jlpt-n3-grammar-'+answer+'/')
			}
			localstorage_update()
		}
	}
}

function layout_update (output) {
	var successMsg='Right on!', 
		errorMsg='Try again!',
		option_id=options.map(e=>e[0]).indexOf(inputEl.value)
	jlpt3[curr.id].stats.count++
	if(output===true){
		count_success++
		Materialize.toast(successMsg, 1000)
		$('.assignment b').removeClass('prep--missed')
		$('.sentence').addClass('sentence--success')
		$('#definition').addClass('definition--success')
		curr.stats.success++
		curr.lvl++
		setTimeout(function(){$('.sentence').removeClass('sentence--success')},500)
		curr.id=create_question_id()
		setTimeout(show_question,500)
	} else {
		count_fail++
		Materialize.toast(errorMsg, 1000)
		$('.assignment b').eq(option_id).removeClass('prep--missed').addClass('prep--missed')
		$('.sentence').addClass('shaky'),setTimeout(function(){$('.sentence').removeClass('shaky')},820);
		curr.stats.fail++
		inputEl.value=''
		if(curr.lvl>0){
			curr.lvl++
		}
	}
	show_repetitions()

}

// Updates question's grasp level
//********************************
var update_grasp_class = function () {
	console.log(jlpt3[curr.id])
	var curr_grasp_lvl=jlpt3[curr.id].grasp_level
	if($('.sentence')[0].classList.length>1){
		$('.sentence').removeClass($('.sentence')[0].classList[1])
	}
	$('.sentence').addClass('grasp--'+curr_grasp_lvl);
}

// Updates the repetition stats
//******************************
function show_repetitions () {
	$('#repetition').text(' '+count_rep)
	$('#success').text(' '+count_success)
	$('#failure').text(' '+count_fail)
}

var update_current = function () {
	curr.id=create_question_id()
	curr.question=jlpt3[curr.id].question
	curr.options=jlpt3[curr.id].options
	curr.stats=jlpt3[curr.id].options
	curr.lvl=jlpt3[curr.id].grasp_level
}

update_current()
localstorage_sync()
localstorage_update()
show_question()
show_options()
show_repetitions()

