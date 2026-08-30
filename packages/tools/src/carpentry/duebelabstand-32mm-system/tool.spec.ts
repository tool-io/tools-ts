import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDuebelabstand32mmSystem, example } from "./tool.js";

describe("carpentry/duebelabstand-32mm-system", () => {
  it("matches its worked example", () => {
    expect(calculateDuebelabstand32mmSystem(example.input)).toEqual(
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
      tool.execute({ ...example.input, firstCenterMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative firstCenterMillimeters", () => {
    expect(
      tool.execute({ ...example.input, firstCenterMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
