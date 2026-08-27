import { describe, expect, it } from "vitest";
import {
  calculateInductiveReactance,
  inductiveReactanceExample,
  runInductiveReactance,
} from "./tool.js";

describe("inductive reactance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runInductiveReactance(inductiveReactanceExample.input)).toEqual({
      ok: true,
      output: inductiveReactanceExample.output,
    });
  });

  it("doubles reactance when frequency doubles", () => {
    expect(
      calculateInductiveReactance({ frequencyHz: 2000, inductanceH: 0.01 })
        .reactanceOhms,
    ).toBeCloseTo(
      calculateInductiveReactance({ frequencyHz: 1000, inductanceH: 0.01 })
        .reactanceOhms * 2,
      12,
    );
  });

  it("rejects non-positive inputs through execution", () => {
    for (const bad of [
      { frequencyHz: 1000, inductanceH: 0 },
      { frequencyHz: -1000, inductanceH: 0.01 },
    ])
      expect(runInductiveReactance(bad).ok).toBe(false);
  });
});
