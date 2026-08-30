import { describe, expect, it } from "vitest";
import {
  calculateColumnWheelRatchetTeeth,
  columnWheelCountExample,
  runColumnWheelCount,
} from "./tool.js";

describe("chronograph column-wheel ratchet tooth count", () => {
  it("reproduces the patent-style six-column example", () => {
    expect(runColumnWheelCount(columnWheelCountExample.input)).toEqual({
      ok: true,
      output: columnWheelCountExample.output,
    });
  });

  it("independently multiplies columns by strokes", () => {
    expect(
      calculateColumnWheelRatchetTeeth({ columnCount: 5, strokesPerCycle: 2 }),
    ).toEqual({ ratchetTeeth: 10, ratchetTeethPerColumn: 2 });
  });

  it("accepts the lower input boundary", () => {
    expect(
      calculateColumnWheelRatchetTeeth({ columnCount: 1, strokesPerCycle: 1 }),
    ).toEqual({ ratchetTeeth: 1, ratchetTeethPerColumn: 1 });
  });

  it("rejects a fractional stroke count", () => {
    expect(
      runColumnWheelCount({ columnCount: 6, strokesPerCycle: 2.5 }),
    ).toMatchObject({
      error: { issues: [{ field: "strokesPerCycle" }] },
      ok: false,
    });
  });

  it("rejects more than 30 columns", () => {
    expect(
      runColumnWheelCount({ columnCount: 31, strokesPerCycle: 3 }),
    ).toMatchObject({
      error: { issues: [{ field: "columnCount" }] },
      ok: false,
    });
  });
});
