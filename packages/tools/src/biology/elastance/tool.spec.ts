import { describe, expect, it } from "vitest";
import { elastanceExample, runElastance } from "./tool.js";

describe("Elastance Calculator", () => {
  it("publishes an executable example", () =>
    expect(runElastance(elastanceExample.input)).toEqual({
      ok: true,
      output: elastanceExample.output,
    }));
  it("doubles elastance when pressure doubles", () =>
    expect(
      runElastance({ tidalVolumeLiters: 0.5, transpulmonaryPressureCmH2o: 10 }),
    ).toEqual({ ok: true, output: { elastanceCmh2oPerL: 20 } }));
  it("accepts zero pressure as zero elastance", () =>
    expect(
      runElastance({ tidalVolumeLiters: 0.5, transpulmonaryPressureCmH2o: 0 }),
    ).toEqual({ ok: true, output: { elastanceCmh2oPerL: 0 } }));
  it("keeps fractional elastance", () =>
    expect(
      runElastance({ tidalVolumeLiters: 0.6, transpulmonaryPressureCmH2o: 3 }),
    ).toEqual({ ok: true, output: { elastanceCmh2oPerL: 5 } }));
  it("rejects negative pressure", () => {
    const result = runElastance({
      tidalVolumeLiters: 0.5,
      transpulmonaryPressureCmH2o: -1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("negative_pressure");
  });
  it("rejects zero tidal volume", () =>
    expect(
      runElastance({ tidalVolumeLiters: 0, transpulmonaryPressureCmH2o: 5 }).ok,
    ).toBe(false));
  it("rejects negative tidal volume", () =>
    expect(
      runElastance({ tidalVolumeLiters: -0.5, transpulmonaryPressureCmH2o: 5 })
        .ok,
    ).toBe(false));
});
