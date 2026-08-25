import { describe, expect, it } from "vitest";
import { forestaySagExample, runForestaySag } from "./tool.js";

describe("forestay sag calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runForestaySag(forestaySagExample.input)).toEqual({
      ok: true,
      output: forestaySagExample.output,
    });
  });

  it("returns zero sag for zero load at the load boundary", () => {
    expect(
      runForestaySag({
        stayLengthMeters: 10,
        tensionNewtons: 500,
        transverseLoadPerMeterKg: 0,
      }),
    ).toEqual({ ok: true, output: { sagMeters: 0 } });
  });

  it("doubles sag when load doubles", () => {
    expect(
      runForestaySag({
        stayLengthMeters: 10,
        tensionNewtons: 500,
        transverseLoadPerMeterKg: 2,
      }),
    ).toEqual({ ok: true, output: { sagMeters: 0.4903325 } });
  });

  it("halves sag when tension doubles", () => {
    const base = runForestaySag(forestaySagExample.input);
    const tighter = runForestaySag({
      stayLengthMeters: 10,
      tensionNewtons: 1000,
      transverseLoadPerMeterKg: 1,
    });
    if (!base.ok || !tighter.ok) throw new Error("expected success");
    expect(tighter.output.sagMeters).toBeCloseTo(
      (base.output.sagMeters as number) / 2,
      12,
    );
  });

  it("rejects zero stay lengths through calculation and negative lengths through validation", () => {
    expect(
      runForestaySag({
        stayLengthMeters: 0,
        tensionNewtons: 500,
        transverseLoadPerMeterKg: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "stayLengthMeters" }] },
      ok: false,
    });
    expect(
      runForestaySag({
        stayLengthMeters: -10,
        tensionNewtons: 500,
        transverseLoadPerMeterKg: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "stayLengthMeters" }] },
      ok: false,
    });
  });

  it("rejects zero tensions through calculation and negative tensions through validation", () => {
    expect(
      runForestaySag({
        stayLengthMeters: 10,
        tensionNewtons: 0,
        transverseLoadPerMeterKg: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "tensionNewtons" }] },
      ok: false,
    });
    expect(
      runForestaySag({
        stayLengthMeters: 10,
        tensionNewtons: -500,
        transverseLoadPerMeterKg: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "tensionNewtons" }] },
      ok: false,
    });
  });

  it("rejects negative loads through validation", () => {
    expect(
      runForestaySag({
        stayLengthMeters: 10,
        tensionNewtons: 500,
        transverseLoadPerMeterKg: -1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "transverseLoadPerMeterKg" }],
      },
      ok: false,
    });
  });

  it("rejects missing and malformed inputs", () => {
    expect(runForestaySag({}).ok).toBe(false);
    expect(
      runForestaySag({
        stayLengthMeters: "long",
        tensionNewtons: 500,
        transverseLoadPerMeterKg: 1,
      }).ok,
    ).toBe(false);
    expect(runForestaySag(null).ok).toBe(false);
  });
});
