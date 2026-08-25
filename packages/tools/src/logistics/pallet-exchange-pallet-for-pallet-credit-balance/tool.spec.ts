import { describe, expect, it } from "vitest";
import {
  palletExchangePalletForPalletCreditBalanceExample,
  runPalletExchangePalletForPalletCreditBalance,
} from "./tool.js";

describe("logistics/pallet-exchange-pallet-for-pallet-credit-balance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPalletExchangePalletForPalletCreditBalance(
        palletExchangePalletForPalletCreditBalanceExample.input,
      ),
    ).toEqual({
      ok: true,
      output: palletExchangePalletForPalletCreditBalanceExample.output,
    });
  });

  it("flips direction when more pallets come back than went out", () => {
    const result = runPalletExchangePalletForPalletCreditBalance({
      creditValuePerPallet: 10,
      palletsIssued: 12,
      palletsReturned: 15,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.settlementDirection).toBe("issuer_owes_pallets");
    expect(result.output.creditBalanceValue as number).toBe(-30);
  });

  it("rejects non-positive credit values", () => {
    expect(
      runPalletExchangePalletForPalletCreditBalance({
        creditValuePerPallet: 0,
        palletsIssued: 1,
        palletsReturned: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects fractional pallet counts", () => {
    expect(
      runPalletExchangePalletForPalletCreditBalance({
        creditValuePerPallet: 10,
        palletsIssued: 1.5,
        palletsReturned: 1,
      }).ok,
    ).toBe(false);
  });
});
