import { describe, expect, it } from "vitest";
import { ppbExample, runPpb } from "./tool.js";

describe("PPB Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPpb(ppbExample.input)).toEqual({
      ok: true,
      output: ppbExample.output,
    });
  });

  it("computes large ppb values", () => {
    expect(
      runPpb({ massSoluteMicrograms: 1000, massSolutionKg: 0.25 }),
    ).toEqual({
      ok: true,
      output: { partsPerBillion: 4000 },
    });
  });

  it("computes fractional ppb", () => {
    expect(runPpb({ massSoluteMicrograms: 1, massSolutionKg: 2 })).toEqual({
      ok: true,
      output: { partsPerBillion: 0.5 },
    });
  });

  it("returns zero ppb for a zero solute mass", () =>
    expect(runPpb({ massSoluteMicrograms: 0, massSolutionKg: 1 })).toEqual({
      ok: true,
      output: { partsPerBillion: 0 },
    }));

  it("rejects a negative solution mass", () => {
    expect(runPpb({ massSoluteMicrograms: 10, massSolutionKg: -1 }).ok).toBe(
      false,
    );
  });

  it("requires both inputs", () => {
    expect(runPpb({ massSoluteMicrograms: 10 }).ok).toBe(false);
    expect(runPpb({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runPpb([]).ok).toBe(false);
  });
});
