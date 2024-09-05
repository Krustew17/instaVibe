import { useNavigate } from "react-router-dom";

const SessionExpired = ({ onHide }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        onHide();
        navigate("/login");
    };

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-80">
            <h1 className="text-white text-3xl font-bold mb-4">
                Session Expired
            </h1>
            <p className="text-white text-lg">Please login to continue</p>
            <button
                className="bg-blue-500 text-white mt-4 px-6 py-2 rounded-lg"
                onClick={handleClick}
            >
                Login
            </button>
        </div>
    );
};

export default SessionExpired;
