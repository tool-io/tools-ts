import { describe, expect, it } from "vitest";
import {
  correctionOverErasureFlagExample,
  runCorrectionOverErasureFlag,
} from "./tool.js";

describe("correction-over-erasure-flag", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCorrectionOverErasureFlag(correctionOverErasureFlagExample.input),
    ).toEqual({
      ok: true,
      output: correctionOverErasureFlagExample.output,
    });
  });

  it("reports none when no correction reuses an erasure", () => {
    const result = runCorrectionOverErasureFlag({
      erasureCount: 7,
      correctionsOverErasure: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.correctionOverErasureFlag).toBe(false);
    expect(result.output.practiceBand).toBe("none");
  });

  it("rejects over-erasure counts exceeding erasures", () => {
    expect(
      runCorrectionOverErasureFlag({
        erasureCount: 2,
        correctionsOverErasure: 3,
      }).ok,
    ).toBe(false);
  });
});
