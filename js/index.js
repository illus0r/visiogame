function Game() {
  this.currentQuestion = 0
  this.answerIsShown = false

  this.shuffleAnswers = () => {
    const optionSets = document
      .querySelectorAll("#game .optionSet")

    optionSets.forEach( optionSet => {
      if(Math.random() < 0.5) {
        optionSet.appendChild(optionSet.firstElementChild)
      }
    })
  }

  this.updateView = () => {
    const questions = document
      .querySelectorAll("#game .question.visible")

    for (let i = 0; i < questions.length; i++) {
      questions[i].classList.remove('visible')
    }
      
    const currentQuestion = document
      .querySelector(`#game .question-${ this.currentQuestion }`)

    currentQuestion.classList.add('visible')

    if (this.answerIsShown) {
      currentQuestion.querySelector('#game .answer')
        .classList.add('visible')
    }
    else {
      currentQuestion.querySelector('#game .answer')
        .classList.remove('visible')
    }
  }

  this.showNextQuestion = () => {
    this.answerIsShown = false
    this.currentQuestion += 1
    this.updateView()
  }

  this.showAnswer = () => {
    this.answerIsShown = true
    this.updateView()
  }
}


window.addEventListener('load', function () {
  game = new Game()
  game.updateView()
  game.shuffleAnswers()

  document.querySelector('#game').onclick = (event) => {
    const classList = event.target.classList

    if(classList.contains('option')) {
      game.showAnswer()
    }
    else if(classList.contains('next')) {
      game.showNextQuestion()
    }
  }
})
