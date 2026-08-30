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
  it("handles a representative boundary", () => {
    expect(calculate(edgeCase.input)).toEqual(edgeCase.output);
  });
  it("publishes a valid contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects non-finite numeric input", () => {
    const numericInput = tool.ports.inputs.find(
      (port) =>
        port.valueType.type === "number" || port.valueType.type === "integer",
    );
    if (numericInput !== undefined)
      expect(
        tool.execute({ ...example.input, [numericInput.id]: Number.NaN }),
      ).toMatchObject({ ok: false });
  });
  it("rejects missing and unknown fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unexpected: true })).toMatchObject({
      ok: false,
    });
  });
});
