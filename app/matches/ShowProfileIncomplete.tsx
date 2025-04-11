import {router} from "next/client";


export default function ShowProfileIncomplete(){

        return (
            <div className="flex items-center justify-center h-screen p-4">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">Complete Your Profile</h1>
                    <p className="text-gray-500 mt-2">You haven&#39;t created a profile yet</p>
                </div>
                <button
                    className="px-4 py-2 bg-purple-600 text-white rounded-md"
                    onClick={() => router.push('/profile')}
                >
                    Create Profile
                </button>
            </div>
        );
}