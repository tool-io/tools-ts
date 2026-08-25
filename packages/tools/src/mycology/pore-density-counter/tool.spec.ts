import { describe, expect, it } from "vitest";
import {
  poreDensityCounterExample,
  poreDensityCounterTool,
  runPoreDensityCounter,
} from "./tool.js";

describe("poreDensityCounterTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPoreDensityCounter(poreDensityCounterExample.input)).toEqual({
      ok: true,
      output: poreDensityCounterExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(poreDensityCounterExample))).toEqual(
      poreDensityCounterExample,
    );
    expect(poreDensityCounterTool.contractVersion).toBe(1);
    expect(poreDensityCounterTool.execution).toEqual({ kind: "pure" });
  });

  it("yields one pore per square millimetre when counts match the area", () => {
    const r = runPoreDensityCounter({
      fieldAreaMm2: 9,
      poreCountInFieldInt: 9,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.poresPerMm2).toBe(1);
  });

  it("keeps fractional densities precise", () => {
    const r = runPoreDensityCounter({
      fieldAreaMm2: 3,
      poreCountInFieldInt: 10,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.poresPerMm2).toBeCloseTo(3.3333333333, 9);
  });

  it("allows a zero pore count", () => {
    const r = runPoreDensityCounter({
      fieldAreaMm2: 5,
      poreCountInFieldInt: 0,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.poresPerMm2).toBe(0);
  });

  it("rejects non-positive field areas", () => {
    expect(
      runPoreDensityCounter({ fieldAreaMm2: 0, poreCountInFieldInt: 5 }).ok,
    ).toBe(false);
    expect(
      runPoreDensityCounter({ fieldAreaMm2: -2, poreCountInFieldInt: 5 }).ok,
    ).toBe(false);
  });

  it("rejects negative pore counts", () => {
    expect(
      runPoreDensityCounter({ fieldAreaMm2: 4, poreCountInFieldInt: -1 }).ok,
    ).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runPoreDensityCounter(null).ok).toBe(false);
    expect(
      runPoreDensityCounter({
        ...poreDensityCounterExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
