import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDbSubtractBackground, example } from "./tool.js";

describe("acoustics/db-subtract-background", () => {
  it("matches its worked example", () => {
    expect(calculateDbSubtractBackground(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a total level that is not above its background", () => {
    expect(tool.execute({ totalDecibels: 60, backgroundDecibels: 60 }).ok).toBe(
      false,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, totalDecibels: Number.NaN }).ok,
    ).toBe(false);
  });
});
