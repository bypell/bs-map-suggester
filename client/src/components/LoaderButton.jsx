import Button from "./common/Button";

export default function LoaderButton({ text, onClick, disabled }) {
    return (
        <Button className="h-12 ml-2 px-6" disabled={disabled} text={text} onClick={onClick} />
    );
}