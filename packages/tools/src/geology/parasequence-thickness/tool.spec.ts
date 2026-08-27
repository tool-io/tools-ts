import { describe, expect, it } from "vitest";
import {
  parasequenceThicknessExample,
  runParasequenceThickness,
} from "./tool.js";

describe("parasequence-thickness", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runParasequenceThickness(parasequenceThicknessExample.input),
    ).toEqual({
      ok: true,
      output: parasequenceThicknessExample.output,
    });
  });

  it("splits a set into fractional mean thicknesses", () => {
    const result = runParasequenceThickness({
      parasequenceSetThicknessM: 50,
      parasequenceCount: 4,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.meanParasequenceThicknessM as number).toBe(12.5);
  });

  it("rejects negative thickness and non-positive counts", () => {
    expect(
      runParasequenceThickness({
        parasequenceSetThicknessM: -1,
        parasequenceCount: 3,
      }).ok,
    ).toBe(false);
    expect(
      runParasequenceThickness({
        parasequenceSetThicknessM: 10,
        parasequenceCount: 0,
      }).ok,
    ).toBe(false);
  });
});
