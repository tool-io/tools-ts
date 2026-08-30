import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateLumberWeightPerBoardFoot, example } from "./tool.js";

describe("construction/lumber-weight-per-board-foot", () => {
  it("matches its worked example", () => {
    expect(calculateLumberWeightPerBoardFoot(example.input)).toEqual(
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
      tool.execute({ ...example.input, densityKgPerM3: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative densityKgPerM3", () => {
    expect(tool.execute({ ...example.input, densityKgPerM3: -1 }).ok).toBe(
      false,
    );
  });
});
