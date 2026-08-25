import { describe, expect, it } from "vitest";
import {
  sweeteningReserveVolumeExample,
  sweeteningReserveVolumeTool,
  runSweeteningReserveVolume,
} from "./tool.js";

describe("sweeteningReserveVolumeTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runSweeteningReserveVolume(sweeteningReserveVolumeExample.input),
    ).toEqual({
      ok: true,
      output: sweeteningReserveVolumeExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(sweeteningReserveVolumeExample))).toEqual(
      sweeteningReserveVolumeExample,
    );
    expect(sweeteningReserveVolumeTool.contractVersion).toBe(1);
    expect(sweeteningReserveVolumeTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runSweeteningReserveVolume(null).ok).toBe(false);
    expect(
      runSweeteningReserveVolume({
        ...sweeteningReserveVolumeExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
