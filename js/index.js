function Game() {
  this.currentQuestion = 0
  this.answerIsShown = false

  this.updateView = () => {
    var questions = document
      .querySelectorAll(".question.visible")

    for (i = 0; i < questions.length; i++) {
      questions[i].classList.remove('visible')
    }
      
    var currentQuestion = document
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

  this.goOn = () => {
    if(this.answerIsShown) {
      this.answerIsShown = false
      this.currentQuestion += 1
    }
    else {
      this.answerIsShown = true
    }
    this.updateView()
  }
}


window.addEventListener('load', function () {
  game = new Game()
  game.updateView()

  document.querySelectorAll('.option, .next').forEach(e => {
    e.onclick = () => {
      game.goOn()
    }
  })
  //document.querySelectorAll('.next').onclick = () => {
    //game.goOn()
  //}
})
