import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateBrickCoursingCount, example } from "./tool.js";

describe("construction/brick-coursing-count", () => {
  it("matches its worked example", () => {
    expect(calculateBrickCoursingCount(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, wallMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative wallMillimeters", () => {
    expect(tool.execute({ ...example.input, wallMillimeters: -1 }).ok).toBe(
      false,
    );
  });
});
