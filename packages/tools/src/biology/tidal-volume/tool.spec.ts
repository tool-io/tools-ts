import { describe, expect, it } from "vitest";
import { runTidalVolume, tidalVolumeExample } from "./tool.js";

describe("Tidal Volume Estimate (Radford)", () => {
  it("publishes an executable example", () =>
    expect(runTidalVolume(tidalVolumeExample.input)).toEqual({
      ok: true,
      output: tidalVolumeExample.output,
    }));
  it("multiplies weight by eight millilitres per kilogram", () =>
    expect(runTidalVolume({ weightKg: 12.5 })).toEqual({
      ok: true,
      output: { tidalVolumeMl: 100 },
    }));
  it("handles low body weights", () =>
    expect(runTidalVolume({ weightKg: 0.5 })).toEqual({
      ok: true,
      output: { tidalVolumeMl: 4 },
    }));
  it("handles high body weights", () =>
    expect(runTidalVolume({ weightKg: 150 })).toEqual({
      ok: true,
      output: { tidalVolumeMl: 1200 },
    }));
  it("rejects zero weight", () => {
    const result = runTidalVolume({ weightKg: 0 });
    expect(result.ok).toBe(false);
  });
  it("rejects negative weight", () => {
    const result = runTidalVolume({ weightKg: -70 });
    expect(result.ok).toBe(false);
  });
  it("rejects missing inputs", () => expect(runTidalVolume({}).ok).toBe(false));
});
