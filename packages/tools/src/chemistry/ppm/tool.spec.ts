import { describe, expect, it } from "vitest";
import { ppmExample, runPpm } from "./tool.js";

describe("PPM Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPpm(ppmExample.input)).toEqual({
      ok: true,
      output: ppmExample.output,
    });
  });

  it("computes fractional ppm", () => {
    expect(runPpm({ massSoluteMg: 1, massSolutionKg: 2 })).toEqual({
      ok: true,
      output: { partsPerMillion: 0.5 },
    });
  });

  it("computes large ppm values", () => {
    expect(runPpm({ massSoluteMg: 1000, massSolutionKg: 0.25 })).toEqual({
      ok: true,
      output: { partsPerMillion: 4000 },
    });
  });

  it("returns zero ppm for a zero solute mass", () =>
    expect(runPpm({ massSoluteMg: 0, massSolutionKg: 1 })).toEqual({
      ok: true,
      output: { partsPerMillion: 0 },
    }));

  it("rejects a negative solution mass", () => {
    expect(runPpm({ massSoluteMg: 10, massSolutionKg: -1 }).ok).toBe(false);
  });

  it("requires both inputs", () => {
    expect(runPpm({ massSoluteMg: 10 }).ok).toBe(false);
    expect(runPpm({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runPpm("250").ok).toBe(false);
  });
});
