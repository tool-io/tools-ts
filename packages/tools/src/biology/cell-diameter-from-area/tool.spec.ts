import { describe, expect, it } from "vitest";
import { runCellDiameterFromArea } from "./tool.js";

describe("Cell Diameter From Area", () => {
  it("inverts the surface area of a ten micrometer sphere", () =>
    expect(runCellDiameterFromArea({ areaUm2: 314.1592653589793 })).toEqual({
      ok: true,
      output: { cellDiameterUm: 10 },
    }));
  it("recovers diameter two from four pi area", () =>
    expect(runCellDiameterFromArea({ areaUm2: 4 * Math.PI })).toEqual({
      ok: true,
      output: { cellDiameterUm: 2 },
    }));
  it("recovers diameter one from pi area", () =>
    expect(runCellDiameterFromArea({ areaUm2: Math.PI })).toEqual({
      ok: true,
      output: { cellDiameterUm: 1 },
    }));
  it("rejects zero area", () =>
    expect(runCellDiameterFromArea({ areaUm2: 0 }).ok).toBe(false));
  it("rejects negative area", () =>
    expect(runCellDiameterFromArea({ areaUm2: -10 }).ok).toBe(false));
  it("rejects infinite area", () =>
    expect(runCellDiameterFromArea({ areaUm2: Infinity }).ok).toBe(false));
});
