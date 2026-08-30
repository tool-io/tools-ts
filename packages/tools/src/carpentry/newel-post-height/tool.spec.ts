import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateNewelPostHeight, example } from "./tool.js";

describe("carpentry/newel-post-height", () => {
  it("matches its worked example", () => {
    expect(calculateNewelPostHeight(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, exposedMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative exposedMillimeters", () => {
    expect(tool.execute({ ...example.input, exposedMillimeters: -1 }).ok).toBe(
      false,
    );
  });
});
