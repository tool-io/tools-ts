import { describe, expect, it } from "vitest";
import { waterContentExample, runWaterContent } from "./tool.js";

describe("water-content", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWaterContent(waterContentExample.input)).toEqual({
      ok: true,
      output: waterContentExample.output,
    });
  });

  it("returns zero for a dry sample", () => {
    const result = runWaterContent({ dryMassKg: 50, waterMassKg: 0 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.waterContentPercent as number).toBe(0);
  });
  it("rejects non-positive dry masses", () => {
    expect(runWaterContent({ dryMassKg: 0, waterMassKg: 1 }).ok).toBe(false);
  });
});
