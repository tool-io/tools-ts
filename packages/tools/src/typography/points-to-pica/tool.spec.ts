import { describe, expect, it } from "vitest";
import { pointsToPicaExample as example, runPointsToPica } from "./tool.js";

describe("Points to Pica Converter", () => {
  it("executes its canonical decimal example", () => {
    expect(runPointsToPica(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("converts fractional, zero, and signed lengths", () => {
    expect(runPointsToPica({ points: 12 })).toEqual({
      ok: true,
      output: { picas: 1 },
    });
    expect(runPointsToPica({ points: 0 })).toEqual({
      ok: true,
      output: { picas: 0 },
    });
    expect(runPointsToPica({ points: -6 })).toEqual({
      ok: true,
      output: { picas: -0.5 },
    });
  });
});
