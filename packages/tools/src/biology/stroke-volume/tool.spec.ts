import { describe, expect, it } from "vitest";
import { runStrokeVolume, strokeVolumeExample } from "./tool.js";

describe("Stroke Volume mL", () => {
  it("publishes an executable example", () =>
    expect(runStrokeVolume(strokeVolumeExample.input)).toEqual({
      ok: true,
      output: strokeVolumeExample.output,
    }));
  it("subtracts end-systolic from end-diastolic volume", () =>
    expect(runStrokeVolume({ endDiastolicMl: 130, endSystolicMl: 55 })).toEqual(
      { ok: true, output: { strokeVolumeMl: 75 } },
    ));
  it("allows equal volumes yielding zero", () =>
    expect(runStrokeVolume({ endDiastolicMl: 55, endSystolicMl: 55 })).toEqual({
      ok: true,
      output: { strokeVolumeMl: 0 },
    }));
  it("rejects end-systolic above end-diastolic volume", () => {
    const result = runStrokeVolume({ endDiastolicMl: 50, endSystolicMl: 80 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("negative_volume");
  });
  it("rejects zero end-diastolic volume", () => {
    const result = runStrokeVolume({ endDiastolicMl: 0, endSystolicMl: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative end-diastolic volume", () => {
    const result = runStrokeVolume({ endDiastolicMl: -120, endSystolicMl: 50 });
    expect(result.ok).toBe(false);
  });
});
