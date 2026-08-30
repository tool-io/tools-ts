import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateLumberMoistureContent, example } from "./tool.js";

describe("construction/lumber-moisture-content", () => {
  it("matches its worked example", () => {
    expect(calculateLumberMoistureContent(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, wetMassGrams: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative wetMassGrams", () => {
    expect(tool.execute({ ...example.input, wetMassGrams: -1 }).ok).toBe(false);
  });
});
