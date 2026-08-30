import { describe, expect, it } from "vitest";
import {
  calculatePre1982CentCopperMeltValue,
  example,
  runPre1982CentCopperMeltValue,
} from "./tool.js";

describe("numismatics/pre-1982-cent-copper-melt-value", () => {
  it("calculates the published example", () => {
    expect(calculatePre1982CentCopperMeltValue(example.input)).toEqual(
      example.output,
    );
    expect(runPre1982CentCopperMeltValue(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runPre1982CentCopperMeltValue({
      ...example.input,
      coinCount: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
