import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculate, edgeCase, example } from "./tool.js";

describe(tool.id, () => {
  it("executes its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("handles a representative edge case", () => {
    expect(() => calculate(edgeCase)).not.toThrow();
  });
  it("publishes a valid contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and unknown input", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unexpected: true })).toMatchObject({
      ok: false,
    });
  });
});
