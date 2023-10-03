import React from "react";
import Link from "next/link";

export default function ButtonLink({ children, href }: { children: React.ReactNode, href: string }) {
    return (
        <Link href={href} className="text-white bg-accent-brown hover:bg-accent-brown-darker focus:ring-4 focus:ring-accent-blue font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">
            {children}
        </Link>
    )
}
