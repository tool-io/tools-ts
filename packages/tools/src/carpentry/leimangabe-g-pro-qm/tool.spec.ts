import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateLeimangabeGProQm, example } from "./tool.js";

describe("carpentry/leimangabe-g-pro-qm", () => {
  it("matches its worked example", () => {
    expect(calculateLeimangabeGProQm(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, adhesiveGrams: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative adhesiveGrams", () => {
    expect(tool.execute({ ...example.input, adhesiveGrams: -1 }).ok).toBe(
      false,
    );
  });
});
