import styles from './styles/App.module.css'
import { useEffect, useState } from 'react'
import { Category, Difficulties, Question, States, Types } from './data'
import InnerMenu from './modules/inner_main'
import Card from './modules/card'
import Button from './modules/button'

function App() {
	const [loading, setLoading] = useState<boolean>(true)
	const [loadingText, setLoadingText] = useState<string>('Loading...')

	const [state, setState] = useState<States>(States.Menu)

	const [categories, setCategories] = useState<Category[] | null>([])
	const [questions, setQuestions] = useState<Question[] | null>([])

	const [selectedCategory, setSelectedCategory] = useState<string>('')
	const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10)
	const [selectedDifficulty, setSelectedDifficulty] = useState<string>(Difficulties[Difficulties.length - 1])
	const [selectedType, setSelectedType] = useState<string>(Types[Types.length - 1]);



	const [correctAnswers, setCorrectAnswers] = useState<number>(0)
	const [answersMade, setAnswersMade] = useState<number>(0)
	const [currentQuestion, setCurrentQuestion] = useState<number>(0)
	


	const FetchCategories = async () => {
		setLoading(true)
		setLoadingText('Loading categories...')

		const results = await fetch(
			"https://opentdb.com/api_category.php"
		)
		const data = await results.json()
		setCategories([{ id: -1, name: 'Any' }, ...data.trivia_categories])
		setLoading(false)
	}
	const FetchQuestions = async () => {
		setLoading(true)
		setLoadingText('Loading questions...')

		const _numberOfQuestions = numberOfQuestions < 1 ? 1 : numberOfQuestions > 50 ? 50 : numberOfQuestions
		const _selectedCategory = selectedCategory === '' ? 'any' : selectedCategory
		const _selectDifficulty = selectedDifficulty === 'any' ? '' : selectedDifficulty
		const _selectedType = selectedType === 'any' ? '' : selectedType
		let _fetchUrl = "https://opentdb.com/api.php?amount=" + _numberOfQuestions
		if(_selectedCategory !== 'any') _fetchUrl += "&category=" + _selectedCategory
		if(_selectDifficulty !== '') _fetchUrl += "&difficulty=" + _selectDifficulty
		if(_selectedType !== '') _fetchUrl += "&type=" + _selectedType
		const results = await fetch(_fetchUrl);
		const data = await results.json()
		setQuestions(data.results)
		setLoading(false)
	}
	useEffect(() => {
		FetchCategories();
	}, [])


	const StartQuiz = () => {
		FetchQuestions();
		setCorrectAnswers(0)
		setAnswersMade(0)
		setState(States.Answering)
	}


	if(loading) return <h2>{loadingText}</h2>
	return (
		<div className='MainDiv'>
			<h1>Quiz app</h1>
			{
				state === States.Menu || state === States.QuizDone? (
					<>
						{
							state === States.QuizDone ? (
								<h2>You have answered {correctAnswers} out of {answersMade} questions correctly</h2>
							):(
								<></>
							)
						}
						<InnerMenu 
							props={{
								categories: categories,
								selectedCategory: selectedCategory,
								setSelectedCategory: setSelectedCategory,
								numberOfQuestions: numberOfQuestions,
								setNumberOfQuestions: setNumberOfQuestions,
								selectedDifficulty: selectedDifficulty,
								setSelectedDifficulty: setSelectedDifficulty,
								selectedType: selectedType,
								setSelectedType: setSelectedType,
								StartQuiz: StartQuiz
							}}
						/>
					</>
				):(
					<div className="QuizMain">
					<h1>Start answering</h1>
					{questions?.map((question, index: number) =>
						index === currentQuestion ? (
							<Card
								key={index}
								props={{
									title: "Question " + (index + 1),
									data: question,
									index: index,
									setStates: setState,
									setCorrectAnswers: setCorrectAnswers, // Pass the state update function to Card
									setAnswersMade: setAnswersMade
								}}
							/>

						) : (
							<></>
						)
					)}
					<Button
						props={{
							text: "Next question",
							onClick: () => {
								if(questions==null) return;
								if(currentQuestion+1 == answersMade)
								if (currentQuestion < questions?.length - 1) {
									setCurrentQuestion(currentQuestion + 1);
								} else {
									// If it is the last question, finish the quiz
									setState(States.QuizDone);
								}
							},
							className: "",
						}}
					/>

				</div>

				)
			}
		</div>
	)
}

export default App
