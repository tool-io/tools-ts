import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateMasonryBrickCoursingHeight, example } from "./tool.js";

describe("construction/masonry-brick-coursing-height", () => {
  it("matches its worked example", () => {
    expect(calculateMasonryBrickCoursingHeight(example.input)).toEqual(
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
      tool.execute({ ...example.input, brickHeightMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative brickHeightMillimeters", () => {
    expect(
      tool.execute({ ...example.input, brickHeightMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
