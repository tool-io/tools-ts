import { describe, expect, it } from "vitest";
import {
  foodPairingScoreExample,
  foodPairingScoreTool,
  runFoodPairingScore,
} from "./tool.js";

describe("foodPairingScoreTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runFoodPairingScore(foodPairingScoreExample.input)).toEqual({
      ok: true,
      output: foodPairingScoreExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(foodPairingScoreExample))).toEqual(
      foodPairingScoreExample,
    );
    expect(foodPairingScoreTool.contractVersion).toBe(1);
    expect(foodPairingScoreTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runFoodPairingScore(null).ok).toBe(false);
    expect(
      runFoodPairingScore({
        ...foodPairingScoreExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
