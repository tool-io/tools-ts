import { describe, expect, it } from "vitest";
import { runCfseMeanFluorescence } from "./tool.js";

describe("CFSE MFI Halving", () => {
  it("calculates a valid result", () =>
    expect(
      runCfseMeanFluorescence({
        currentMfi: 64,
        parentGenerationMfi: 256,
      }),
    ).toEqual({
      ok: true,
      output: { generationHalvings: 2 },
    }));
  it("resolves fractional halvings", () =>
    expect(
      runCfseMeanFluorescence({
        currentMfi: 100,
        parentGenerationMfi: 300,
      }),
    ).toEqual({
      ok: true,
      output: { generationHalvings: 1.584962500721156 },
    }));
  it("returns zero for identical intensities", () =>
    expect(
      runCfseMeanFluorescence({
        currentMfi: 500,
        parentGenerationMfi: 500,
      }),
    ).toEqual({
      ok: true,
      output: { generationHalvings: 0 },
    }));
  it("rejects a current MFI above the parent", () => {
    const result = runCfseMeanFluorescence({
      currentMfi: 512,
      parentGenerationMfi: 256,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("no_division");
  });
  it("rejects non-positive MFIs", () => {
    expect(
      runCfseMeanFluorescence({ currentMfi: 0, parentGenerationMfi: 256 }).ok,
    ).toBe(false);
    expect(
      runCfseMeanFluorescence({
        currentMfi: 64,
        parentGenerationMfi: -256,
      }).ok,
    ).toBe(false);
  });
});
