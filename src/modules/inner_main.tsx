import { Category, Difficulties, Types } from "../data";
import Select from "./select";

interface InnerMenuProps {
    props: {
        categories: Category[] | null;
        selectedCategory: string;
        setSelectedCategory: (category: string) => void;
        numberOfQuestions: number;
        setNumberOfQuestions: (number: number) => void;
        selectedDifficulty: string;
        setSelectedDifficulty: (difficulty: string) => void;
        selectedType: string;
        setSelectedType: (type: string) => void;
        StartQuiz: () => void;
    }
}

const InnerMenu = ({props}: InnerMenuProps) => {
    return (
        <div className='InnerMain'>
            <Select
                props={{
                    options: props.categories?.map((category) => category.name) || [],
                    value: props.selectedCategory,
                    onChange: (e) => props.setSelectedCategory(e.target.value),
                    labelTitle: 'Select a category'
                }}
            />
            <input 
                type="number"
                placeholder="Number of questions"
                min={1}
                max={50}
                onChange={(e) => props.setNumberOfQuestions(parseInt(e.target.value))}
            />
            <Select 
                props = {{
                    options: Difficulties,
                    value: props.selectedDifficulty,
                    onChange: (e) => props.setSelectedDifficulty(e.target.value),
                    labelTitle: 'Select a difficulty'
                }}
            />

            <Select 
                props = {{
                    options: Types,
                    value: props.selectedType,
                    onChange: (e) => props.setSelectedType(e.target.value),
                    labelTitle: 'Select a type'
                }}
            />

            <button onClick={props.StartQuiz}>Start quiz</button>
        </div>
    )
}

export default InnerMenu