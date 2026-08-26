import { describe, expect, it } from "vitest";
import { runLeafAreaIndex } from "./tool.js";

describe("LAI Calculator", () => {
  it("calculates a valid result", () =>
    expect(runLeafAreaIndex({ groundAreaM2: 10, totalLeafAreaM2: 50 })).toEqual(
      {
        ok: true,
        output: { leafAreaIndex: 5 },
      },
    ));
  it("equals one when leaf area matches ground area", () => {
    const result = runLeafAreaIndex({ groundAreaM2: 25, totalLeafAreaM2: 25 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.leafAreaIndex).toBe(1);
  });
  it("supports fractional index values", () => {
    const result = runLeafAreaIndex({ groundAreaM2: 4, totalLeafAreaM2: 10 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.leafAreaIndex).toBe(2.5);
  });
  it("scales linearly with ground area", () => {
    const a = runLeafAreaIndex({ groundAreaM2: 10, totalLeafAreaM2: 50 });
    const b = runLeafAreaIndex({ groundAreaM2: 20, totalLeafAreaM2: 50 });
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok)
      expect(
        Number(b.output.leafAreaIndex) / Number(a.output.leafAreaIndex),
      ).toBe(0.5);
  });
  it("rejects zero leaf area", () =>
    expect(runLeafAreaIndex({ groundAreaM2: 10, totalLeafAreaM2: 0 }).ok).toBe(
      false,
    ));
  it("rejects zero ground area", () =>
    expect(runLeafAreaIndex({ groundAreaM2: 0, totalLeafAreaM2: 50 }).ok).toBe(
      false,
    ));
  it("rejects negative inputs", () =>
    expect(
      runLeafAreaIndex({ groundAreaM2: -10, totalLeafAreaM2: 50 }).ok,
    ).toBe(false));
});
