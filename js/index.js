function Game() {
	this.state = 'intro' // intro, progress, finish
	this.questionCount = document.querySelectorAll("#game .optionSet").length


	this.updateProgress = (isVisible) => {
		const progress = document.querySelector(".progress")
		progress.innerHTML = ''

		if (! isVisible) return

		let index = 0
		for (q of this.questionsCorrectness) {
			progress.innerHTML += `<div class='${ q? 'correct' : 'wrong' }'></div>`
			index ++
		}
		for (; index < this.questionCount; index ++) {
			progress.innerHTML += `<div class='empty'></div>`
		}
	}


  this.updateView = () => {

		let intro = document.querySelector("#game #intro")
		intro.classList.toggle('visible',	this.state == 'intro')

		const result = document.querySelector("#result")
		result.classList.toggle('visible', this.state == 'finish')

		// hide all questions
		const questions = document
			.querySelectorAll("#game .question.visible")

		for (let i = 0; i < questions.length; i++) {
			questions[i].classList.remove('visible')
		}

		this.updateProgress(this.state != 'intro')

		if (this.state != 'progress') return

      
    const currentQuestion = document
      .querySelector(`#game .question-${ this.currentQuestion }`)

    currentQuestion.classList.add('visible')

    currentQuestion.querySelector('#game .answer')
      .classList.toggle('visible', this.answerIsShown)
    currentQuestion.querySelector('#game .answer .correct').classList.toggle('visible', this.isLastAnswerCorrect)
    currentQuestion.querySelector('#game .answer .wrong').classList.toggle('visible', !this.isLastAnswerCorrect)
  }


	this.init = () => {
		this.state = 'intro'
		this.currentQuestion = 0
		this.answerIsShown = false
		this.isLastAnswerCorrect = true
		this.questionsCorrectness = []
    this.updateView()
	}
	this.init()


	this.start = () => {
		this.state = 'progress'
    this.updateView()
	}


	this.countCorrect = () => {
		let sum = 0
		for (let q of this.questionsCorrectness)
			sum += q
		return sum
	}


	this.updateResult = () => {
		const result = document.querySelector("#result")
		result.querySelector(".correct").innerText = this.countCorrect()
		result.querySelector(".total").innerText = this.questionCount
	}


  this.shuffleAnswers = () => {
    const optionSets = document
      .querySelectorAll("#game .optionSet")

    optionSets.forEach( optionSet => {
      if(Math.random() < 0.5) {
        optionSet.appendChild(optionSet.firstElementChild)
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
		this.questionsCorrectness.push(correctness)
    this.updateView()
  }
}


window.addEventListener('load', function () {
  game = new Game()
  game.updateView()
  game.shuffleAnswers()

  document.querySelector('#game').onclick = (event) => {
    const classList = event.target.classList

		if (classList.contains('start')) {
			game.start()
			return
		}

		if (classList.contains('restart')) {
			game.init()
			return
		}

		if (! game.answerIsShown) {
			if(classList.contains('option-correct')) {
				game.showAnswer(true)
			}
			if(classList.contains('option-wrong')) {
				game.showAnswer(false)
			}
			return
		}
		if(classList.contains('next')) {
			game.showNextQuestion()
			return
		}
  }
})
