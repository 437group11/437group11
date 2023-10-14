'use client';
import RootLayout from "../components/root-layout";
import ButtonLink from "../components/button-link";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log(formData)
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok){
                router.push('/feed');
            }
            else {
                console.error('Registration error:', response.statusText);
            }
        } catch (error) {
            console.error('Registration error:', error);
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
        <RootLayout>
            <h1 className="text-4xl my-4">Create an account</h1>

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
                        Email:
                    </label>
                    <input 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="rounded-sm border-gray-300 border-2" 
                        type="text" 
                        required 
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
                <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">
                    Sign Up
                </button>
                </form>
        </RootLayout>
    )
}
