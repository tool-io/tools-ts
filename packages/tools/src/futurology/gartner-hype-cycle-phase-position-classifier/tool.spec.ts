import { describe, expect, it } from "vitest";
import {
  classifyHypeCyclePhase,
  hypeCyclePositionExample,
  runHypeCyclePosition,
} from "./tool.js";

describe("Hype Cycle phase position classifier", () => {
  it("reproduces its canonical example", () => {
    expect(runHypeCyclePosition(hypeCyclePositionExample.input)).toEqual({
      ok: true,
      output: hypeCyclePositionExample.output,
    });
  });

  it("reports ties in phase order", () => {
    expect(
      classifyHypeCyclePhase({
        innovationTriggerScore: 5,
        peakScore: 80,
        plateauScore: 10,
        slopeScore: 20,
        troughScore: 80,
      }).tiedPhases,
    ).toEqual(["peak_of_inflated_expectations", "trough_of_disillusionment"]);
  });

  it("rejects a score above 100", () => {
    expect(
      runHypeCyclePosition({
        innovationTriggerScore: 101,
        peakScore: 0,
        plateauScore: 0,
        slopeScore: 0,
        troughScore: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "innovationTriggerScore" }],
      },
      ok: false,
    });
  });
});
