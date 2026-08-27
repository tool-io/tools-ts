import { describe, expect, it } from "vitest";
import { qSystemRatingExample, runQSystemRating } from "./tool.js";

describe("q-system-rating", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runQSystemRating(qSystemRatingExample.input)).toEqual({
      ok: true,
      output: qSystemRatingExample.output,
    });
  });

  it("gives Q = RQD for the neutral parameter set", () => {
    const result = runQSystemRating({ rqdPercent: 60, jointSetNumberJn: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.qValue as number).toBe(60);
  });

  it("rejects zero-valued denominators", () => {
    expect(runQSystemRating({ jointSetNumberJn: 0 }).ok).toBe(false);
    expect(runQSystemRating({ stressReductionFactorSrf: 0 }).ok).toBe(false);
  });
});
