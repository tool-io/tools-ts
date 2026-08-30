import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateLoreysMeanHeight, example } from "./tool.js";

describe("forestry/loreys-mean-height", () => {
  it("matches its worked example", () => {
    expect(calculateLoreysMeanHeight(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, sumBasalAreaTimesHeight: Number.NaN })
        .ok,
    ).toBe(false);
  });
});
