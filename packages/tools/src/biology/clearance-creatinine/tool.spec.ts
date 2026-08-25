import { describe, expect, it } from "vitest";
import { runClearanceCreatinine } from "./tool.js";

describe("Creatinine-Based Clearance", () => {
  it("calculates a valid result", () =>
    expect(
      runClearanceCreatinine({
        collectionMinutes: 120,
        plasmaCreatinineMgDl: 1,
        urineCreatinineMgDl: 60,
        urineVolumeMl: 60,
      }),
    ).toEqual({
      ok: true,
      output: { creatinineClearanceMlMin: 30 },
    }));
  it("handles a full 24 hour collection", () => {
    const result = runClearanceCreatinine({
      collectionMinutes: 1440,
      plasmaCreatinineMgDl: 1.2,
      urineCreatinineMgDl: 60,
      urineVolumeMl: 1440,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.creatinineClearanceMlMin).toBeCloseTo(50, 12);
  });
  it("scales with the urine flow rate", () => {
    const result = runClearanceCreatinine({
      collectionMinutes: 60,
      plasmaCreatinineMgDl: 2,
      urineCreatinineMgDl: 40,
      urineVolumeMl: 90,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.creatinineClearanceMlMin).toBe(30);
  });
  it("supports fractional concentrations", () => {
    const result = runClearanceCreatinine({
      collectionMinutes: 60,
      plasmaCreatinineMgDl: 0.5,
      urineCreatinineMgDl: 25,
      urineVolumeMl: 60,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.creatinineClearanceMlMin).toBe(50);
  });
  it("rejects a zero urine volume", () => {
    const result = runClearanceCreatinine({
      collectionMinutes: 120,
      plasmaCreatinineMgDl: 1,
      urineCreatinineMgDl: 60,
      urineVolumeMl: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_volume");
  });
  it("rejects a zero plasma creatinine", () => {
    const result = runClearanceCreatinine({
      collectionMinutes: 120,
      plasmaCreatinineMgDl: 0,
      urineCreatinineMgDl: 60,
      urineVolumeMl: 60,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_plasma_creatinine");
  });
  it("rejects a negative urine creatinine", () => {
    const result = runClearanceCreatinine({
      collectionMinutes: 120,
      plasmaCreatinineMgDl: 1,
      urineCreatinineMgDl: -5,
      urineVolumeMl: 60,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_urine_creatinine");
  });
  it("rejects a zero collection time", () => {
    const result = runClearanceCreatinine({
      collectionMinutes: 0,
      plasmaCreatinineMgDl: 1,
      urineCreatinineMgDl: 60,
      urineVolumeMl: 60,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_collection_time");
  });
});
