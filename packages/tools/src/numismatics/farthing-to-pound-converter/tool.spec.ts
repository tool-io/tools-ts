import { describe, expect, it } from "vitest";
import {
  calculateFarthingToPoundConverter,
  example,
  runFarthingToPoundConverter,
} from "./tool.js";

describe("numismatics/farthing-to-pound-converter", () => {
  it("calculates the published example", () => {
    expect(calculateFarthingToPoundConverter(example.input)).toEqual(
      example.output,
    );
    expect(runFarthingToPoundConverter(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runFarthingToPoundConverter({
      ...example.input,
      farthings: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
