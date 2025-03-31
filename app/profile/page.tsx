//
// 'use client'
// // pages/profilepage1.tsx
//
// import { useEffect, useState } from 'react';
// import React from "react";
//
// import Image from "next/image";
//
// const ProfilePage = () => {
//     const [profile, setProfile] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//
//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const response = await axios.get('/api/profile');
//                 setProfile(response.data);
//             } catch (err) {
//                 setError(err.response?.data?.message || 'Error fetching profile');
//             } finally {
//                 setLoading(false);
//
//             }
//         };
//
//         fetchProfile();
//     }, []);
//
//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>{error}</p>;
//
//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
//             <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800 dark:text-white">
//                 {/* Profile Image */}
//                 <div className="flex justify-center">
//
//                         <Image src={user.image} alt="Profile Picture" className="w-32 h-32 rounded-full object-cover" width={500} height={500}/>
//
//
//                 </div>
//
//                 {/* User Info */}
//                 <div className="text-center mt-4">
//                 <h1 className="text-2xl font-bold">{user.name}</h1>
//                     <p className="text-sm text-gray-500">{user.email}</p>
//                     <p className="text-sm text-gray-500">{user.phone}</p>
//                     <p className="text-sm text-gray-500">{user.address}</p>
//                 </div>
//
//                 {/* User Bio */}
//                 <div className="mt-6">
//                     <h2 className="text-xl font-semibold">Bio</h2>
//                     <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{user.bio}</p>
//                 </div>
//
//                 {/* Edit Button */}
//                 <div className="mt-6 flex justify-center">
//                     <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
//                         Edit Profile
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default ProfilePage;
