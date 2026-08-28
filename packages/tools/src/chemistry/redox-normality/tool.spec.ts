import { describe, expect, it } from "vitest";
import { redoxNormalityExample, runRedoxNormality } from "./tool.js";
describe("Redox Normality", () => {
  it("publishes an executable example", () =>
    expect(runRedoxNormality(redoxNormalityExample.input)).toEqual({
      ok: true,
      output: redoxNormalityExample.output,
    }));
  it("equals molarity for a one-electron change", () =>
    expect(
      runRedoxNormality({ molarityM: 0.25, electronChangeInt: 1 }),
    ).toEqual({ ok: true, output: { normality: 0.25 } }));
  it("matches permanganate five-electron normality", () =>
    expect(
      runRedoxNormality({ molarityM: 0.02, electronChangeInt: 5 }),
    ).toEqual({ ok: true, output: { normality: 0.1 } }));
  it("triples with a three-electron change", () =>
    expect(
      runRedoxNormality({ molarityM: 0.15, electronChangeInt: 3 }),
    ).toEqual({ ok: true, output: { normality: 0.44999999999999996 } }));
  it("scales linearly with molarity", () => {
    const result = runRedoxNormality({
      molarityM: 0.033,
      electronChangeInt: 6,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.normality).toBeCloseTo(0.198, 12);
  });
  it("rejects zero molarity", () =>
    expect(runRedoxNormality({ molarityM: 0, electronChangeInt: 2 }).ok).toBe(
      false,
    ));
  it("rejects negative molarity", () =>
    expect(
      runRedoxNormality({ molarityM: -0.1, electronChangeInt: 2 }).ok,
    ).toBe(false));
  it("rejects zero electrons transferred", () =>
    expect(runRedoxNormality({ molarityM: 0.1, electronChangeInt: 0 }).ok).toBe(
      false,
    ));
});
