import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateTransformerTurnsRatioSimple, example } from "./tool.js";

describe("engineering/transformer-turns-ratio-simple", () => {
  it("matches its worked example", () => {
    expect(calculateTransformerTurnsRatioSimple(example.input)).toEqual(
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
      tool.execute({ ...example.input, primaryTurns: Number.NaN }).ok,
    ).toBe(false);
  });
  it("requires positive integer counts", () => {
    expect(tool.execute({ ...example.input, primaryTurns: 0 }).ok).toBe(false);
    expect(tool.execute({ ...example.input, secondaryTurns: 0 }).ok).toBe(
      false,
    );
  });
});
