import { describe, expect, it } from "vitest";
import {
  insularFamilyFlagCheckerExample,
  runInsularFamilyFlagChecker,
} from "./tool.js";

describe("insular-family-flag-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runInsularFamilyFlagChecker(insularFamilyFlagCheckerExample.input),
    ).toEqual({ ok: true, output: insularFamilyFlagCheckerExample.output });
  });

  it("returns unlikely when no features are ticked", () => {
    const result = runInsularFamilyFlagChecker({});
    if (!result.ok) throw new Error("expected success");
    expect(result.output.matchedFeatureCount as number).toBe(0);
    expect(result.output.verdict as string).toBe("unlikely");
  });

  it("returns possible for a single feature", () => {
    const result = runInsularFamilyFlagChecker({ tironianEtUsed: true });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.verdict as string).toBe("possible");
  });
});
