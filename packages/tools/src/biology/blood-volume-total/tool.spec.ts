import { describe, expect, it } from "vitest";
import { runBloodVolumeTotal } from "./tool.js";

describe("Total Blood Volume Estimate", () => {
  it("applies seventy millilitres per kilogram", () =>
    expect(runBloodVolumeTotal({ weightKg: 70 })).toEqual({
      ok: true,
      output: { bloodVolumeMl: 4900 },
    }));
  it("estimates smaller volumes for lighter subjects", () =>
    expect(runBloodVolumeTotal({ weightKg: 12 })).toEqual({
      ok: true,
      output: { bloodVolumeMl: 840 },
    }));
  it("handles fractional weights", () =>
    expect(runBloodVolumeTotal({ weightKg: 5.5 })).toEqual({
      ok: true,
      output: { bloodVolumeMl: 385 },
    }));
  it("scales linearly across weights", () =>
    expect(runBloodVolumeTotal({ weightKg: 100 })).toEqual({
      ok: true,
      output: { bloodVolumeMl: 7000 },
    }));
  it("rejects zero weight", () => {
    const result = runBloodVolumeTotal({ weightKg: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_value");
  });
  it("rejects negative weight", () => {
    const result = runBloodVolumeTotal({ weightKg: -70 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("weightKg");
  });
});
