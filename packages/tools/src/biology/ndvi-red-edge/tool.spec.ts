import { describe, expect, it } from "vitest";
import { ndviRedEdgeExample, runNdviRedEdge } from "./tool.js";

describe("Red Edge NDVI", () => {
  it("publishes an executable example", () =>
    expect(runNdviRedEdge(ndviRedEdgeExample.input)).toEqual({
      ok: true,
      output: ndviRedEdgeExample.output,
    }));
  it("returns zero when reflectances match", () =>
    expect(
      runNdviRedEdge({ nirReflectance: 0.3, redEdgeReflectance: 0.3 }),
    ).toEqual({
      ok: true,
      output: { redEdgeNdvi: 0 },
    }));
  it("returns negative values for bare surfaces", () =>
    expect(
      runNdviRedEdge({ nirReflectance: 0.1, redEdgeReflectance: 0.4 }),
    ).toEqual({
      ok: true,
      output: { redEdgeNdvi: -0.6000000000000001 },
    }));
  it("approaches one for strong vegetation signal", () => {
    const result = runNdviRedEdge({ nirReflectance: 1, redEdgeReflectance: 0 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.redEdgeNdvi).toBe(1);
  });
  it("rejects dark pixels whose reflectances sum to zero", () => {
    const result = runNdviRedEdge({ nirReflectance: 0, redEdgeReflectance: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("dark_pixel");
  });
  it("rejects reflectances above one", () =>
    expect(
      runNdviRedEdge({ nirReflectance: 1.5, redEdgeReflectance: 0.2 }).ok,
    ).toBe(false));
});
