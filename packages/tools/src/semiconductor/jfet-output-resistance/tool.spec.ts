import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateJfetOutputResistance, example } from "./tool.js";

describe("semiconductor/jfet-output-resistance", () => {
  it("matches its worked example", () => {
    expect(calculateJfetOutputResistance(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, outputConductanceSiemens: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("rejects a negative outputConductanceSiemens", () => {
    expect(
      tool.execute({ ...example.input, outputConductanceSiemens: -1 }).ok,
    ).toBe(false);
  });
});
