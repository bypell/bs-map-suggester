import Button from "./common/Button";

export default function LoaderButton({ text, onClick, disabled }) {
    return (
        <Button className="h-12 md:ml-2 px-6 w-80" disabled={disabled} text={text} onClick={onClick} />
    );
}