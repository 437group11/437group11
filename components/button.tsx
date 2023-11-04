import React from "react";

export default function Button({ children, type }: { children: React.ReactNode, type: any }) {
    return (
        <button type={type} className="p-4 bg-header text-white py-2 rounded-md hover:bg-accent-brown-darker focus:outline-none focus:ring-4 focus:ring-accent-blue">
            {children}
        </button>
    )
}
