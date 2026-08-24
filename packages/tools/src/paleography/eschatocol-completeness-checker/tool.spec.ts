import { describe, expect, it } from "vitest";
import {
  eschatocolCompletenessCheckerExample,
  runEschatocolCompletenessChecker,
} from "./tool.js";

describe("eschatocol-completeness-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEschatocolCompletenessChecker(
        eschatocolCompletenessCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: eschatocolCompletenessCheckerExample.output,
    });
  });

  it("marks a charter with every element complete", () => {
    const result = runEschatocolCompletenessChecker({
      hasDatingClause: true,
      hasWitnessList: true,
      hasRoboratio: true,
      hasSealingClause: true,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.verdict).toBe("complete");
    expect(result.output.completenessPercentage as number).toBe(100);
    expect(result.output.missingElements).toEqual([]);
  });

  it("rejects a malformed feature flag", () => {
    expect(
      runEschatocolCompletenessChecker({ hasDatingClause: "yes" }).ok,
    ).toBe(false);
  });
});
