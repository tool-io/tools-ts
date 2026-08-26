import { describe, expect, it } from "vitest";
import {
  runSandpaperRequirement,
  sandpaperRequirementExample,
} from "./tool.js";

describe("sandpaper sheet requirement calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSandpaperRequirement(sandpaperRequirementExample.input)).toEqual({
      ok: true,
      output: sandpaperRequirementExample.output,
    });
  });

  it("defaults to three passes and two square metres per sheet", () => {
    expect(runSandpaperRequirement({ areaM2: 12 })).toEqual({
      ok: true,
      output: { sheetsRequired: 18 },
    });
  });

  it("rounds partial sheets up", () => {
    expect(
      runSandpaperRequirement({ areaM2: 7.3, coveragePerSheetM2: 2 }),
    ).toEqual({
      ok: true,
      output: { sheetsRequired: 11 },
    });
  });

  it("needs no rounding for exact coverage", () => {
    expect(
      runSandpaperRequirement({
        areaM2: 10,
        coveragePerSheetM2: 1.5,
        sandingPasses: 3,
      }),
    ).toEqual({
      ok: true,
      output: { sheetsRequired: 20 },
    });
  });

  it("supports a single pass", () => {
    expect(runSandpaperRequirement({ areaM2: 4, sandingPasses: 1 })).toEqual({
      ok: true,
      output: { sheetsRequired: 2 },
    });
  });

  it("always requires at least one sheet", () => {
    expect(
      runSandpaperRequirement({
        areaM2: 0.01,
        coveragePerSheetM2: 2,
        sandingPasses: 1,
      }),
    ).toEqual({
      ok: true,
      output: { sheetsRequired: 1 },
    });
  });

  it("rejects zero area with the stable code", () => {
    const result = runSandpaperRequirement({ areaM2: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_area");
  });

  it("rejects negative area with the stable code", () => {
    const result = runSandpaperRequirement({ areaM2: -5 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_area");
  });

  it("rejects zero passes", () => {
    const result = runSandpaperRequirement({
      areaM2: 10,
      sandingPasses: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects non-positive coverage with the stable code", () => {
    const result = runSandpaperRequirement({
      areaM2: 10,
      coveragePerSheetM2: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_coverage");
  });

  it("rejects fractional passes", () => {
    expect(runSandpaperRequirement({ areaM2: 10, sandingPasses: 2.5 }).ok).toBe(
      false,
    );
  });

  it("requires the surface area", () => {
    expect(runSandpaperRequirement({}).ok).toBe(false);
  });
});
