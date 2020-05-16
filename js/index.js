function Game() {
  this.currentQuestion = 0
  this.answerIsShown = false

  this.updateView = () => {
    const questions = document
      .querySelectorAll(".question.visible")

    for (let i = 0; i < questions.length; i++) {
      questions[i].classList.remove('visible')
    }
      
    const currentQuestion = document
      .querySelector(`.question-${ this.currentQuestion }`)

    currentQuestion.classList.add('visible')

    if (this.answerIsShown) {
      currentQuestion.querySelector('.answer')
        .classList.add('visible')
    }
    else {
      currentQuestion.querySelector('.answer')
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
