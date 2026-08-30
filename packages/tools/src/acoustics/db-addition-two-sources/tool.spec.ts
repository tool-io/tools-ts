import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDbAdditionTwoSources, example } from "./tool.js";

describe("acoustics/db-addition-two-sources", () => {
  it("matches its worked example", () => {
    expect(calculateDbAdditionTwoSources(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("adds two independent 60 dB sources energetically", () => {
    expect(
      calculateDbAdditionTwoSources({ firstDecibels: 60, secondDecibels: 60 })
        .combinedDecibels,
    ).toBeCloseTo(63.0103, 4);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, firstDecibels: Number.NaN }).ok,
    ).toBe(false);
  });
});
