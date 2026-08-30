import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";

describe(tool.id, () => {
  it("computes the canonical result", () => {
    expect(calculate(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and unknown inputs", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects beta endpoints without producing an infinite M-value", () => {
    expect(tool.execute({ beta: 0 })).toMatchObject({ ok: false });
    expect(tool.execute({ beta: 1 })).toMatchObject({ ok: false });
    expect(calculate({ beta: 0.8 }).mValue).toBeCloseTo(2);
  });
});
