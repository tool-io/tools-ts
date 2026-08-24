import { describe, expect, it } from "vitest";
import {
  ledWallPlugEfficiencyExample,
  runLedWallPlugEfficiency,
} from "./tool.js";

describe("led wall plug efficiency calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLedWallPlugEfficiency(ledWallPlugEfficiencyExample.input),
    ).toEqual({ ok: true, output: ledWallPlugEfficiencyExample.output });
  });

  it("returns one hundred percent for equal powers", () => {
    const result = runLedWallPlugEfficiency({
      electricalPowerMW: 50,
      opticalPowerMW: 50,
    });
    expect(result).toEqual({
      ok: true,
      output: { wallPlugEfficiencyPercent: 100 },
    });
  });

  it("computes a quarter ratio as twenty-five percent", () => {
    const result = runLedWallPlugEfficiency({
      electricalPowerMW: 200,
      opticalPowerMW: 50,
    });
    expect(result).toEqual({
      ok: true,
      output: { wallPlugEfficiencyPercent: 25 },
    });
  });

  it("scales linearly with optical power", () => {
    const one = runLedWallPlugEfficiency({
      electricalPowerMW: 100,
      opticalPowerMW: 10,
    });
    const two = runLedWallPlugEfficiency({
      electricalPowerMW: 100,
      opticalPowerMW: 20,
    });
    if (!one.ok || !two.ok) throw new Error("expected success");
    expect(two.output.wallPlugEfficiencyPercent as number).toBe(
      2 * (one.output.wallPlugEfficiencyPercent as number),
    );
  });

  it("handles fractional results exactly", () => {
    const result = runLedWallPlugEfficiency({
      electricalPowerMW: 300,
      opticalPowerMW: 100,
    });
    expect(result).toEqual({
      ok: true,
      output: { wallPlugEfficiencyPercent: 33.33333333333333 },
    });
  });

  it("returns zero efficiency for zero optical output", () => {
    expect(
      runLedWallPlugEfficiency({
        electricalPowerMW: 100,
        opticalPowerMW: 0,
      }),
    ).toEqual({ ok: true, output: { wallPlugEfficiencyPercent: 0 } });
  });

  it("rejects negative or energy-gaining optical output", () => {
    for (const opticalPowerMW of [-30, 101])
      expect(
        runLedWallPlugEfficiency({ electricalPowerMW: 100, opticalPowerMW }),
      ).toMatchObject({ ok: false });
  });

  it("rejects non-positive electrical power", () => {
    for (const electrical of [0, -100])
      expect(
        runLedWallPlugEfficiency({
          electricalPowerMW: electrical,
          opticalPowerMW: 30,
        }),
      ).toMatchObject({ ok: false });
  });

  it("rejects missing and unknown fields", () => {
    expect(runLedWallPlugEfficiency({ opticalPowerMW: 30 })).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
    expect(
      runLedWallPlugEfficiency({
        electricalPowerMW: 100,
        opticalPowerMW: 30,
        bias: 3,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "bias" }] },
      ok: false,
    });
  });
});
