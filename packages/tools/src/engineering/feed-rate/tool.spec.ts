import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateFeedRate, example } from "./tool.js";

describe("engineering/feed-rate", () => {
  it("matches its worked example", () => {
    expect(calculateFeedRate(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, feedMillimetersPerTooth: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("requires positive integer counts", () => {
    expect(tool.execute({ ...example.input, teeth: 0 }).ok).toBe(false);
  });
});
