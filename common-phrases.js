// Variable declarations
let db_commonQuestions,
	db_commonStats,
	stack,
	getId

/**
 * Fill the question's list based off span.
 */
function questionStackMethods() {
	let stackSpan = 5, questionStack = [], occuredIds = [], Objlen = commonPhrases.length, id;
	
	function expandStackSpanBy(spanExpand) {
		stackSpan += spanExpand
		fillStack()
	}

	function fillStack() {

		let len = stackSpan - questionStack.length

		for(let i = 0; i < len; i++) {
			id = Math.floor( Math.random() * Objlen );
			while(occuredIds.indexOf(id) !== -1) {

				id = Math.floor( Math.random() * Objlen)
			}

			occuredIds.push(id)
			
			questionStack.push(commonPhrases[id])
		}
		return questionStack
	}

	fillStack()

	return {
		expand: expandStackSpanBy,
		questionStack: questionStack
	}
}

let foo = questionStackMethods()

/**
 * Displays sentence and add sentence in the occurred array
 */
const getQ = function showCurrentQuestion() {

	let applicableElement = $('#sentence');
	if(current.right + current.wrong === 0) {
		$('#newIcon').text('star')
	}

	applicableElement.html(`<span>${current.english}</span><input type="text" id="option" class="commonPhrasesInput" onkeyup="check(event)">`)
	
	if(applicableElement[0]){

		wanakana.bind(applicableElement[0]);			
	}
	$('#option').focus()	
}

/**
 * create id for the question and checks if it's already in there
 */

function generatesRandomQuestionId() {
	let occured = [],
		len = Object.keys(stack).length - 1,
		id;

	function GenerateRandomNumber() {
		
		return Math.ceil(Math.random() * len)
	}

	function setId() {
		
		id = GenerateRandomNumber()

		while(occured.indexOf(id) !== -1) {
			id = GenerateRandomNumber()
		}
		
		occured.push(id)
		
		if (occured.length === len) {

			occured = []
		}

		return {
			id: id,
			occured: occured
		}
	}
	
	return  setId
}

/**
 * Updates the current object.
 */
const fill = function fillInCurrentObject() {
	
	let id = getId().id
	current.id = id
	current.english = stack[id].english,
	current.japanese = stack[id].japanese,
	current.romaji = stack[id].romaji
	current.right = stack[id].stats.right
	current.wrong = stack[id].stats.wrong
}

const reload = function createNewIdFillCurrentObjectShowQuestion() {
	getId(), fill(), getQ()
}

const view = {
	/**
	 * Updates the repetition stats
	 */
	showRepetitions() {

		let repetitions = db_commonStats.right + db_commonStats.wrong,
			percentage = repetitions === 0 ? 0 : Math.round(db_commonStats.right / repetitions * 100)

		$('#repetition').html(` ${repetitions}`)
		$('#success').html(` ${db_commonStats.right}`)
		$('#failure').html(` ${db_commonStats.wrong}`)
		$('#percentage').html(` ${percentage}%`)
	},
	/**
	 * Reset Repetitions to 0
	 */
	resetRepetitions() {
		console.log('test')
		db_commonStats.right = 0
		db_commonStats.fail = 0
		this.showRepetitions()
	},
	/**
	 * Attaches a function to an element
	 */
	attachEvent(element, type, func) {
		element.addEventListener(type, func)
	},
	/**
	 * Updates question's grasp level
	 */
	updateGraspLevel() {
	
		if ($('.sentence')[0].classList.length > 1) {
	
			$('.sentence').removeClass( $('.sentence')[0].classList[1] );
		}
	
		$('.sentence').addClass(`grasp--${this.graspLevel}`);
	},
	
}

/**
 * Checks if the user's input match with the answer
 */
const check = function checkAnswer(e) { // Checks input value to the answer.

	const answer = current.romaji.map(e => {
		e = e.split(''), e.pop()
		return wanakana.toHiragana(e.join('').replace(/\swa(\s|\,)/g,' ha ').replace(/\so(\s|\,)/g,' wo ').replace(/\s/g,''))
	})
	const inputVal = $('#option')[0].value

	if(e.keyCode === 13) {
		if(answer.indexOf(inputVal) !== -1) {
			console.log('Right Answer')
			// update
			db_commonQuestions[current.id].stats.right++
			db_commonStats.right++
			reload()
			$('#tempAnswer').text('Hint?')
		} else {
			// Show hint
			$('#tempAnswer').text(current.japanese.join(' / '))
			// Update mistaken answer
			db_commonQuestions[current.id].stats.wrong++
			db_commonStats.wrong++
			console.log('Wrong Answer')
		}
		sync()
		// Refresh repetition's status
		view.showRepetitions()
	}
}

/**
 * When wanting to check localstorage data in a proper json format.
 */

const fromDb = function getProperFormatDbInLocalStorage(dbName) {
	if(localStorage.getItem(dbName) === null) {
		console.log(`Not db found, maybe if you try : ${Object.keys(localStorage).join(', ')}`)
	} else {
		return JSON.parse( localStorage.getItem(dbName) )		
	}
}

/**
 * Sets status and questions into localstorage.
 */
const set = function localstorageSetUp(name, object) {

	if(localStorage.getItem(name) === null) {

		localStorage.setItem(name, JSON.stringify(object))
	} 

	return JSON.parse( localStorage.getItem(name) )
}

/**
 * Set the the updated data set version to localstorage
 */
const sync = function localstorageUpdate() {

	localStorage.setItem( 'common_phrases', JSON.stringify(db_commonQuestions) )
	localStorage.setItem( 'common_phrases_stats', JSON.stringify(db_commonStats) )
	
	db_commonQuestions = set('common_phrases',commonPhrases)
	db_commonStats = set('common_phrases_stats',userStats)	
}


/**
 * Lists all user's status
 */
const load = function listsAllCommonPhrasesWithStatus() {
	db_commonQuestions = db_commonQuestions.sort(function(a, b) {
		return (b.stats.right + b.stats.wrong) - (a.stats.right + a.stats.wrong)
	})
}

/**
 * Lists all common phrase by right answers.
 */

const slct_right = function listsCommonPhrasesByRightAnswer() {
	db_commonQuestions = db_commonQuestions.sort(function(a, b) {
		return b.stats.right - a.stats.right
	})
}

/**
 * Lists all common phrase by wrong answers.
 */

const slct_wrong = function listsCommonPhrasesByRightAnswer() {
	db_commonQuestions = db_commonQuestions.sort(function(a, b) {
		return b.stats.wrong - a.stats.wrong
	})
}

$('#commonPhrasesSort').change(function(){
	let len = db_commonQuestions.length		
	$("#statsList").empty()	
	if(this.value === 'option_right') {
		slct_right()
	}
	if(this.value === 'option_repetion') {
		load()
	}
	for(let i = 0; i < len; i++) {
		$('#statsList').append(`<tr><td><b>${db_commonQuestions[i].english}</b></td><td>${db_commonQuestions[i].japanese.join(' / ')}</td><td class="green-text" style="text-align: center">${db_commonQuestions[i].stats.right}</td><td class="red-text" style="text-align: center">${db_commonQuestions[i].stats.wrong}</td></tr>`)
	}
})


const current = {}
const userStats = {right: 0, wrong:0}

stack = questionStackMethods().questionStack
getId = generatesRandomQuestionId()

stack = foo
db_commonQuestions = set('common_phrases',commonPhrases)
db_commonStats = set('common_phrases_stats',userStats)	

sync()
getId()
fill()
getQ()

view.showRepetitions()

$('#statsBtn').click(load)