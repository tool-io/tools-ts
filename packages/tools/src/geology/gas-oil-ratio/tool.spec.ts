import { describe, expect, it } from "vitest";
import { gasOilRatioExample, runGasOilRatio } from "./tool.js";

describe("gas-oil-ratio", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGasOilRatio(gasOilRatioExample.input)).toEqual({
      ok: true,
      output: gasOilRatioExample.output,
    });
  });

  it("reports zero for a non-gas producer", () => {
    const result = runGasOilRatio({ gasVolumeSm3: 0, oilVolumeSm3: 25 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.gasOilRatioSm3PerSm3 as number).toBe(0);
  });
  it("rejects non-positive oil volumes", () => {
    expect(runGasOilRatio({ gasVolumeSm3: 10, oilVolumeSm3: 0 }).ok).toBe(
      false,
    );
  });
});
