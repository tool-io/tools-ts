import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateSubtitleCharactersPerSecond, example } from "./tool.js";

describe("film/subtitle-characters-per-second", () => {
  it("matches its worked example", () => {
    expect(calculateSubtitleCharactersPerSecond(example.input)).toEqual(
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
      tool.execute({ ...example.input, visibleCharacters: Number.NaN }).ok,
    ).toBe(false);
  });
});
