import { describe, expect, it } from "vitest";
import { runCellVolumeSphere } from "./tool.js";

describe("Cell Volume Sphere", () => {
  it("calculates a valid result", () =>
    expect(runCellVolumeSphere({ radiusUm: 5 })).toEqual({
      ok: true,
      output: { volumeFemtoliters: 523.5987755982989 },
    }));
  it("calculates unit radius volume", () =>
    expect(runCellVolumeSphere({ radiusUm: 1 })).toEqual({
      ok: true,
      output: { volumeFemtoliters: 4.1887902047863905 },
    }));
  it("cubes with radius", () =>
    expect(runCellVolumeSphere({ radiusUm: 2 })).toEqual({
      ok: true,
      output: { volumeFemtoliters: 33.510321638291124 },
    }));
  it("rejects zero radius", () =>
    expect(runCellVolumeSphere({ radiusUm: 0 }).ok).toBe(false));
  it("rejects negative radius", () =>
    expect(runCellVolumeSphere({ radiusUm: -2 }).ok).toBe(false));
  it("rejects infinite radius", () =>
    expect(runCellVolumeSphere({ radiusUm: Infinity }).ok).toBe(false));
});
