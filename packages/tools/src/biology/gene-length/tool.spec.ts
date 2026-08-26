import { describe, expect, it } from "vitest";
import { runGeneLength } from "./tool.js";

describe("Gene Coordinate Length", () => {
  it("computes an inclusive coordinate span", () =>
    expect(
      runGeneLength({ endPositionBp: 2234, startPositionBp: 1001 }),
    ).toEqual({
      ok: true,
      output: { geneLengthBp: 1234 },
    }));
  it("accepts the smallest gene of one base pair", () =>
    expect(runGeneLength({ endPositionBp: 42, startPositionBp: 42 })).toEqual({
      ok: true,
      output: { geneLengthBp: 1 },
    }));
  it("handles a chromosome-scale inclusive span", () =>
    expect(
      runGeneLength({ endPositionBp: 248956422, startPositionBp: 1 }),
    ).toEqual({
      ok: true,
      output: { geneLengthBp: 248956422 },
    }));
  it("rejects reversed coordinates", () =>
    expect(runGeneLength({ endPositionBp: 99, startPositionBp: 100 }).ok).toBe(
      false,
    ));
  it("rejects zero coordinates", () =>
    expect(runGeneLength({ endPositionBp: 100, startPositionBp: 0 }).ok).toBe(
      false,
    ));
  it("rejects fractional coordinates", () =>
    expect(runGeneLength({ endPositionBp: 100.5, startPositionBp: 1 }).ok).toBe(
      false,
    ));
});
