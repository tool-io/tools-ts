import { describe, expect, it } from "vitest";
import {
  latchupTriggerCurrentExample,
  runLatchupTriggerCurrent,
} from "./tool.js";

describe("Latch-Up Trigger Current Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runLatchupTriggerCurrent(latchupTriggerCurrentExample.input),
    ).toEqual({ ok: true, output: latchupTriggerCurrentExample.output }));

  it("scales linearly with well spacing", () =>
    expect(
      runLatchupTriggerCurrent({
        triggerCurrentDensityMaPerUm: 0.2,
        effectiveWellWidthUm: 45,
      }),
    ).toEqual({ ok: true, output: { triggerCurrentMa: 9 } }));

  it("scales linearly with current density", () =>
    expect(
      runLatchupTriggerCurrent({
        triggerCurrentDensityMaPerUm: 0.8,
        effectiveWellWidthUm: 5,
      }),
    ).toEqual({ ok: true, output: { triggerCurrentMa: 4 } }));

  it("handles fractional densities", () =>
    expect(
      runLatchupTriggerCurrent({
        triggerCurrentDensityMaPerUm: 0.125,
        effectiveWellWidthUm: 16,
      }),
    ).toEqual({ ok: true, output: { triggerCurrentMa: 2 } }));

  it("rejects a zero trigger current density", () =>
    expect(
      runLatchupTriggerCurrent({
        triggerCurrentDensityMaPerUm: 0,
        effectiveWellWidthUm: 15,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "triggerCurrentDensityMaPerUm" },
        ],
      },
      ok: false,
    }));

  it("rejects a zero well spacing", () =>
    expect(
      runLatchupTriggerCurrent({
        triggerCurrentDensityMaPerUm: 0.2,
        effectiveWellWidthUm: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "effectiveWellWidthUm" }],
      },
      ok: false,
    }));

  it("rejects negative density through validation", () =>
    expect(
      runLatchupTriggerCurrent({
        triggerCurrentDensityMaPerUm: -0.2,
        effectiveWellWidthUm: 15,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "triggerCurrentDensityMaPerUm" },
        ],
      },
      ok: false,
    }));

  it("rejects non-finite inputs", () =>
    expect(
      runLatchupTriggerCurrent({
        triggerCurrentDensityMaPerUm: Number.POSITIVE_INFINITY,
        effectiveWellWidthUm: 15,
      }).ok,
    ).toBe(false));

  it("rejects missing required inputs", () =>
    expect(runLatchupTriggerCurrent({})).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "triggerCurrentDensityMaPerUm" },
        ],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runLatchupTriggerCurrent({
        extra: true,
        triggerCurrentDensityMaPerUm: 0.2,
        effectiveWellWidthUm: 15,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
