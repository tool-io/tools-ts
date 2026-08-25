import { describe, expect, it } from "vitest";
import {
  displacementLengthRatioExample,
  runDisplacementLengthRatio,
} from "./tool.js";

describe("displacement length ratio calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runDisplacementLengthRatio(displacementLengthRatioExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.displacementLengthRatio).toBeCloseTo(162.6926280716368, 4);
  });

  it("rejects non-positive inputs through execution", () => {
    for (const bad of [
      { displacementLb: -1, waterlineLengthFt: 28 },
      { displacementLb: 8000, waterlineLengthFt: 0 },
    ])
      expect(runDisplacementLengthRatio(bad).ok).toBe(false);
  });
});
