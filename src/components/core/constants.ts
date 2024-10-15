// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const LocalStorageKeys = {
  keylessAccounts: "@aptos-connect/keyless-accounts",
};

export const testnetClient = new Aptos(
  new AptosConfig({ network: Network.TESTNET })
);

/// FIXME: Put your client id here
export const GOOGLE_CLIENT_ID = "698372493668-vaeh7u9jdgnjsvu1o67sp7lqld2e819t.apps.googleusercontent.com";
