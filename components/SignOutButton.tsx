import { signOut } from "next-auth/react";

const SignOutButton = () => (
    <button
        onClick={() => signOut()}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
    >
        Sign Out
    </button>
);

export default SignOutButton;
