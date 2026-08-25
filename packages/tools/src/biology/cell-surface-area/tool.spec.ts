import { describe, expect, it } from "vitest";
import { runCellSurfaceArea } from "./tool.js";

describe("Cell Surface Area Sphere", () => {
  it("calculates a valid result", () =>
    expect(runCellSurfaceArea({ radiusUm: 5 })).toEqual({
      ok: true,
      output: { surfaceAreaUm2: 314.1592653589793 },
    }));
  it("calculates unit radius area", () =>
    expect(runCellSurfaceArea({ radiusUm: 1 })).toEqual({
      ok: true,
      output: { surfaceAreaUm2: 12.566370614359172 },
    }));
  it("handles sub-micrometer radii", () =>
    expect(runCellSurfaceArea({ radiusUm: 0.5 })).toEqual({
      ok: true,
      output: { surfaceAreaUm2: 3.141592653589793 },
    }));
  it("rejects zero radius", () =>
    expect(runCellSurfaceArea({ radiusUm: 0 }).ok).toBe(false));
  it("rejects negative radius", () =>
    expect(runCellSurfaceArea({ radiusUm: -3 }).ok).toBe(false));
  it("rejects infinite radius", () =>
    expect(runCellSurfaceArea({ radiusUm: Infinity }).ok).toBe(false));
});
