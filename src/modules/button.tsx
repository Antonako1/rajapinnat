interface buttonProps {
    props: {
        onClick: () => void;
        text: string;
        className: string;
    }
}

const Button = ({ props }: buttonProps) => {
    return (
        <button onClick={props.onClick} className={props.className}>
            {props.text}
        </button>
    )
}

export default Button;