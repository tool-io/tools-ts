import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateWorkbenchHeight, example } from "./tool.js";

describe("carpentry/workbench-height", () => {
  it("matches its worked example", () => {
    expect(calculateWorkbenchHeight(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, elbowHeightMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative elbowHeightMillimeters", () => {
    expect(
      tool.execute({ ...example.input, elbowHeightMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
