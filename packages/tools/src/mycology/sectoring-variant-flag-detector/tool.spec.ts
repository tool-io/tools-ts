import { describe, expect, it } from "vitest";
import {
  runSectoringVariantFlagDetector,
  sectoringVariantFlagDetectorExample,
} from "./tool.js";
describe("Sectoring Flag Detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSectoringVariantFlagDetector(
        sectoringVariantFlagDetectorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: sectoringVariantFlagDetectorExample.output,
    });
  });
  it("reports no sectoring when no sector is counted", () => {
    expect(runSectoringVariantFlagDetector({ sectorCount: 0 })).toEqual({
      ok: true,
      output: { sectorCount: 0, sectoringDetected: false },
    });
  });
  it("detects a single sector", () => {
    expect(runSectoringVariantFlagDetector({ sectorCount: 1 })).toEqual({
      ok: true,
      output: { sectorCount: 1, sectoringDetected: true },
    });
  });
  it("rejects invalid input", () => {
    expect(runSectoringVariantFlagDetector({ sectorCount: -1 }).ok).toBe(false);
  });
});
