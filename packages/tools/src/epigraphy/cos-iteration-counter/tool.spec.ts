import { describe, expect, it } from "vitest";
import {
  calculateCosIterationCounter,
  cosIterationCounterExample,
  runCosIterationCounter,
} from "./tool.js";

describe("epigraphy/cos-iteration-counter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCosIterationCounter(cosIterationCounterExample.input)).toEqual({
      ok: true,
      output: cosIterationCounterExample.output,
    });
  });

  it("reads bare cos. as one and iterum as two", () => {
    expect(
      calculateCosIterationCounter({ text: "Ti. Claudius Nero cos." }),
    ).toEqual({ found: true, iteration: 1, marker: "cos." });
    expect(
      calculateCosIterationCounter({ text: "M. Vipsanius Agrippa iterum" }),
    ).toEqual({ found: true, iteration: 2, marker: "iterum" });
    expect(calculateCosIterationCounter({ text: "Augustus cos. 12" })).toEqual({
      found: true,
      iteration: 12,
      marker: "cos. 12",
    });
  });

  it("ignores words merely containing cos and reports absence", () => {
    expect(
      calculateCosIterationCounter({
        text: "procos legatus cosmos designatus",
      }),
    ).toEqual({ found: false, iteration: 0, marker: "" });
  });

  it("rejects blank text", () => {
    expect(runCosIterationCounter({ text: "" }).ok).toBe(false);
  });
});
