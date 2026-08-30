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
  it("interpolates non-integer half-height crossings", () => {
    const output = calculate({
      timesMinutes: [0, 1, 2, 3, 4],
      intensities: [0, 2, 10, 3, 0],
    });
    expect(output.leftHalfHeightMinute).toBeCloseTo(1.375);
    expect(output.rightHalfHeightMinute).toBeCloseTo(2 + 5 / 7);
  });
});
