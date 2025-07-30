import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { Link } from "react-router-dom";
import { useLoader } from "../../contexts/LoadingContext";

export default function VerifyEmail() {
    const [verified, setVerified] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState(""); // "success" or "error"

    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token");

        if (!token) {
            setMessage("Token missing or invalid.");
            setType("error");
            return;
        }

        const verify = async () => {
            try {
                showLoader();
                const res = await axios.get(`${BASE_URL}/verifyemail?token=${token}`);
                if (res.data.status) {
                    setVerified(true);
                    setMessage("Your email has been verified!");
                    setType("success");
                } else {
                    setMessage("Verification failed or token expired.");
                    setType("error");
                }
            } catch (err) {
                setMessage("Server error. Please try again later.");
                setType("error");
            } finally {
                hideLoader();
            }
        };

        verify();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            {message && (
                <div
                    className={`mb-6 px-4 py-2 rounded text-center text-lg ${type === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                >
                    {message}
                </div>
            )}

            {verified && (
                <Link to="/login">
                    <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded transition">
                        Go to Login
                    </button>
                </Link>
            )}
        </div>
    );
}
