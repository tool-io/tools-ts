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
  it("rejects impossible overlap counts and reports a tail probability", () => {
    expect(calculate(example.input).upperTailP).toBeCloseTo(2 / 9);
    expect(tool.execute({ ...example.input, overlapSize: 9 })).toMatchObject({
      ok: false,
    });
    const large = calculate({
      populationSize: 1000,
      pathwaySize: 200,
      selectedSize: 100,
      overlapSize: 20,
    });
    expect(large.upperTailP).toBeGreaterThan(0);
    expect(large.upperTailP).toBeLessThan(1);
  });
});
