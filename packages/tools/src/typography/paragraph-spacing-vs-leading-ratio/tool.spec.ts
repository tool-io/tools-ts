import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateParagraphSpacingVsLeadingRatio,
  example,
} from "./tool.js";

describe("typography/paragraph-spacing-vs-leading-ratio", () => {
  it("matches its worked example", () => {
    expect(calculateParagraphSpacingVsLeadingRatio(example.input)).toEqual(
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
      tool.execute({ ...example.input, paragraphGapPixels: Number.NaN }).ok,
    ).toBe(false);
  });
});
