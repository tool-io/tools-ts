import { describe, expect, it } from "vitest";
import {
  ageWorthinessScoreExample,
  ageWorthinessScoreTool,
  runAgeWorthinessScore,
} from "./tool.js";

describe("ageWorthinessScoreTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runAgeWorthinessScore(ageWorthinessScoreExample.input)).toEqual({
      ok: true,
      output: ageWorthinessScoreExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(ageWorthinessScoreExample))).toEqual(ageWorthinessScoreExample);
    expect(ageWorthinessScoreTool.contractVersion).toBe(1);
    expect(ageWorthinessScoreTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runAgeWorthinessScore(null).ok).toBe(false);
    expect(
      runAgeWorthinessScore({ ...ageWorthinessScoreExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
