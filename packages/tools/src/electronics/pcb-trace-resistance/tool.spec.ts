import { describe, expect, it } from "vitest";
import { pcbTraceResistanceExample, runPcbTraceResistance } from "./tool.js";

describe("PCB Trace Resistance", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runPcbTraceResistance(pcbTraceResistanceExample.input)).toEqual({
      ok: true,
      output: pcbTraceResistanceExample.output,
    }));

  it("halves the resistance when the trace is half as long", () =>
    expect(
      runPcbTraceResistance({ lengthMm: 25, thicknessUm: 35, widthMm: 1 }),
    ).toEqual({
      ok: true,
      output: { traceResistanceMilliohms: 12.142857142857144 },
    }));

  it("halves the resistance when the trace is twice as wide", () =>
    expect(
      runPcbTraceResistance({ lengthMm: 50, thicknessUm: 35, widthMm: 2 }),
    ).toEqual({
      ok: true,
      output: { traceResistanceMilliohms: 12.142857142857144 },
    }));

  it("halves the resistance when copper thickness doubles", () =>
    expect(
      runPcbTraceResistance({ lengthMm: 50, thicknessUm: 70, widthMm: 1 }),
    ).toMatchObject({
      ok: true,
      output: { traceResistanceMilliohms: 24.28571428571429 / 2 },
    }));

  it("rejects a non-positive length", () =>
    expect(
      runPcbTraceResistance({ lengthMm: 0, thicknessUm: 35, widthMm: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_dimensions", field: "lengthMm" }] },
      ok: false,
    }));

  it("rejects a non-positive width", () =>
    expect(
      runPcbTraceResistance({ lengthMm: 50, thicknessUm: 35, widthMm: -1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_dimensions", field: "widthMm" }] },
      ok: false,
    }));

  it("rejects a non-positive thickness", () =>
    expect(
      runPcbTraceResistance({ lengthMm: 50, thicknessUm: 0, widthMm: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_dimensions", field: "thicknessUm" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runPcbTraceResistance(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
