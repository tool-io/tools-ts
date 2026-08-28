import { describe, expect, it } from "vitest";
import { runChargeBalance } from "./tool.js";

describe("Charge Balance Checker", () => {
  it("detects a balanced solution", () => {
    expect(
      runChargeBalance({
        anionCharges: [-2, -1],
        cationCharges: [1, 1, 1],
      }),
    ).toEqual({ ok: true, output: { balanced: true, netCharge: 0 } });
  });

  it("detects imbalance", () => {
    const result = runChargeBalance({
      anionCharges: [-2],
      cationCharges: [1],
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.balanced).toBe(false);
    expect(result.output.netCharge).toBe(-1);
  });

  it("rejects invalid input", () =>
    expect(runChargeBalance(null).ok).toBe(false));
});
