import { useState, useEffect } from 'react'
import './App.css'
import { nanoid } from 'nanoid'
//
function HomeScreen({ flipHomeScreen }) {
  return (
    <button className='homeScreen__button default__button' onClick={flipHomeScreen}>Start Game</button>
  )

}
function ResetGame({ checkAnswers, flipHomeScreen }) {
  const numCorrect = checkAnswers()
  console.log(flipHomeScreen)
  return (
    <>
      <h1>{`Well Done you got ${numCorrect} correct`}</h1>
      <button className='reset__Game--button default__button' onClick={flipHomeScreen}>Play Again?</button>
    </>
  )
}


function Check({ handleCheck }) {
  return (
    <>
      <button className='check__button default__button' onClick={handleCheck}
      >Check Answers</button>
    </>
  )
}

function Card({ question, answers, correctAnswer, setQuestion, usersAnswer, check }) {
  function selectedAnswer(usersAnswer, answer) {
    if (usersAnswer) {
      if (usersAnswer === answer) {
        return 'selected'
      } else {
        return ''
      }
    }
  }

  function answerClass(correctAnswer, usersAnswer, answer) {
    if (usersAnswer) {
      if (usersAnswer == correctAnswer && usersAnswer == answer) return "correct"
      if (usersAnswer !== correctAnswer && usersAnswer == answer) return "incorrect"
      if (answer == correctAnswer) return "correct"
    } else {
      return ''
    }
  }
  return (
    // ${answerClass(correctAnswer, usersAnswer, answer)}
    <>
      <div className='card__container'>
        <h3 className='card__question'>{question}</h3>
        <ul className='card__answer--container'>{answers.map((answer, index) => (
          <li key={nanoid()}>
            <button
              className={`card__answer--button ${check ? answerClass(correctAnswer, usersAnswer, answer) : ''}`}
              onClick={() => { setQuestion(question, answer) }}>
              {answer}
            </button>

          </li>
        ))}</ul>
      </div>
    </>
  )
}

function Game({ flipHomeScreen }) {
  const [questions, setQuestions] = useState({})
  const [check, setCheck] = useState(false)

  console.log(questions)
  // useEffect to get API data and return an object
  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=5&category=22&difficulty=medium&type=multiple')
      .then(res => res.json())
      .then(data => {
        const dataObj = {
          items: data.results.map((item, index) => {
            return {
              key: index,
              question: item.question,
              answers: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5),
              correctAnswer: item.correct_answer,
              usersAnswer: ''
            }
          })
        }
        setQuestions(dataObj)
      })
  }, [])

  function setQuestion(currentQuestion, usersAnswer) {
    // console.log(currentQuestion, usersAnswer)
    let newQuestions = questions.items.map((question) => {
      if (currentQuestion == question.question) {
        // console.log({ ...question, usersAnswer })
        return {
          ...question,
          usersAnswer
        }
      } else {
        return question
      }
    })

    setQuestions({ items: newQuestions });
    console.log(questions)
  }
  function checkAnswers() {
    const correctAnswers = questions.items.map((item) => item.correctAnswer)
    const userAnswers = questions.items.map((item) => item.usersAnswer
    )
    const matching = correctAnswers.filter(item => userAnswers.indexOf(item) !== -1)
    console.log(matching.length)
    return matching.length
  }
  function flipCheck() {
    setCheck(check => !check)
  }
  function handleCheck() {
    checkAnswers()
    flipCheck()
  }
  return (
    <>
      {questions.items?.map((item, index) => (
        // console.log(index),
        < Card
          key={index}
          question={item.question}
          answers={item.answers}
          correctAnswer={item.correctAnswer}
          usersAnswer={item.usersAnswer}
          setQuestion={setQuestion}
        />
      ))}
      {!check ?
        <Check
          handleCheck={handleCheck}
          checkAnswers={checkAnswers} /> :
        <ResetGame
          checkAnswers={checkAnswers}
          flipHomeScreen={flipHomeScreen}
        />}

    </>

  )
}


function App() {
  const [homeScreen, setHomeScreen] = useState(true)
  function flipHomeScreen() {
    setHomeScreen(homeScreen => !homeScreen)
  }
  return (
    <>
      {homeScreen ?
        <HomeScreen flipHomeScreen={flipHomeScreen} /> :
        <Game flipHomeScreen={flipHomeScreen} />

      }
    </>
  )
}

export default App




