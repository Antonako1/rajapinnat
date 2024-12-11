import { useEffect, useState } from "react";
import { Question, States } from "../data";

interface CardProps {
    props: {
        title: string;
        data: Question;
        index: number;
        setStates: (state: States) => void;
        setCorrectAnswers: (correctAnswers: number) => void;
        setAnswersMade: (answered: number) => void;
    };
}

const decodeHtml = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

const MAX_SECONDS = 10;

const IDs:number[] = [];

const Card = ({ props }: CardProps) => {
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [answered, setAnswered] = useState<boolean>(false);
    const [correctAnswer, setCorrectAnswer] = useState<boolean>(false);
    const [answers, setAnswers] = useState<string[]>([]);
    const handleAnswer = (answer: string) => {
        const isCorrect = answer === props.data.correct_answer;
        if (isCorrect) {
            props.setCorrectAnswers((prevCorrectAnswers:number) => prevCorrectAnswers + 1);
            setCorrectAnswer(true);
        }
        props.setAnswersMade((prevAnswersMade:number) => prevAnswersMade + 1);
        setAnswered(true);  // Mark question as answered
        for(let i = 0; i < IDs.length; i++){
            clearInterval(IDs[i]);
        }
      };
      
    IDs[IDs.length+1] = setInterval(() => {
        if(currentTime !== MAX_SECONDS){
            setCurrentTime(currentTime + 1);
        }
    }, 1000);

    useEffect(() => {
        const answers = [...props.data.incorrect_answers, props.data.correct_answer];
        answers.sort(() => Math.random() - 0.5);
        setAnswers(answers);
        setAnswered(false);
        setCorrectAnswer(false);
    }, [props.data]);

    useEffect(() => {
        if(currentTime == MAX_SECONDS){
            setAnswered(true);
            props.setAnswersMade((prevAnswersMade:number) => prevAnswersMade + 1);
            for(let i = 0; i < IDs.length; i++){
                clearInterval(IDs[i]);
            }
        }
        
    }, [currentTime]);
    

    return (
        <div className="card">
            <h1>Time limit: {currentTime}s/{MAX_SECONDS}</h1>
            <h1>{props.title}</h1>
            <h2>Category: "{props.data.category}"</h2>
            <h2>Difficulty: {props.data.difficulty}</h2>
            <h2>Type: {props.data.type}</h2>
            <h2>{decodeHtml(props.data.question)}</h2>

            {answered ? (
                <>
                    <h3 style={{ color: correctAnswer ? "green" : "red" }}>
                        Correct answer: {props.data.correct_answer}
                    </h3>
                </>
            ) : (
                <div>
                    <h3>Choose answer</h3>
                    {props.data.type === "boolean" ? (
                        <div className="answers">
                            <button onClick={() => handleAnswer("True")}>True</button>
                            <button onClick={() => handleAnswer("False")}>False</button>
                        </div>
                    ) : (
                        <div className="answers">
                            {answers.map((answer, index) => (
                                <button key={index} onClick={() => handleAnswer(answer)}>
                                    {answer}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Card;
