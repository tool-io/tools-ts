import { describe, expect, it } from "vitest";
import {
  stepCountFromFloorHeightExample,
  stepCountFromFloorHeightTool,
  runStepCountFromFloorHeight,
} from "./tool.js";

describe("Step Count From Floor Height", () => {
  it("computes the canonical example with exact division", () =>
    expect(
      runStepCountFromFloorHeight(stepCountFromFloorHeightExample.input),
    ).toEqual({ ok: true, output: { actualRiseCm: 18, stepCount: 16 } }));

  it("divides exactly at the maximum target rise", () =>
    expect(
      runStepCountFromFloorHeight({ floorHeightCm: 300, targetRiseCm: 25 }),
    ).toEqual({
      ok: true,
      output: { actualRiseCm: 25, stepCount: 12 },
    }));

  it("rounds up and lowers the actual rise", () =>
    expect(
      runStepCountFromFloorHeight({ floorHeightCm: 276, targetRiseCm: 18 }),
    ).toEqual({
      ok: true,
      output: { actualRiseCm: 17.25, stepCount: 16 },
    }));

  it("produces an exact fractional rise for awkward heights", () =>
    expect(
      runStepCountFromFloorHeight({ floorHeightCm: 305, targetRiseCm: 20 }),
    ).toEqual({
      ok: true,
      output: { actualRiseCm: 19.0625, stepCount: 16 },
    }));

  it("accepts fractional floor heights", () =>
    expect(
      runStepCountFromFloorHeight({ floorHeightCm: 280.5, targetRiseCm: 18 }),
    ).toEqual({ ok: true, output: { actualRiseCm: 17.53125, stepCount: 16 } }));

  it("uses the minimum target rise of ten centimeters", () =>
    expect(
      runStepCountFromFloorHeight({ floorHeightCm: 250, targetRiseCm: 10 }),
    ).toEqual({
      ok: true,
      output: { actualRiseCm: 10, stepCount: 25 },
    }));

  it("rejects a zero floor height", () => {
    const result = runStepCountFromFloorHeight({
      floorHeightCm: 0,
      targetRiseCm: 18,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "must_be_positive",
        field: "floorHeightCm",
        message: "Floor height must be greater than zero.",
      });
  });

  it("rejects negative floor heights", () =>
    expect(
      runStepCountFromFloorHeight({ floorHeightCm: -288, targetRiseCm: 18 }).ok,
    ).toBe(false));

  it("rejects target rises outside ten to twenty-five", () => {
    expect(
      runStepCountFromFloorHeight({ floorHeightCm: 288, targetRiseCm: 9.9 }).ok,
    ).toBe(false);
    expect(
      runStepCountFromFloorHeight({
        floorHeightCm: 288,
        targetRiseCm: 25.1,
      }).ok,
    ).toBe(false);
  });

  it("rejects a missing floor height", () => {
    const result = runStepCountFromFloorHeight({ targetRiseCm: 18 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.field).toBe("floorHeightCm");
  });

  it("rejects unknown input fields", () => {
    const result = runStepCountFromFloorHeight({
      floorHeightCm: 288,
      stepCount: 16,
      targetRiseCm: 18,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable example with the tool id", () => {
    expect(JSON.parse(JSON.stringify(stepCountFromFloorHeightExample))).toEqual(
      stepCountFromFloorHeightExample,
    );
    expect(stepCountFromFloorHeightTool.execution).toEqual({ kind: "pure" });
  });
});
