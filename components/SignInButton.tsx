interface SignInButtonProps {
    onClick: () => void;
}

const SignInButton = ({ onClick }: SignInButtonProps) => (
    <button
        onClick={onClick}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
    >
        Sign in with Google
    </button>
);

export default SignInButton;
