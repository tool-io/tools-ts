import { describe, expect, it } from "vitest";
import {
  capsizeScreeningFactorExample,
  runCapsizeScreeningFactor,
} from "./tool.js";

describe("capsize screening factor calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runCapsizeScreeningFactor(capsizeScreeningFactorExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.capsizeScreeningFactor).toBeCloseTo(2.3, 6);
  });

  it("rejects non-positive beam through execution", () => {
    for (const bad of [
      { beamFt: 0, displacementLb: 8000 },
      { beamFt: -5, displacementLb: 8000 },
    ])
      expect(runCapsizeScreeningFactor(bad).ok).toBe(false);
  });
});
