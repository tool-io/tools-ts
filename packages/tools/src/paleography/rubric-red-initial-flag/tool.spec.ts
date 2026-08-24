import { describe, expect, it } from "vitest";
import {
  rubricRedInitialFlagExample,
  runRubricRedInitialFlag,
} from "./tool.js";

describe("rubric-red-initial-flag", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRubricRedInitialFlag(rubricRedInitialFlagExample.input)).toEqual({
      ok: true,
      output: rubricRedInitialFlagExample.output,
    });
  });

  it("flags sporadic coverage below ten percent", () => {
    const result = runRubricRedInitialFlag({
      initialCount: 50,
      redInitialCount: 3,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rubricationPresent).toBe(true);
    expect(result.output.coverageBand).toBe("sporadic");
  });

  it("rejects red counts exceeding the initial count", () => {
    expect(
      runRubricRedInitialFlag({ initialCount: 5, redInitialCount: 6 }).ok,
    ).toBe(false);
  });
});
