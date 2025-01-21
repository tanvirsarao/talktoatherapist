"use client";

import React from "react";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import HomeContent from "../components/HomeContent";

export default function TherapistPage() {
    return (
        <DynamicContextProvider
            settings={{
                environmentId: process.env.ENVIRONMENTID,
                walletConnectors: [EthereumWalletConnectors],
            }}
        >
            <HomeContent />
        </DynamicContextProvider>
    );
}