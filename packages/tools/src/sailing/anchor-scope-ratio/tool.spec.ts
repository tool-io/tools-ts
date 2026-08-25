import { describe, expect, it } from "vitest";
import { anchorScopeRatioExample, runAnchorScopeRatio } from "./tool.js";

describe("anchor scope ratio calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAnchorScopeRatio(anchorScopeRatioExample.input)).toEqual({
      ok: true,
      output: anchorScopeRatioExample.output,
    });
  });

  it("rejects zero depth through execution", () => {
    expect(runAnchorScopeRatio({ depthFt: 0, rodeLengthFt: 50 }).ok).toBe(
      false,
    );
  });
});
