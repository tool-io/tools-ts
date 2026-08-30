import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateTreppenBequemlichkeitsregel, example } from "./tool.js";

describe("carpentry/treppen-bequemlichkeitsregel", () => {
  it("matches its worked example", () => {
    expect(calculateTreppenBequemlichkeitsregel(example.input)).toEqual(
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
      tool.execute({ ...example.input, goingMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative goingMillimeters", () => {
    expect(tool.execute({ ...example.input, goingMillimeters: -1 }).ok).toBe(
      false,
    );
  });
});
