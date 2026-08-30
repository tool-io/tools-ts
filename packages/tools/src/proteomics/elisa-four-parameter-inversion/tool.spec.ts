import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
describe(tool.id, () => {
  it("rejects samples outside the fitted response interval", () => {
    expect(tool.execute({ ...example.input, absorbance: 0 })).toMatchObject({
      ok: false,
      error: { code: "invalid_input" },
    });
  });
  it("inverts an increasing curve with a negative Hill slope", () => {
    expect(calculate({ ...example.input, hillSlope: -1 })).toEqual(
      example.output,
    );
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
