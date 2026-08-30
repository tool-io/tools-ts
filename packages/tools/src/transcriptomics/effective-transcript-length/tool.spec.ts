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
  it("unions nested exons and floors an undersized transcript at zero", () => {
    expect(
      calculate({
        transcriptLengthBp: 100,
        exonStartsBp: [0, 20],
        exonEndsBp: [100, 40],
        fragmentLengthBp: 150,
      }),
    ).toEqual({
      exonUnionLengthBp: 100,
      effectiveLengthBp: 0,
      overlapBasesBp: 20,
    });
    expect(
      tool.execute({
        transcriptLengthBp: 100,
        exonStartsBp: [80],
        exonEndsBp: [120],
        fragmentLengthBp: 5,
      }),
    ).toMatchObject({ ok: false });
  });
});
