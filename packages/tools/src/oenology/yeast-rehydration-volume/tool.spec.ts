import { describe, expect, it } from "vitest";
import {
  yeastRehydrationVolumeExample,
  yeastRehydrationVolumeTool,
  runYeastRehydrationVolume,
} from "./tool.js";

describe("yeastRehydrationVolumeTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runYeastRehydrationVolume(yeastRehydrationVolumeExample.input),
    ).toEqual({
      ok: true,
      output: yeastRehydrationVolumeExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(yeastRehydrationVolumeExample))).toEqual(
      yeastRehydrationVolumeExample,
    );
    expect(yeastRehydrationVolumeTool.contractVersion).toBe(1);
    expect(yeastRehydrationVolumeTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runYeastRehydrationVolume(null).ok).toBe(false);
    expect(
      runYeastRehydrationVolume({
        ...yeastRehydrationVolumeExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
