function Game(gameSelector) {
	this.state = 'intro' // intro, progress, finish
	this.questionCount = document.querySelectorAll(gameSelector + " .optionSet").length

	document.querySelectorAll('.start').forEach(e => e.addEventListener('click', () => this.start()))
	document.querySelectorAll('.restart').forEach(e => e.addEventListener('click', () => this.init()))
	document.querySelectorAll('.option-correct').forEach(e => e.addEventListener('click', (event) => {
		if (this.answerIsShown) return
		this.showAnswer(true)
		// to avoid instant .optionSet clicking
		event.stopPropagation()
	}))
	document.querySelectorAll('.option-wrong').forEach(e => e.addEventListener('click', (event) => {
		if (this.answerIsShown) return
		this.showAnswer(false)
		// to avoid instant .optionSet clicking
		event.stopPropagation()
	}))
	document.querySelectorAll('.optionSet, .next').forEach(e => e.addEventListener('click', (event) => {
		if (! this.answerIsShown) return
		// links in explanations shouldn't switch question
		if (event.target.classList.contains('explanation-link')) return
		this.showNextQuestion()
	}))


	this.updateCounter = () => {
		//const progress = document.querySelector(".progress")
    //progress.innerHTML = ''
		const counter = document.querySelector(".counter")
    let score = '' + this.correctAnswersCounter * 100 
    score = '0'.repeat(6 - score.length) + score
    counter.innerHTML = score
	}


	this.hideEverything = () => {
		// hide intro screen
		let intro = document.querySelector(gameSelector +" #intro")
		intro.classList.remove('visible')

		// hide all questions
		const questions = document.querySelectorAll(gameSelector + " .question.visible")
		for (let i = 0; i < questions.length; i++) {
			questions[i].classList.remove('visible')
		}

		// hide result screen
		const result = document.querySelector("#result")
		result.classList.remove('visible')
	}


  this.updateView = () => {
    let body = document.querySelector('body')
    body.classList.toggle('correct', this.answerIsShown &&  this.isLastAnswerCorrect)
    body.classList.toggle('wrong',   this.answerIsShown && !this.isLastAnswerCorrect)
    body.classList.toggle('answer-is-shown', this.answerIsShown)

		this.hideEverything()

		switch (this.state) {
			case 'intro': 
				intro.classList.add('visible')
				break

			case 'progress': 
				// show current question
				const currentQuestion = document
					.querySelector(gameSelector +	` .question-${ this.currentQuestion }`)
				currentQuestion.classList.add('visible')

				// if answer is shown, show current answer, else hide it
				const currentAnswer = currentQuestion.querySelector('.answer')
				currentAnswer.classList.toggle('visible', this.answerIsShown)

				// show correct or wrong answer
				const currentAnswerCorrect = currentAnswer.querySelector('.correct')
				currentAnswerCorrect.classList.toggle('visible', this.isLastAnswerCorrect)
				const currentAnswerWrong = currentAnswer.querySelector('.wrong')
				currentAnswerWrong.classList.toggle('visible', !this.isLastAnswerCorrect)

				this.updateCounter()
				
				break

			case 'finish': 
				result.classList.add('visible')
				break			
		}
	}


	this.init = () => {
		this.state = 'intro'
		this.currentQuestion = 0
		this.answerIsShown = false
		this.isLastAnswerCorrect = true
		this.correctAnswersCounter = 0
    this.updateView()
	}
	this.init()


	this.start = () => {
		this.state = 'progress'
    this.updateView()
	}


	this.updateResult = () => {
		const result = document.querySelector("#result")
		console.log(result.querySelector(".score-text").innerText)
		//result.querySelector(".correct").innerText = this.correctAnswersCounter
		//result.querySelector(".total").innerText = this.questionCount
		result.querySelector(".score-text").innerText = this.correctAnswersCounter * 100
	}


  this.shuffleAnswers = () => {
    const questions = document
      .querySelectorAll(gameSelector + " .question")

    questions.forEach( question => {
			const correctExplanation = question.querySelector(".explanation.correct")
			const wrongExplanation = question.querySelector(".explanation.wrong")
      if(Math.random() < 0.5) {
        // swap correct and wrong answers
        optionSet = question.querySelector(".optionSet")
        optionSet.appendChild(optionSet.firstElementChild)

        correctExplanation.classList.add('right')
        wrongExplanation.classList.add('left')
      }
      else {
        correctExplanation.classList.add('left')
        wrongExplanation.classList.add('right')
      }
    })
  }


  this.showNextQuestion = () => {
    this.answerIsShown = false
    this.currentQuestion += 1

		if (this.currentQuestion >= this.questionCount) {
			this.updateResult()
			this.state = 'finish'
		}

    this.updateView()
  }


  this.showAnswer = (correctness) => {
    this.answerIsShown = true
		this.isLastAnswerCorrect = correctness
		if (correctness) {
			this.correctAnswersCounter ++
		}
    this.updateView()
  }
}


// https://stackoverflow.com/questions/16863917/check-if-class-exists-somewhere-in-parent-vanilla-js
function ancestorsHaveClass(element, classname) {
    if (element.className.split(' ').indexOf(classname)>=0) return true;
    return element.parentElement && ancestorsHaveClass(element.parentElement, classname);
}


window.addEventListener('load', function () {
	const gameSelector = '#game'
  const game = new Game(gameSelector)
  game.updateView()
  game.shuffleAnswers()
})
