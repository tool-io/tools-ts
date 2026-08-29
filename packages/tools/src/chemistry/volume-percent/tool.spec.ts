import { describe, expect, it } from "vitest";
import { runVolumePercent, volumePercentExample } from "./tool.js";

describe("Volume Percent Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVolumePercent(volumePercentExample.input)).toEqual({
      ok: true,
      output: volumePercentExample.output,
    });
  });

  it("computes one hundred percent for identical volumes", () => {
    expect(
      runVolumePercent({ volumeComponentML: 25, volumeSolutionML: 25 }),
    ).toEqual({
      ok: true,
      output: { volumePercent: 100 },
    });
  });

  it("computes twenty percent for a one in five mix", () => {
    expect(
      runVolumePercent({ volumeComponentML: 10, volumeSolutionML: 50 }),
    ).toEqual({
      ok: true,
      output: { volumePercent: 20 },
    });
  });

  it("rejects a component volume larger than the solution", () => {
    const result = runVolumePercent({
      volumeComponentML: 70,
      volumeSolutionML: 60,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_masses");
  });

  it("rejects a zero solution volume", () => {
    const result = runVolumePercent({
      volumeComponentML: 15,
      volumeSolutionML: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_masses");
  });

  it("rejects a negative component volume", () => {
    const result = runVolumePercent({
      volumeComponentML: -15,
      volumeSolutionML: 60,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_masses");
  });

  it("requires both volumes", () => {
    expect(runVolumePercent({ volumeComponentML: 15 }).ok).toBe(false);
    expect(runVolumePercent({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runVolumePercent(15).ok).toBe(false);
  });
});
