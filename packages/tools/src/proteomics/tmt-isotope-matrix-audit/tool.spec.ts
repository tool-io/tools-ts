import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
describe(tool.id, () => {
  it("rejects a singular correction matrix", () => {
    expect(
      tool.execute({
        reporterSignals: [1, 2],
        isotopeMixingMatrix: [
          [1, 1],
          [2, 2],
        ],
      }),
    ).toMatchObject({ ok: false, error: { code: "invalid_input" } });
  });
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
    expect(tool.execute({ ...example.input, unexpected: true })).toMatchObject({
      ok: false,
    });
  });
});
