import React from "react";
import { Container } from "@chakra-ui/react";
export default function main({ children }: {children: React.ReactNode}) {
    return <main className="w-screen bg-bg">{children}</main>
}