import { describe, expect, it } from "vitest";
import {
  transformerVoltageRatioExample,
  runTransformerVoltageRatio,
} from "./tool.js";

describe("Voltage Ratio", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runTransformerVoltageRatio(transformerVoltageRatioExample.input),
    ).toEqual({ ok: true, output: transformerVoltageRatioExample.output }));

  it("steps 240 V down through a 1000:50 transformer", () =>
    expect(
      runTransformerVoltageRatio({
        primaryTurns: 1000,
        primaryVolts: 240,
        secondaryTurns: 50,
      }),
    ).toEqual({ ok: true, output: { secondaryVolts: 12 } }));

  it("passes voltage unchanged for a 1:1 transformer", () =>
    expect(
      runTransformerVoltageRatio({
        primaryTurns: 100,
        primaryVolts: 240,
        secondaryTurns: 100,
      }),
    ).toEqual({ ok: true, output: { secondaryVolts: 240 } }));

  it("halves the primary turns to double the secondary voltage", () =>
    expect(
      runTransformerVoltageRatio({
        primaryTurns: 250,
        primaryVolts: 120,
        secondaryTurns: 100,
      }),
    ).toEqual({ ok: true, output: { secondaryVolts: 48 } }));

  it("rejects zero primary voltage", () =>
    expect(
      runTransformerVoltageRatio({
        primaryTurns: 500,
        primaryVolts: 0,
        secondaryTurns: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "primaryVolts" }] },
      ok: false,
    }));

  it("rejects zero primary turns", () =>
    expect(
      runTransformerVoltageRatio({
        primaryTurns: 0,
        primaryVolts: 120,
        secondaryTurns: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "primaryTurns" }] },
      ok: false,
    }));

  it("rejects zero secondary turns", () =>
    expect(
      runTransformerVoltageRatio({
        primaryTurns: 500,
        primaryVolts: 120,
        secondaryTurns: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "secondaryTurns" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runTransformerVoltageRatio({
        extra: true,
        primaryTurns: 500,
        primaryVolts: 120,
        secondaryTurns: 100,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
