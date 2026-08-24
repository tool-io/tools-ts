import { describe, expect, it } from "vitest";
import { memristorOnOffRatioExample, runMemristorOnOffRatio } from "./tool.js";

describe("Memristor On-Off Ratio Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMemristorOnOffRatio(memristorOnOffRatioExample.input)).toEqual({
      ok: true,
      output: memristorOnOffRatioExample.output,
    });
  });

  it("reports a ratio of one for identical states", () => {
    expect(
      runMemristorOnOffRatio({ offResistanceOhms: 500, onResistanceOhms: 500 }),
    ).toEqual({ ok: true, output: { onOffRatio: 1 } });
  });

  it("reports large ratios for high-resistance off states", () => {
    expect(
      runMemristorOnOffRatio({
        offResistanceOhms: 1000000,
        onResistanceOhms: 100,
      }),
    ).toEqual({ ok: true, output: { onOffRatio: 10000 } });
  });

  it("rejects swapped on and off states", () => {
    expect(
      runMemristorOnOffRatio({
        offResistanceOhms: 100,
        onResistanceOhms: 1000,
      }),
    ).toMatchObject({ ok: false });
  });

  it("rejects a zero on resistance", () => {
    expect(
      runMemristorOnOffRatio({
        offResistanceOhms: 100000,
        onResistanceOhms: 0,
      }),
    ).toMatchObject({ ok: false });
  });

  it("rejects a zero off resistance", () => {
    expect(
      runMemristorOnOffRatio({
        offResistanceOhms: 0,
        onResistanceOhms: 1000,
      }),
    ).toMatchObject({ ok: false });
  });

  it("rejects negative resistances through validation", () => {
    expect(
      runMemristorOnOffRatio({
        offResistanceOhms: 100000,
        onResistanceOhms: -5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });

  it("rejects non-finite resistances", () => {
    expect(
      runMemristorOnOffRatio({
        offResistanceOhms: Number.NaN,
        onResistanceOhms: 1000,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing inputs", () => {
    expect(runMemristorOnOffRatio({}).ok).toBe(false);
  });
});
