import { describe, expect, it } from "vitest";
import {
  starterPitchRateExample,
  starterPitchRateTool,
  runStarterPitchRate,
} from "./tool.js";

describe("starterPitchRateTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runStarterPitchRate(starterPitchRateExample.input)).toEqual({
      ok: true,
      output: starterPitchRateExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(starterPitchRateExample))).toEqual(
      starterPitchRateExample,
    );
    expect(starterPitchRateTool.contractVersion).toBe(1);
    expect(starterPitchRateTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runStarterPitchRate(null).ok).toBe(false);
    expect(
      runStarterPitchRate({
        ...starterPitchRateExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
