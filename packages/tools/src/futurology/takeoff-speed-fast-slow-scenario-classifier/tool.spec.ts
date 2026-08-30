import { describe, expect, it } from "vitest";
import {
  classifyTakeoffSpeed,
  runTakeoffSpeed,
  takeoffSpeedExample,
} from "./tool.js";

describe("takeoff speed scenario classifier", () => {
  it("reproduces its canonical example", () => {
    expect(runTakeoffSpeed(takeoffSpeedExample.input)).toEqual({
      ok: true,
      output: takeoffSpeedExample.output,
    });
  });

  it("classifies a slow scenario", () => {
    expect(
      classifyTakeoffSpeed({
        capabilityDevelopmentPercent: 10,
        deploymentSpeedPercent: 20,
        fastScoreThreshold: 80,
        slowScoreThreshold: 30,
      }).classification,
    ).toBe("slow");
  });

  it("classifies a standard scenario", () => {
    expect(
      classifyTakeoffSpeed({
        capabilityDevelopmentPercent: 50,
        deploymentSpeedPercent: 50,
        fastScoreThreshold: 80,
        slowScoreThreshold: 30,
      }).classification,
    ).toBe("standard");
  });

  it("rejects reversed takeoff thresholds", () => {
    expect(
      runTakeoffSpeed({
        capabilityDevelopmentPercent: 50,
        deploymentSpeedPercent: 50,
        fastScoreThreshold: 20,
        slowScoreThreshold: 80,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_takeoff_thresholds", field: "fastScoreThreshold" },
        ],
      },
      ok: false,
    });
  });
});
