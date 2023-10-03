import React from "react";
export default function main({ children }: {children: React.ReactNode}) {
    return <main className="max-w-4xl p-8">{children}</main>
}