import { describe, expect, it } from "vitest";
import {
  runWellLogPorositySonicWyllie,
  wellLogPorositySonicWyllieExample,
} from "./tool.js";

describe("well-log-porosity-sonic-wyllie", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWellLogPorositySonicWyllie(wellLogPorositySonicWyllieExample.input),
    ).toEqual({
      ok: true,
      output: wellLogPorositySonicWyllieExample.output,
    });
  });

  it("matches the clean-sand time average without shale", () => {
    const result = runWellLogPorositySonicWyllie({
      sonicSlownessUsPerM: 310,
      matrixSlownessUsPerM: 182,
      fluidSlownessUsPerM: 620,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.correctedPorosity as number).toBeCloseTo(
      (310 - 182) / (620 - 182),
      12,
    );
  });

  it("rejects equal matrix and fluid slowness", () => {
    expect(
      runWellLogPorositySonicWyllie({
        sonicSlownessUsPerM: 300,
        matrixSlownessUsPerM: 200,
        fluidSlownessUsPerM: 200,
      }).ok,
    ).toBe(false);
  });
});
