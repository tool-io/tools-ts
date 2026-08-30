import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDisplayContrastRatio, example } from "./tool.js";

describe("electronics/display-contrast-ratio", () => {
  it("matches its worked example", () => {
    expect(calculateDisplayContrastRatio(example.input)).toEqual(
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
    expect(tool.execute({ ...example.input, whiteNits: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects black luminance above white", () => {
    expect(tool.execute({ ...example.input, blackNits: 600 }).ok).toBe(false);
  });
});
