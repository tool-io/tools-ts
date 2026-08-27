import { describe, expect, it } from "vitest";
import { woodSpecificGravityExample, runWoodSpecificGravity } from "./tool.js";

describe("Wood Specific Gravity", () => {
  it("matches the canonical example", () => {
    expect(runWoodSpecificGravity(woodSpecificGravityExample.input)).toEqual({
      ok: true,
      output: woodSpecificGravityExample.output,
    });
  });

  it("reports one for a wood as dense as water", () => {
    expect(
      runWoodSpecificGravity({
        ovenDryMassG: 500,
        waterDisplacementVolumeCm3: 500,
      }),
    ).toEqual({ ok: true, output: { specificGravity: 1 } });
  });

  it("reports values below one for light woods", () => {
    expect(
      runWoodSpecificGravity({
        ovenDryMassG: 120,
        waterDisplacementVolumeCm3: 800,
      }),
    ).toEqual({ ok: true, output: { specificGravity: 0.15 } });
  });

  it("accepts fractional measurements", () => {
    expect(
      runWoodSpecificGravity({
        ovenDryMassG: 1.2,
        waterDisplacementVolumeCm3: 3,
      }),
    ).toEqual({ ok: true, output: { specificGravity: 0.39999999999999997 } });
  });

  it("rejects zero dry mass", () => {
    const result = runWoodSpecificGravity({
      ovenDryMassG: 0,
      waterDisplacementVolumeCm3: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "ovenDryMassG",
      });
  });

  it("rejects zero displacement volume", () => {
    expect(
      runWoodSpecificGravity({
        ovenDryMassG: 100,
        waterDisplacementVolumeCm3: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative inputs through the schema and guard", () => {
    expect(
      runWoodSpecificGravity({
        ovenDryMassG: -10,
        waterDisplacementVolumeCm3: 100,
      }).ok,
    ).toBe(false);
    expect(
      runWoodSpecificGravity({
        ovenDryMassG: 100,
        waterDisplacementVolumeCm3: -50,
      }).ok,
    ).toBe(false);
  });
});
