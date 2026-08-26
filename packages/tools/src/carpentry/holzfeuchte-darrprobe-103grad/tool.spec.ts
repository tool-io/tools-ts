import { describe, expect, it } from "vitest";
import { ovenDryMoistureExample, runOvenDryMoisture } from "./tool.js";

describe("Oven Dry Moisture Content", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runOvenDryMoisture(ovenDryMoistureExample.input)).toEqual({
      ok: true,
      output: ovenDryMoistureExample.output,
    });
  });

  it("computes fifty percent moisture for doubled wet mass", () => {
    expect(runOvenDryMoisture({ ovenDryMassG: 100, wetMassG: 150 })).toEqual({
      ok: true,
      output: { moisturePercent: 50 },
    });
  });

  it("computes one percent moisture for a one gram loss", () => {
    expect(runOvenDryMoisture({ ovenDryMassG: 100, wetMassG: 101 })).toEqual({
      ok: true,
      output: { moisturePercent: 1 },
    });
  });

  it("computes three hundred percent moisture for green wood", () => {
    expect(runOvenDryMoisture({ ovenDryMassG: 75, wetMassG: 300 })).toEqual({
      ok: true,
      output: { moisturePercent: 300 },
    });
  });

  it("rejects equal masses", () => {
    const result = runOvenDryMoisture({ ovenDryMassG: 100, wetMassG: 100 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_masses");
  });

  it("rejects a zero oven-dry mass", () => {
    const result = runOvenDryMoisture({ ovenDryMassG: 0, wetMassG: 10 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_masses");
  });

  it("rejects a negative oven-dry mass", () => {
    const result = runOvenDryMoisture({ ovenDryMassG: -10, wetMassG: 50 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_masses");
  });

  it("rejects a wet mass below the oven-dry mass", () => {
    const result = runOvenDryMoisture({ ovenDryMassG: 100, wetMassG: 90 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_masses");
  });

  it("requires both masses", () => {
    expect(runOvenDryMoisture({ ovenDryMassG: 100 }).ok).toBe(false);
    expect(runOvenDryMoisture({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runOvenDryMoisture("120").ok).toBe(false);
  });
});
