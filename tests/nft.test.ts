import { principalCV, trueCV, uintCV } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const caller = accounts.get("wallet_1")!;
const deployer = accounts.get("deployer")!;

describe("airdrop", () => {
  describe("multi-mint", () => {
    it("mints 14995 NFTs", () => {
      const { result, events } = simnet.callPublicFn(
        "nft",
        "multi-mint",
        [],
        caller
      );

      expect(result).toBeOk(trueCV());
      expect(events.length).toBe(14995);
    });

    it("correctly assigns ids", () => {
      simnet.callPublicFn("nft", "mint", [principalCV(caller)], deployer);
      simnet.callPublicFn("nft", "mint", [principalCV(caller)], deployer);
      expect(
        simnet.callReadOnlyFn("nft", "get-last-token-id", [], caller).result
      ).toBeOk(uintCV(2));
      const { events } = simnet.callPublicFn("nft", "multi-mint", [], caller);
      const { result } = simnet.callReadOnlyFn(
        "nft",
        "get-last-token-id",
        [],
        caller
      );
      expect(result).toBeOk(uintCV(14997));
      expect(events.length).toBe(14995);
    });
  });
});
