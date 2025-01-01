import { Link } from "react-router-dom";
import Button from "../common/Button";

function ErrorPage() {
    return (
        <div className="h-screen w-screen relative bg-dark text-white flex flex-col justify-center items-center font-mono">
            <p>Error</p>
            <Link to="/bs-map-suggester/">
                <Button text="Bring me home" className="h-12 mt-4 ml-2 px-6" />
            </Link>
        </div>
    );
}

export default ErrorPage;