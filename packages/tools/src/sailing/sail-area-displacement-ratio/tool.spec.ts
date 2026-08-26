import { describe, expect, it } from "vitest";
import {
  sailAreaDisplacementRatioExample,
  runSailAreaDisplacementRatio,
} from "./tool.js";

describe("sail area displacement ratio calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runSailAreaDisplacementRatio(
      sailAreaDisplacementRatioExample.input,
    );
    if (!r.ok) throw new Error("expected success");
    expect(r.output.saDispRatio).toBe(20);
  });

  it("scales linearly with sail area at fixed displacement", () => {
    const result = runSailAreaDisplacementRatio({
      displacementLb: 8000,
      sailAreaFt2: 250,
    });
    expect(result).toEqual({ ok: true, output: { saDispRatio: 10 } });
  });

  it("rejects non-positive inputs through execution", () => {
    for (const bad of [
      { displacementLb: 0, sailAreaFt2: 500 },
      { displacementLb: -1, sailAreaFt2: 500 },
      { displacementLb: 8000, sailAreaFt2: 0 },
    ])
      expect(runSailAreaDisplacementRatio(bad).ok).toBe(false);
  });
});
