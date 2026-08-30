import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDeflectionLimitCheck, example } from "./tool.js";

describe("engineering/deflection-limit-check", () => {
  it("matches its worked example", () => {
    expect(calculateDeflectionLimitCheck(example.input)).toEqual(
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
      tool.execute({ ...example.input, deflectionMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("flags deflection beyond the supplied allowable limit", () => {
    expect(
      calculateDeflectionLimitCheck({
        ...example.input,
        allowableDeflectionMillimeters: 9,
      }).withinLimit,
    ).toBe(false);
  });
});
