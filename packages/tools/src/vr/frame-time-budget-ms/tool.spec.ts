import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateFrameTimeBudgetMs, example } from "./tool.js";

describe("vr/frame-time-budget-ms", () => {
  it("matches its worked example", () => {
    expect(calculateFrameTimeBudgetMs(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("gives a 90 Hz display about 11.11 ms per frame", () => {
    const result = tool.execute({ refreshHertz: 90 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.millisecondsPerFrame).toBeCloseTo(11.111111, 5);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, refreshHertz: Number.NaN }).ok,
    ).toBe(false);
  });
});
