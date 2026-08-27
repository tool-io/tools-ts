import { describe, expect, it } from "vitest";
import { voidRatioExample, runVoidRatio } from "./tool.js";

describe("void-ratio", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVoidRatio(voidRatioExample.input)).toEqual({
      ok: true,
      output: voidRatioExample.output,
    });
  });

  it("returns zero for a void-free medium", () => {
    const result = runVoidRatio({ solidsVolumeM3: 2, voidVolumeM3: 0 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.voidRatio as number).toBe(0);
  });
  it("rejects non-positive solids volumes", () => {
    expect(runVoidRatio({ solidsVolumeM3: 0, voidVolumeM3: 1 }).ok).toBe(false);
  });
});
