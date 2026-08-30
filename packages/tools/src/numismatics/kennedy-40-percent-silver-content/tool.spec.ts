import { describe, expect, it } from "vitest";
import {
  calculateKennedy40PercentSilverContent,
  example,
  runKennedy40PercentSilverContent,
} from "./tool.js";

describe("numismatics/kennedy-40-percent-silver-content", () => {
  it("calculates the published example", () => {
    expect(calculateKennedy40PercentSilverContent(example.input)).toEqual(
      example.output,
    );
    expect(runKennedy40PercentSilverContent(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runKennedy40PercentSilverContent({
      ...example.input,
      coinCount: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
