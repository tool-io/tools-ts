import { describe, expect, it } from "vitest";
import { runDensityAtAltitude } from "./tool.js";

describe("density at altitude calculator", () => {
  it("returns a ratio of one at sea level", () => {
    expect(runDensityAtAltitude({ altitudeFt: 0 })).toEqual({
      ok: true,
      output: { densityRatio: 1 },
    });
  });
  it("rejects negative altitudes through execution", () => {
    expect(runDensityAtAltitude({ altitudeFt: -1 }).ok).toBe(false);
  });
  it("rejects altitudes above the tropopause through execution", () => {
    expect(runDensityAtAltitude({ altitudeFt: 40000 })).toMatchObject({
      error: { issues: [{ code: "above_tropopause" }] },
      ok: false,
    });
  });
});
