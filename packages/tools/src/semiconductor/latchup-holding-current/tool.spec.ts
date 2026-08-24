import { describe, expect, it } from "vitest";
import {
  latchupHoldingCurrentExample,
  runLatchupHoldingCurrent,
} from "./tool.js";

describe("Latch-Up Holding Current Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runLatchupHoldingCurrent(latchupHoldingCurrentExample.input),
    ).toEqual({ ok: true, output: latchupHoldingCurrentExample.output }));

  it("scales linearly with well spacing", () =>
    expect(
      runLatchupHoldingCurrent({
        holdingCurrentDensityMaPerUm: 0.5,
        effectiveWellWidthUm: 40,
      }),
    ).toEqual({ ok: true, output: { holdingCurrentMa: 20 } }));

  it("scales linearly with current density", () =>
    expect(
      runLatchupHoldingCurrent({
        holdingCurrentDensityMaPerUm: 1.25,
        effectiveWellWidthUm: 8,
      }),
    ).toEqual({ ok: true, output: { holdingCurrentMa: 10 } }));

  it("handles sub-micron spacings", () =>
    expect(
      runLatchupHoldingCurrent({
        holdingCurrentDensityMaPerUm: 2,
        effectiveWellWidthUm: 0.25,
      }),
    ).toEqual({ ok: true, output: { holdingCurrentMa: 0.5 } }));

  it("rejects a zero holding current density", () =>
    expect(
      runLatchupHoldingCurrent({
        holdingCurrentDensityMaPerUm: 0,
        effectiveWellWidthUm: 20,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "holdingCurrentDensityMaPerUm" },
        ],
      },
      ok: false,
    }));

  it("rejects a zero well spacing", () =>
    expect(
      runLatchupHoldingCurrent({
        holdingCurrentDensityMaPerUm: 0.5,
        effectiveWellWidthUm: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "effectiveWellWidthUm" }],
      },
      ok: false,
    }));

  it("rejects negative spacing through validation", () =>
    expect(
      runLatchupHoldingCurrent({
        holdingCurrentDensityMaPerUm: 0.5,
        effectiveWellWidthUm: -1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "effectiveWellWidthUm" }],
      },
      ok: false,
    }));

  it("rejects non-finite inputs", () =>
    expect(
      runLatchupHoldingCurrent({
        holdingCurrentDensityMaPerUm: Number.NaN,
        effectiveWellWidthUm: 20,
      }).ok,
    ).toBe(false));

  it("rejects missing required inputs", () =>
    expect(
      runLatchupHoldingCurrent({ effectiveWellWidthUm: 20 }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "holdingCurrentDensityMaPerUm" },
        ],
      },
      ok: false,
    }));
});
