import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateMramRetentionTime, example } from "./tool.js";

describe("semiconductor/mram-retention-time", () => {
  it("matches its worked example", () => {
    expect(calculateMramRetentionTime(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, attemptSeconds: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative attemptSeconds", () => {
    expect(tool.execute({ ...example.input, attemptSeconds: -1 }).ok).toBe(
      false,
    );
  });
});
