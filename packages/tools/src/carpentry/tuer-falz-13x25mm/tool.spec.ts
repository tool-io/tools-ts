import { describe, expect, it } from "vitest";
import { doorRebateExample, doorRebateTool, runDoorRebate } from "./tool.js";

describe("Door Rebate Calculator", () => {
  it("computes the canonical example", () =>
    expect(runDoorRebate(doorRebateExample.input)).toEqual({
      ok: true,
      output: {
        rebateDepthMm: 13,
        rebateHeightMm: 25,
        remainingLeafThicknessMm: 31,
      },
    }));

  it("applies the default 44 mm leaf thickness", () =>
    expect(runDoorRebate({})).toEqual({
      ok: true,
      output: {
        rebateDepthMm: 13,
        rebateHeightMm: 25,
        remainingLeafThicknessMm: 31,
      },
    }));

  it("keeps the standard rebate constants for every leaf thickness", () =>
    expect(runDoorRebate({ leafThicknessMm: 50 })).toEqual({
      ok: true,
      output: {
        rebateDepthMm: 13,
        rebateHeightMm: 25,
        remainingLeafThicknessMm: 37,
      },
    }));

  it("accepts the smallest supported leaf thickness", () =>
    expect(runDoorRebate({ leafThicknessMm: 35 })).toEqual({
      ok: true,
      output: {
        rebateDepthMm: 13,
        rebateHeightMm: 25,
        remainingLeafThicknessMm: 22,
      },
    }));

  it("accepts the largest supported leaf thickness", () =>
    expect(runDoorRebate({ leafThicknessMm: 60 })).toEqual({
      ok: true,
      output: {
        rebateDepthMm: 13,
        rebateHeightMm: 25,
        remainingLeafThicknessMm: 47,
      },
    }));

  it("rejects leaf thicknesses below 35 mm before the guard", () => {
    const result = runDoorRebate({ leafThicknessMm: 30 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects leaf thicknesses above 60 mm", () =>
    expect(runDoorRebate({ leafThicknessMm: 61 }).ok).toBe(false));

  it("rejects non-finite leaf thicknesses", () => {
    expect(runDoorRebate({ leafThicknessMm: Number.NaN }).ok).toBe(false);
    expect(
      runDoorRebate({ leafThicknessMm: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("rejects non-numeric leaf thicknesses", () =>
    expect(runDoorRebate({ leafThicknessMm: "44" } as never).ok).toBe(false));

  it("rejects unknown input fields", () => {
    const result = runDoorRebate({
      leafThicknessMm: 44,
      rebateWidthMm: 15,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(doorRebateExample))).toEqual(
      doorRebateExample,
    );
    expect(doorRebateTool.id).toBe("carpentry/tuer-falz-13x25mm");
    expect(doorRebateTool.execution).toEqual({ kind: "pure" });
    expect(doorRebateTool.inputSchema.properties?.leafThicknessMm.default).toBe(
      44,
    );
  });
});
