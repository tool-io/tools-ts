import { describe, expect, it } from "vitest";
import { epoxyMixRatioExample, runEpoxyMixRatio } from "./tool.js";

describe("Epoxy Mix Ratio Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEpoxyMixRatio(epoxyMixRatioExample.input)).toEqual({
      ok: true,
      output: epoxyMixRatioExample.output,
    });
  });

  it("mixes equal parts for the 1:1 system", () => {
    expect(runEpoxyMixRatio({ resinGrams: 250, system: "1:1" })).toEqual({
      ok: true,
      output: { hardenerGrams: 250, hardenerParts: 1, resinParts: 1 },
    });
  });

  it("mixes one fifth hardener for the 5:1 system", () => {
    expect(runEpoxyMixRatio({ resinGrams: 250, system: "5:1" })).toEqual({
      ok: true,
      output: { hardenerGrams: 50, hardenerParts: 1, resinParts: 5 },
    });
  });

  it("always reports one hardener part", () => {
    for (const system of ["1:1", "2:1", "5:1"] as const) {
      const result = runEpoxyMixRatio({ resinGrams: 100, system });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.output.hardenerParts).toBe(1);
    }
  });

  it("scales linearly with the resin mass", () => {
    expect(runEpoxyMixRatio({ resinGrams: 500, system: "2:1" })).toEqual({
      ok: true,
      output: { hardenerGrams: 250, hardenerParts: 1, resinParts: 2 },
    });
  });

  it("rejects a zero resin mass", () => {
    const result = runEpoxyMixRatio({ resinGrams: 0, system: "2:1" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_resin_grams");
  });

  it("rejects a negative resin mass", () => {
    const result = runEpoxyMixRatio({ resinGrams: -100, system: "2:1" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_resin_grams");
  });

  it("rejects unknown systems", () => {
    const result = runEpoxyMixRatio({
      resinGrams: 100,
      system: "3:1" as never,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("requires the resin mass and the system", () => {
    expect(runEpoxyMixRatio({ system: "2:1" }).ok).toBe(false);
    expect(runEpoxyMixRatio({ resinGrams: 100 }).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runEpoxyMixRatio(100).ok).toBe(false);
  });
});
