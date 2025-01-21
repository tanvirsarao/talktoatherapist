"use client";

import React from "react";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import LandingPage from "./components/LandingPage";

export default function Home() {
    return (
        <DynamicContextProvider
            settings={{
                environmentId: process.env.ENVIRONMENTID,
                walletConnectors: [EthereumWalletConnectors],
            }}
        >
            <LandingPage />
        </DynamicContextProvider>
    );
}