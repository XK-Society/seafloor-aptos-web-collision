// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const LocalStorageKeys = {
  keylessAccounts: "@aptos-connect/keyless-accounts",
};

export const testnetClient = new Aptos(
  new AptosConfig({ network: Network.TESTNET })
);

// Now TypeScript should recognize this without errors
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;

// It's a good practice to throw an error if the Client ID is missing
if (!GOOGLE_CLIENT_ID) {
  throw new Error("VITE_REACT_APP_GOOGLE_CLIENT_ID is not defined in environment variables");
}
