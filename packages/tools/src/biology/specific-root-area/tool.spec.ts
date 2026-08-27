import { describe, expect, it } from "vitest";
import { runSpecificRootArea, specificRootAreaExample } from "./tool.js";

describe("Specific Root Area", () => {
  it("publishes an executable example", () =>
    expect(runSpecificRootArea(specificRootAreaExample.input)).toEqual({
      ok: true,
      output: specificRootAreaExample.output,
    }));
  it("doubles when surface area doubles at fixed mass", () =>
    expect(
      runSpecificRootArea({ rootDryMassG: 0.6, rootSurfaceAreaCm2: 60 }),
    ).toEqual({ ok: true, output: { specificRootArea: 100 } }));
  it("doubles when mass halves at fixed area", () =>
    expect(
      runSpecificRootArea({ rootDryMassG: 0.3, rootSurfaceAreaCm2: 30 }),
    ).toEqual({ ok: true, output: { specificRootArea: 100 } }));
  it("keeps fractional ratios exact", () =>
    expect(
      runSpecificRootArea({ rootDryMassG: 4, rootSurfaceAreaCm2: 6 }),
    ).toEqual({ ok: true, output: { specificRootArea: 1.5 } }));
  it("rejects zero surface area", () => {
    const result = runSpecificRootArea({
      rootDryMassG: 0.6,
      rootSurfaceAreaCm2: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("rootSurfaceAreaCm2");
  });
  it("rejects zero dry mass", () => {
    const result = runSpecificRootArea({
      rootDryMassG: 0,
      rootSurfaceAreaCm2: 30,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("rootDryMassG");
  });
  it("rejects negative areas", () => {
    const result = runSpecificRootArea({
      rootDryMassG: 0.6,
      rootSurfaceAreaCm2: -30,
    });
    expect(result.ok).toBe(false);
  });
});
