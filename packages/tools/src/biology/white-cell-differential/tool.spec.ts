import { describe, expect, it } from "vitest";
import {
  runWhiteCellDifferential,
  whiteCellDifferentialExample,
} from "./tool.js";

describe("Differential Absolute Neutrophil", () => {
  it("publishes an executable example", () =>
    expect(
      runWhiteCellDifferential(whiteCellDifferentialExample.input),
    ).toEqual({ ok: true, output: whiteCellDifferentialExample.output }));
  it("computes a neutropenic count", () =>
    expect(
      runWhiteCellDifferential({ neutrophilPercent: 15, totalWbcPerUl: 2000 }),
    ).toEqual({ ok: true, output: { absoluteNeutrophilsPerUl: 300 } }));
  it("accepts a zero differential", () =>
    expect(
      runWhiteCellDifferential({ neutrophilPercent: 0, totalWbcPerUl: 9000 }),
    ).toEqual({ ok: true, output: { absoluteNeutrophilsPerUl: 0 } }));
  it("accepts a full differential", () =>
    expect(
      runWhiteCellDifferential({ neutrophilPercent: 100, totalWbcPerUl: 640 }),
    ).toEqual({ ok: true, output: { absoluteNeutrophilsPerUl: 640 } }));
  it("keeps fractional precision", () =>
    expect(
      runWhiteCellDifferential({
        neutrophilPercent: 33.5,
        totalWbcPerUl: 4000,
      }),
    ).toEqual({ ok: true, output: { absoluteNeutrophilsPerUl: 1340 } }));
  it("rejects percentages above one hundred", () => {
    const result = runWhiteCellDifferential({
      neutrophilPercent: 101,
      totalWbcPerUl: 7000,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects negative percentages", () => {
    const result = runWhiteCellDifferential({
      neutrophilPercent: -5,
      totalWbcPerUl: 7000,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a non-positive white cell count", () => {
    const result = runWhiteCellDifferential({
      neutrophilPercent: 60,
      totalWbcPerUl: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("totalWbcPerUl");
  });
});
