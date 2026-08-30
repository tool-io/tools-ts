import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePaperASeriesAreaMm2, example } from "./tool.js";

describe("cartography/paper-a-series-area-mm2", () => {
  it("matches its worked example", () => {
    expect(calculatePaperASeriesAreaMm2(example.input)).toEqual(example.output);
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
    expect(tool.execute({ ...example.input, aNumber: Number.NaN }).ok).toBe(
      false,
    );
  });
});
