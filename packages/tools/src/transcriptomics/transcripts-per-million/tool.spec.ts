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
  it("rejects zero total abundance and handles length correction", () => {
    expect(
      tool.execute({
        transcriptCounts: [0, 0],
        effectiveLengthsBp: [1000, 1000],
      }),
    ).toMatchObject({ ok: false });
    expect(calculate(example.input).tpm[0]).toBeCloseTo(
      2 * calculate(example.input).tpm[1],
    );
  });
});
