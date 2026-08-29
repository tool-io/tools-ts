import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

describe("magnetic field conversion", () => {
  it("uses permeability only across H and B", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    const same = tool.execute({
      fromUnit: "G",
      toUnit: "T",
      value: 10000,
      relativePermeability: 100,
    });
    expect(same).toEqual({ ok: true, output: { unit: "T", value: 1 } });
  });
});
