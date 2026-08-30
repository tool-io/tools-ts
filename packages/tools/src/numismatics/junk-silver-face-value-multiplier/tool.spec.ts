import { describe, expect, it } from "vitest";
import {
  calculateJunkSilverFaceValueMultiplier,
  example,
  runJunkSilverFaceValueMultiplier,
} from "./tool.js";

describe("numismatics/junk-silver-face-value-multiplier", () => {
  it("calculates the published example", () => {
    expect(calculateJunkSilverFaceValueMultiplier(example.input)).toEqual(
      example.output,
    );
    expect(runJunkSilverFaceValueMultiplier(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runJunkSilverFaceValueMultiplier({
      ...example.input,
      faceValueDollars: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
