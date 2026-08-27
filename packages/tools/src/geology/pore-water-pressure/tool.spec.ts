import { describe, expect, it } from "vitest";
import { poreWaterPressureExample, runPoreWaterPressure } from "./tool.js";

describe("pore-water-pressure", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPoreWaterPressure(poreWaterPressureExample.input)).toEqual({
      ok: true,
      output: poreWaterPressureExample.output,
    });
  });

  it("scales linearly with water column height", () => {
    const result = runPoreWaterPressure({ waterColumnHeightM: 10 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.porePressureKPa as number).toBeCloseTo(98.1, 12);
  });

  it("rejects negative water column heights", () => {
    expect(runPoreWaterPressure({ waterColumnHeightM: -1 }).ok).toBe(false);
  });
});
