import { describe, expect, it } from "vitest";
import { runPlasmaVolume } from "./tool.js";

describe("Plasma Volume mL", () => {
  it("takes the complement of the red cell share", () =>
    expect(
      runPlasmaVolume({ bloodVolumeMl: 5000, hematocritFraction: 0.45 }),
    ).toEqual({ ok: true, output: { plasmaVolumeMl: 2750 } }));
  it("yields zero plasma at a hematocrit of one", () =>
    expect(
      runPlasmaVolume({ bloodVolumeMl: 4000, hematocritFraction: 1 }),
    ).toEqual({ ok: true, output: { plasmaVolumeMl: 0 } }));
  it("yields the whole volume without red cells", () =>
    expect(
      runPlasmaVolume({ bloodVolumeMl: 4000, hematocritFraction: 0 }),
    ).toEqual({ ok: true, output: { plasmaVolumeMl: 4000 } }));
  it("complements the red cell mass estimate", () =>
    expect(
      runPlasmaVolume({ bloodVolumeMl: 4800, hematocritFraction: 0.42 }),
    ).toEqual({ ok: true, output: { plasmaVolumeMl: 2784.0000000000005 } }));
  it("rejects non positive blood volume", () => {
    const result = runPlasmaVolume({
      bloodVolumeMl: -100,
      hematocritFraction: 0.45,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_value");
  });
  it("rejects negative hematocrit fractions", () => {
    const result = runPlasmaVolume({
      bloodVolumeMl: 5000,
      hematocritFraction: -0.1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("hematocritFraction");
  });
});
