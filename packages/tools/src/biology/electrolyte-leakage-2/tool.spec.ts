import { describe, expect, it } from "vitest";
import { electrolyteLeakage2Example, runElectrolyteLeakage2 } from "./tool.js";

describe("Leakage Two Step", () => {
  it("publishes an executable example", () =>
    expect(runElectrolyteLeakage2(electrolyteLeakage2Example.input)).toEqual({
      ok: true,
      output: electrolyteLeakage2Example.output,
    }));
  it("returns zero for no initial leakage", () =>
    expect(
      runElectrolyteLeakage2({
        initialConductivityUs: 0,
        maximumConductivityUs: 300,
      }),
    ).toEqual({ ok: true, output: { electrolyteLeakageRatio: 0 } }));
  it("returns one when the initial equals the maximum", () =>
    expect(
      runElectrolyteLeakage2({
        initialConductivityUs: 250,
        maximumConductivityUs: 250,
      }),
    ).toEqual({ ok: true, output: { electrolyteLeakageRatio: 1 } }));
  it("supports repeating fractions", () => {
    const result = runElectrolyteLeakage2({
      initialConductivityUs: 100,
      maximumConductivityUs: 300,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.electrolyteLeakageRatio).toBeCloseTo(1 / 3, 12);
  });
  it("rejects conductivities exceeding the maximum", () => {
    const result = runElectrolyteLeakage2({
      initialConductivityUs: 400,
      maximumConductivityUs: 300,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_conductivities");
  });
  it("rejects zero maximum conductivity", () =>
    expect(
      runElectrolyteLeakage2({
        initialConductivityUs: 0,
        maximumConductivityUs: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative initial conductivity", () =>
    expect(
      runElectrolyteLeakage2({
        initialConductivityUs: -1,
        maximumConductivityUs: 300,
      }).ok,
    ).toBe(false));
});
