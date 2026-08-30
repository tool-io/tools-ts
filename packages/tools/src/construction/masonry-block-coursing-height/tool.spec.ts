import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateMasonryBlockCoursingHeight, example } from "./tool.js";

describe("construction/masonry-block-coursing-height", () => {
  it("matches its worked example", () => {
    expect(calculateMasonryBlockCoursingHeight(example.input)).toEqual(
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
      tool.execute({ ...example.input, blockHeightMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative blockHeightMillimeters", () => {
    expect(
      tool.execute({ ...example.input, blockHeightMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
