import { describe, expect, it } from "vitest";
import { runOxidationNumber } from "./tool.js";

describe("Oxidation Number Calculator", () => {
  it("solves for the unknown oxidation state", () => {
    expect(
      runOxidationNumber({
        compoundCharge: -2,
        knownElementCount: 4,
        knownOxidationState: -2,
        unknownElementCount: 1,
      }),
    ).toEqual({ ok: true, output: { unknownOxidationState: 6 } });
  });

  it("rejects invalid input", () =>
    expect(runOxidationNumber(null).ok).toBe(false));
});
