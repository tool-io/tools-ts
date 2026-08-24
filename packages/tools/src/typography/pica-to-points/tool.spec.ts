import { describe, expect, it } from "vitest";
import { picaToPointsExample as example, runPicaToPoints } from "./tool.js";

describe("Pica to Points Converter", () => {
  it("executes its canonical example", () => {
    expect(runPicaToPoints(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("converts fractional, zero, and signed lengths", () => {
    expect(runPicaToPoints({ picas: 1.5 })).toEqual({
      ok: true,
      output: { points: 18 },
    });
    expect(runPicaToPoints({ picas: 0 })).toEqual({
      ok: true,
      output: { points: 0 },
    });
    expect(runPicaToPoints({ picas: -2 })).toEqual({
      ok: true,
      output: { points: -24 },
    });
  });
});
