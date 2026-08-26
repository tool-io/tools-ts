import { describe, expect, it } from "vitest";
import { sailAreaExample, runSailArea } from "./tool.js";

describe("sail area calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSailArea(sailAreaExample.input)).toEqual({
      ok: true,
      output: sailAreaExample.output,
    });
  });

  it("rejects non-positive dimensions through execution", () => {
    for (const bad of [
      { pLengthFt: 0, eFootFt: 10 },
      { pLengthFt: 40, eFootFt: -1 },
    ])
      expect(runSailArea(bad).ok).toBe(false);
  });

  it("scales linearly with either triangular dimension", () => {
    expect(runSailArea({ eFootFt: 24, pLengthFt: 40 })).toEqual({
      ok: true,
      output: { areaFt2: 480 },
    });
  });
});
