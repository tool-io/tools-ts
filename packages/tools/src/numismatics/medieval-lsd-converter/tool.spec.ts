import { describe, expect, it } from "vitest";
import {
  calculateMedievalLsdConverter,
  example,
  runMedievalLsdConverter,
} from "./tool.js";

describe("numismatics/medieval-lsd-converter", () => {
  it("calculates the published example", () => {
    expect(calculateMedievalLsdConverter(example.input)).toEqual(
      example.output,
    );
    expect(runMedievalLsdConverter(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runMedievalLsdConverter({
      ...example.input,
      pounds: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
