import { describe, expect, it } from "vitest";
import { runPcrYield } from "./tool.js";

describe("PCR Yield Estimate", () => {
  it("calculates a valid result with perfect doubling", () =>
    expect(runPcrYield({ startingCopies: 10, cycles: 10 })).toEqual({
      ok: true,
      output: { finalCopyCount: 10240 },
    }));
  it("keeps copies flat at efficiency one", () =>
    expect(
      runPcrYield({ startingCopies: 10, cycles: 8, efficiencyFactor: 1 }),
    ).toEqual({
      ok: true,
      output: { finalCopyCount: 10 },
    }));
  it("compounds partial efficiency factors", () =>
    expect(
      runPcrYield({ startingCopies: 10, cycles: 5, efficiencyFactor: 1.5 }),
    ).toEqual({
      ok: true,
      output: { finalCopyCount: 75.9375 },
    }));
  it("supports fractional starting copies", () =>
    expect(runPcrYield({ startingCopies: 0.5, cycles: 1 })).toEqual({
      ok: true,
      output: { finalCopyCount: 1 },
    }));
  it("rejects non-positive starting copies", () =>
    expect(runPcrYield({ startingCopies: 0, cycles: 5 }).ok).toBe(false));
  it("rejects zero cycles", () =>
    expect(runPcrYield({ startingCopies: 10, cycles: 0 }).ok).toBe(false));
  it("rejects more than sixty cycles", () =>
    expect(runPcrYield({ startingCopies: 10, cycles: 61 }).ok).toBe(false));
  it("rejects efficiency above two", () =>
    expect(
      runPcrYield({ startingCopies: 10, cycles: 5, efficiencyFactor: 2.5 }).ok,
    ).toBe(false));
});
