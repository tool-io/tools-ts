import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
describe(tool.id, () => {
  it("computes the canonical example", () => {
    expect(calculate(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid contract", () =>
    expect(validateToolContract(tool)).toEqual([]));
  it("rejects missing and unknown inputs", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("retains genuine Kendrick mass defects", () => {
    const output = calculate({
      exactMassDa: 15,
      exactRepeatMassDa: 14,
      nominalRepeatMassDa: 13,
    });
    expect(output.kendrickMass).toBeCloseTo(13.928571428571429);
    expect(output.kendrickDefect).toBeCloseTo(0.07142857142857117);
  });
});
