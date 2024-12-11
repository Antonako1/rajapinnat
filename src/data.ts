export const Difficulties = ['easy', 'medium', 'hard', 'any'];

export const Types = ['multiple', 'boolean', 'any'];

export interface Question {
    type: string;
    difficulty: string;
    category: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export interface Category {
    id: number;
    name: string;
}

export enum States {
    Answering,
    Menu,
    QuizDone
}
