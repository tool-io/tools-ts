import { describe, expect, it } from "vitest";
import {
  spiderDiagramNormalizationExample,
  runSpiderDiagramNormalization,
} from "./tool.js";

describe("spider-diagram-normalization", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSpiderDiagramNormalization(spiderDiagramNormalizationExample.input),
    ).toEqual({
      ok: true,
      output: spiderDiagramNormalizationExample.output,
    });
  });

  it("normalizes a supported element set to unity for primitive-mantle composition", () => {
    const result = runSpiderDiagramNormalization({
      elements: ["rb", "ba"],
      concentrationsPpm: [0.635, 6.989],
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.normalizedValues).toEqual([1, 1]);
  });
  it("rejects unsupported elements and length mismatches", () => {
    expect(
      runSpiderDiagramNormalization({
        elements: ["kryptonite"],
        concentrationsPpm: [1],
      }).ok,
    ).toBe(false);
    expect(
      runSpiderDiagramNormalization({
        elements: ["rb"],
        concentrationsPpm: [1, 2],
      }).ok,
    ).toBe(false);
  });
});
