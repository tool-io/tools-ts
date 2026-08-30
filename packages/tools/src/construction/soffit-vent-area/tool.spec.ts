import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateSoffitVentArea, example } from "./tool.js";

describe("construction/soffit-vent-area", () => {
  it("matches its worked example", () => {
    expect(calculateSoffitVentArea(example.input)).toEqual(example.output);
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
    expect(tool.execute({ ...example.input, ventCount: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects a negative ventCount", () => {
    expect(tool.execute({ ...example.input, ventCount: -1 }).ok).toBe(false);
  });
});
