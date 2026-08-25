import { describe, expect, it } from "vitest";
import { electrolyteLeakageExample, runElectrolyteLeakage } from "./tool.js";

describe("Electrolyte Leakage %", () => {
  it("publishes an executable example", () =>
    expect(runElectrolyteLeakage(electrolyteLeakageExample.input)).toEqual({
      ok: true,
      output: electrolyteLeakageExample.output,
    }));
  it("returns zero leakage for intact membranes", () =>
    expect(
      runElectrolyteLeakage({
        boiledConductivityUs: 250,
        initialConductivityUs: 0,
      }),
    ).toEqual({ ok: true, output: { electrolyteLeakagePercent: 0 } }));
  it("returns one hundred percent for total leakage", () =>
    expect(
      runElectrolyteLeakage({
        boiledConductivityUs: 300,
        initialConductivityUs: 300,
      }),
    ).toEqual({ ok: true, output: { electrolyteLeakagePercent: 100 } }));
  it("supports fractional leakage", () => {
    const result = runElectrolyteLeakage({
      boiledConductivityUs: 400,
      initialConductivityUs: 90,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.electrolyteLeakagePercent).toBe(22.5);
  });
  it("rises with stress injury", () => {
    const stressed = runElectrolyteLeakage({
      boiledConductivityUs: 300,
      initialConductivityUs: 210,
    });
    if (stressed.ok) expect(stressed.output.electrolyteLeakagePercent).toBe(70);
    else expect.fail("the calculation should succeed");
  });
  it("rejects zero boiled conductivity", () => {
    const result = runElectrolyteLeakage({
      boiledConductivityUs: 0,
      initialConductivityUs: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_conductivities");
  });
  it("rejects initial conductivity above boiled conductivity", () => {
    const result = runElectrolyteLeakage({
      boiledConductivityUs: 200,
      initialConductivityUs: 250,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_conductivities");
  });
  it("rejects negative initial conductivity", () =>
    expect(
      runElectrolyteLeakage({
        boiledConductivityUs: 200,
        initialConductivityUs: -1,
      }).ok,
    ).toBe(false));
});
