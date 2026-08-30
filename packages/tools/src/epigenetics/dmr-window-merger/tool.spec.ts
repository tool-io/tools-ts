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
  it("merges overlapping and adjacent windows without double counting nested bounds", () => {
    expect(
      calculate({
        startsBp: [0, 5, 25],
        endsBp: [20, 10, 30],
        maximumGapBp: 5,
      }),
    ).toEqual({
      mergedStartsBp: [0],
      mergedEndsBp: [30],
      regionCount: 1,
    });
    expect(
      tool.execute({ startsBp: [10, 0], endsBp: [20, 5], maximumGapBp: 0 }),
    ).toMatchObject({ ok: false });
  });
});
