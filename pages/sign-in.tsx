import ButtonLink from "../components/button-link";
import React from 'react';
import { useState } from "react";
import { useRouter } from "next/router";
import { requestAccessToken } from "./api/request-token";
import { setToken, getToken } from "utils/tokenManager";

export default function SignIn() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const handleSubmit = async(e: any) => { //change e type later
        e.preventDefault();

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok){
                console.log('Signed in');
                requestAccessToken()
                .then((token) => {
                    setToken(token ?? "");
                    console.log('token: ', token);
                })
                .catch((error) => {
                    console.error('Error:', error)
                })
                router.push('/feed');
            } else {
                console.error('Sign-in Error:', response.statusText);
            }
        } catch (error){
            console.error('Sign-in Error:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    return (
        <>
            <h1 className="text-4xl my-4">Sign in</h1>

            <form className="mt-8" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block">
                        Username:
                    </label>
                    <input 
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="rounded-sm border-gray-300 border-2" 
                        type="text" 
                        required autoFocus 
                    />
                </div>

                <div className="my-4">
                    <label className="block">
                        Password:
                    </label>
                    <input 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="rounded-sm border-gray-300 border-2" 
                        type="password" 
                        required 
                    />
                </div>
                <button type="submit">
                    Sign In
                </button>
            </form>
        </>
    );
}
