import { describe, expect, it } from "vitest";
import {
  grossLeesVolumeExample,
  grossLeesVolumeTool,
  runGrossLeesVolume,
} from "./tool.js";

describe("grossLeesVolumeTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runGrossLeesVolume(grossLeesVolumeExample.input)).toEqual({
      ok: true,
      output: grossLeesVolumeExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(grossLeesVolumeExample))).toEqual(
      grossLeesVolumeExample,
    );
    expect(grossLeesVolumeTool.contractVersion).toBe(1);
    expect(grossLeesVolumeTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runGrossLeesVolume(null).ok).toBe(false);
    expect(
      runGrossLeesVolume({
        ...grossLeesVolumeExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("returns zero for a measured zero-depth layer", () => {
    expect(
      runGrossLeesVolume({ leesDepthCm: 0, vesselDiameterCm: 60 }),
    ).toEqual({
      ok: true,
      output: { leesLiters: 0 },
    });
  });
});
