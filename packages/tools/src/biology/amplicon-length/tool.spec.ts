import { describe, expect, it } from "vitest";
import { runAmpliconLength } from "./tool.js";

describe("Amplicon Length", () => {
  it("calculates a valid result", () =>
    expect(
      runAmpliconLength({ forwardPositionBp: 100, reversePositionBp: 520 }),
    ).toEqual({
      ok: true,
      output: { ampliconLengthBp: 421 },
    }));
  it("is independent of primer order", () =>
    expect(
      runAmpliconLength({ forwardPositionBp: 520, reversePositionBp: 100 }),
    ).toEqual({
      ok: true,
      output: { ampliconLengthBp: 421 },
    }));
  it("counts adjacent positions as two bases", () =>
    expect(
      runAmpliconLength({ forwardPositionBp: 11, reversePositionBp: 10 }),
    ).toEqual({
      ok: true,
      output: { ampliconLengthBp: 2 },
    }));
  it("returns one base when positions coincide", () =>
    expect(
      runAmpliconLength({ forwardPositionBp: 42, reversePositionBp: 42 }),
    ).toEqual({
      ok: true,
      output: { ampliconLengthBp: 1 },
    }));
  it("rejects positions below one", () =>
    expect(
      runAmpliconLength({ forwardPositionBp: 0, reversePositionBp: 10 }).ok,
    ).toBe(false));
  it("rejects fractional positions", () =>
    expect(
      runAmpliconLength({ forwardPositionBp: 10.5, reversePositionBp: 20 }).ok,
    ).toBe(false));
});
