import { describe, expect, it } from "vitest";
import { anchorPullOutExample, runAnchorPullOut } from "./tool.js";

describe("Anchor Pull-Out Class Lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAnchorPullOut(anchorPullOutExample.input)).toEqual({
      ok: true,
      output: anchorPullOutExample.output,
    });
  });

  it("rates m6 at two hundred kilograms", () => {
    expect(runAnchorPullOut({ anchorSize: "m6" })).toEqual({
      ok: true,
      output: { ratedPullKg: 200 },
    });
  });

  it("rates m10 at seven hundred kilograms", () => {
    expect(runAnchorPullOut({ anchorSize: "m10" })).toEqual({
      ok: true,
      output: { ratedPullKg: 700 },
    });
  });

  it("rates m12 at one thousand kilograms", () => {
    expect(runAnchorPullOut({ anchorSize: "m12" })).toEqual({
      ok: true,
      output: { ratedPullKg: 1000 },
    });
  });

  it("covers every documented size", () => {
    for (const anchorSize of ["m6", "m8", "m10", "m12"] as const) {
      const result = runAnchorPullOut({ anchorSize });
      expect(result.ok).toBe(true);
    }
  });

  it("rejects uppercase sizes", () => {
    const result = runAnchorPullOut({ anchorSize: "M8" as never });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown sizes", () => {
    expect(runAnchorPullOut({ anchorSize: "m16" as never }).ok).toBe(false);
  });

  it("requires the anchor size", () => {
    expect(runAnchorPullOut({}).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runAnchorPullOut({ anchorSize: "m6", extra: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    expect(runAnchorPullOut([true]).ok).toBe(false);
  });
});
