import { describe, expect, it } from "vitest";
import { runThermalNoisePower, thermalNoisePowerExample } from "./tool.js";

describe("Thermal Noise Power dBm", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runThermalNoisePower(thermalNoisePowerExample.input)).toEqual({
      ok: true,
      output: { thermalNoiseDbm: -134 },
    }));
  it("reports the -174 dBm/Hz floor for one hertz", () =>
    expect(runThermalNoisePower({ bandwidthHz: 1 })).toEqual({
      ok: true,
      output: { thermalNoiseDbm: -174 },
    }));
  it("reports -114 dBm for one megahertz", () =>
    expect(runThermalNoisePower({ bandwidthHz: 1000000 })).toEqual({
      ok: true,
      output: { thermalNoiseDbm: -114 },
    }));
  it("handles arbitrary bandwidths", () =>
    expect(runThermalNoisePower({ bandwidthHz: 20000 })).toEqual({
      ok: true,
      output: { thermalNoiseDbm: -130.9897000433602 },
    }));
  it("rejects zero bandwidth", () =>
    expect(runThermalNoisePower({ bandwidthHz: 0 }).ok).toBe(false));
  it("rejects negative bandwidth", () =>
    expect(runThermalNoisePower({ bandwidthHz: -1 }).ok).toBe(false));
  it("rejects non-finite input", () =>
    expect(runThermalNoisePower({ bandwidthHz: Number.NaN })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "bandwidthHz" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runThermalNoisePower({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "bandwidthHz" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runThermalNoisePower({
        ...thermalNoisePowerExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
