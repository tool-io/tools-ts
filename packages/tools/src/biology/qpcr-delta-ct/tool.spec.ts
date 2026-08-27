import { describe, expect, it } from "vitest";
import { runQpcrDeltaCt } from "./tool.js";

describe("Delta CT", () => {
  it("calculates a valid result", () =>
    expect(runQpcrDeltaCt({ ctTarget: 25, ctReference: 22 })).toEqual({
      ok: true,
      output: { deltaCt: 3 },
    }));
  it("returns negative deltas when target amplifies earlier", () =>
    expect(runQpcrDeltaCt({ ctTarget: 20, ctReference: 26 })).toEqual({
      ok: true,
      output: { deltaCt: -6 },
    }));
  it("returns zero for equal Ct values", () =>
    expect(runQpcrDeltaCt({ ctTarget: 30, ctReference: 30 })).toEqual({
      ok: true,
      output: { deltaCt: 0 },
    }));
  it("supports fractional Ct values", () =>
    expect(runQpcrDeltaCt({ ctTarget: 24.5, ctReference: 22.2 })).toEqual({
      ok: true,
      output: { deltaCt: 2.3000000000000007 },
    }));
  it("rejects non-finite input", () =>
    expect(runQpcrDeltaCt({ ctTarget: Number.NaN, ctReference: 22 }).ok).toBe(
      false,
    ));
});
