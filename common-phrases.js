let occured = [];

/**
 * Dynamic key generation function.
 */
function getKey(k) {
	return k;
}

/**
 * Displays sentence and add sentence in the occurred array
 */
const getQ = function showQuestion() {

	let applicableElement = $('#sentence');

	applicableElement.html(`<span>${current.english}</span><input type="text" id="option" class="commonPhrasesInput" onkeyup="checkAnswer(event)">`)
	wanakana.bind(applicableElement[0]);	
	$('#option').focus()	
}

/**
 * create id for the question and checks if it's already in there
 */
var getId = function generatesRandomQuestionId() {

	const objectLen = Object.keys(commonPhrases).length - 1
	let id = Math.floor( Math.random() * objectLen ) + 1

	while(occured.indexOf(id) !== -1) {

		id = Math.floor( Math.random() * objectLen ) + 1
	}

	occured.push(id)

	if (occured.length === objectLen) {

		occured = []
	}
	return id
}

/**
 * Updates the current object.
 */
function fillInCurrent() {
	
	let id = getId()

	current.english = commonPhrases[id].english,
	current.japanese = commonPhrases[id].japanese,
	current.romaji = commonPhrases[id].romaji
}

const current = {}

const view = {
	[getKey('userStats')]: {right: 0, wrong:0},
	/**
	 * Updates the repetition stats
	 */
	showRepetitions() {

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
	resetRepetitions() {
		console.log('test')
		this.userStats.right = 0
		this.userStats.fail = 0
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

function isNew() {
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

	const answer = current.romaji.map(e => {
		e = e.split(''), e.pop()
		return wanakana.toHiragana(e.join('').replace(/\swa[\s\,]/g,' ha ').replace(/\so[\s\,]/g,' wo ').replace(/\s/g,''))
	})
	const inputVal = $('#option')[0].value

	if(e.keyCode === 13) {
		console.log(answer)
		console.log(current.japanese)
		console.log()
		if(answer.indexOf(inputVal) !== -1) {
			console.log('Right Answer')
			getId()
			fillInCurrent()
			getQ()
			$('#tempAnswer').text('?')
		} else {
			$('#tempAnswer').text(current.japanese.join(' / '))
			console.log('Wrong Answer')
		}
	}
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


// commonPhrases = localstorageSetUp('common-phrases',commonPhrases)
// stats = localstorageSetUp('common-phrases-stats',stats)	
// localstorageUpdate()
getId()
fillInCurrent()
getQ()
view.showRepetitions()