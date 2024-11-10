import {
  listCV,
  principalCV,
  TransactionVersion,
  trueCV,
} from "@stacks/transactions";
import { describe, expect, it } from "vitest";
import _ from "lodash";
import {
  generateWallet,
  generateSecretKey,
  generateNewAccount,
  getStxAddress,
} from "@stacks/wallet-sdk";

const accounts = simnet.getAccounts();
const caller = accounts.get("wallet_1")!;

const password = "password";
const secretKey = generateSecretKey();

let wallet = await generateWallet({
  secretKey,
  password,
});

_.range(14994).forEach(() => {
  wallet = generateNewAccount(wallet);
});

const airdrop1 = _.slice(wallet.accounts, 0, 7000).map((account) =>
  principalCV(
    getStxAddress({
      account,
      transactionVersion: TransactionVersion.Testnet,
    })
  )
);

const airdrop2 = _.slice(wallet.accounts, 0, 7000).map((account) =>
  principalCV(
    getStxAddress({
      account,
      transactionVersion: TransactionVersion.Testnet,
    })
  )
);

const airdrop3 = _.slice(wallet.accounts, 14000, 14995).map((account) =>
  principalCV(
    getStxAddress({
      account,
      transactionVersion: TransactionVersion.Testnet,
    })
  )
);

describe("airdrop", () => {
  describe("multi-mint", () => {
    it("mints 14995 NFTs", () => {
      const { result, events } = simnet.callPublicFn(
        "nft",
        "multi-mint",
        [listCV(airdrop1), listCV(airdrop2), listCV(airdrop3)],
        caller
      );

      expect(result).toBeOk(trueCV());
      expect(events.length).toBe(14995);
    });
  });
});
