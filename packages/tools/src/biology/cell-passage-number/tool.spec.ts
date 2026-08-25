import { describe, expect, it } from "vitest";
import { runCellPassageNumber } from "./tool.js";

describe("Passage Number", () => {
  it("calculates a valid result", () =>
    expect(runCellPassageNumber({ initialPassage: 12, splits: 3 })).toEqual({
      ok: true,
      output: { currentPassageNumber: 15 },
    }));
  it("passes through the initial passage with no splits", () =>
    expect(runCellPassageNumber({ initialPassage: 7, splits: 0 })).toEqual({
      ok: true,
      output: { currentPassageNumber: 7 },
    }));
  it("counts a fresh culture from zero", () =>
    expect(runCellPassageNumber({ initialPassage: 0, splits: 4 })).toEqual({
      ok: true,
      output: { currentPassageNumber: 4 },
    }));
  it("stays at zero without history or splits", () =>
    expect(runCellPassageNumber({ initialPassage: 0, splits: 0 })).toEqual({
      ok: true,
      output: { currentPassageNumber: 0 },
    }));
  it("accumulates many splits", () =>
    expect(runCellPassageNumber({ initialPassage: 120, splits: 45 })).toEqual({
      ok: true,
      output: { currentPassageNumber: 165 },
    }));
  it("rejects negative initial passages", () =>
    expect(runCellPassageNumber({ initialPassage: -1, splits: 3 }).ok).toBe(
      false,
    ));
  it("rejects fractional splits", () =>
    expect(runCellPassageNumber({ initialPassage: 1, splits: 2.5 }).ok).toBe(
      false,
    ));
});
