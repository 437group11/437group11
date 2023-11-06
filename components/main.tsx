import React from "react";
import { Container } from "@chakra-ui/react";
export default function main({ children }: {children: React.ReactNode}) {
    // overflow-auto prevents main from being pushed down when margins are applied
    // https://stackoverflow.com/a/2890369
    return <main className="w-screen min-h-screen bg-bg overflow-auto">{children}</main>
}