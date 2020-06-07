function Game() {
	this.state = 'intro' // intro, progress, finish
	this.questionCount = document.querySelectorAll("#game .optionSet").length


	this.updateProgress = (isVisible) => {
		//const progress = document.querySelector(".progress")
    //progress.innerHTML = ''
		const counter = document.querySelector(".counter")
		counter.innerHTML = `${ this.questionsCorrectness.filter(d => d).length }/${ this.questionsCorrectness.length }`

		//if (! isVisible) return

		//let index = 0
		//for (q of this.questionsCorrectness) {
			//progress.innerHTML += `<div class='${ q? 'correct' : 'wrong' }'></div>`
			//index ++
		//}
		//for (; index < this.questionCount; index ++) {
			//progress.innerHTML += `<div class='empty'></div>`
		//}
	}


  this.updateView = () => {
    let body = document.querySelector('body')
    body.classList.toggle('correct', this.answerIsShown &&  this.isLastAnswerCorrect)
    body.classList.toggle('wrong',   this.answerIsShown && !this.isLastAnswerCorrect)
    body.classList.toggle('answer-is-shown', this.answerIsShown)

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
    const questions = document
      .querySelectorAll("#game .question")

    questions.forEach( question => {
      if(Math.random() < 0.5) {
        // swap correct and wrong answers
        optionSet = question.querySelector(".optionSet")
        optionSet.appendChild(optionSet.firstElementChild)
        //question.querySelector(".explanation.correct").classList.remove('right')
        //question.querySelector(".explanation.wrong").classList.remove('left')
        question.querySelector(".explanation.correct").classList.add('right')
        question.querySelector(".explanation.wrong").classList.add('left')
      }
      else {
        //question.querySelector(".explanation.correct").classList.remove('right')
        //question.querySelector(".explanation.wrong").classList.remove('left')
        question.querySelector(".explanation.correct").classList.add('left')
        question.querySelector(".explanation.wrong").classList.add('right')
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


// https://stackoverflow.com/questions/16863917/check-if-class-exists-somewhere-in-parent-vanilla-js
function ancestorsHaveClass(element, classname) {
    if (element.className.split(' ').indexOf(classname)>=0) return true;
    return element.parentElement && ancestorsHaveClass(element.parentElement, classname);
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
    else {
      if ( ancestorsHaveClass(event.target, 'next') || ancestorsHaveClass(event.target, 'question') ) {
        game.showNextQuestion()
        return
      }
    }

  }
})
