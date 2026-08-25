import { describe, expect, it } from "vitest";
import {
  barrelToppingVolumeExample,
  barrelToppingVolumeTool,
  runBarrelToppingVolume,
} from "./tool.js";

describe("barrelToppingVolumeTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runBarrelToppingVolume(barrelToppingVolumeExample.input)).toEqual({
      ok: true,
      output: barrelToppingVolumeExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(barrelToppingVolumeExample))).toEqual(barrelToppingVolumeExample);
    expect(barrelToppingVolumeTool.contractVersion).toBe(1);
    expect(barrelToppingVolumeTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runBarrelToppingVolume(null).ok).toBe(false);
    expect(
      runBarrelToppingVolume({ ...barrelToppingVolumeExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
