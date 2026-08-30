import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDeckenpaneeleBedarf, example } from "./tool.js";

describe("carpentry/deckenpaneele-bedarf", () => {
  it("matches its worked example", () => {
    expect(calculateDeckenpaneeleBedarf(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, ceilingSquareMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative ceilingSquareMeters", () => {
    expect(tool.execute({ ...example.input, ceilingSquareMeters: -1 }).ok).toBe(
      false,
    );
  });
});
