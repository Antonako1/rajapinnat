interface selectProps {
    props: {
        options: string[];
        value: string;
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
        labelTitle: string;
    }
}

const Select = ({props}: selectProps) => {
    return (
        <div className="select">
            <label>{props.labelTitle}</label>
            <select value={props.value} onChange={props.onChange}>
                {props.options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
        </div>
    )
}

export default Select;