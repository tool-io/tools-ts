import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateConcreteRetarderDose, example } from "./tool.js";

describe("construction/concrete-retarder-dose", () => {
  it("matches its worked example", () => {
    expect(calculateConcreteRetarderDose(example.input)).toEqual(
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
      tool.execute({ ...example.input, binderKilograms: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative binderKilograms", () => {
    expect(tool.execute({ ...example.input, binderKilograms: -1 }).ok).toBe(
      false,
    );
  });
});
