import {useState} from "react";
import FormInput from "./FormInput";

interface LoginFormProps {
    onSubmit: (username: string, password: string, rememberMe: boolean) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(username, password, rememberMe);
    };

    return (
        <form onSubmit={handleLogin} className="flex flex-col gap-4 items-center sm:items-start w-full max-w-md">
            <FormInput
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
            />
            <FormInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
            />

            <div className="flex justify-between w-full items-center">
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="rounded"
                    />
                    Remember Me
                </label>
                <a href="#" className="text-blue-500 hover:underline text-sm">
                    Forgot Password?
                </a>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            >
                Login
            </button>
        </form>
    );
};

export default LoginForm;
