import { describe, expect, it } from "vitest";
import { runBondOrder } from "./tool.js";

describe("Bond Order Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runBondOrder({ antibondingElectrons: 4, bondingElectrons: 10 }),
    ).toEqual({ ok: true, output: { bondOrder: 3 } });
  });

  it("rejects invalid input", () => expect(runBondOrder(null).ok).toBe(false));
});
