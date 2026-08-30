import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateThickWalledHoopStress, example } from "./tool.js";

describe("engineering/thick-walled-hoop-stress", () => {
  it("matches its worked example", () => {
    expect(calculateThickWalledHoopStress(example.input)).toEqual(
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
      tool.execute({ ...example.input, internalPressurePascals: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("rejects an input outside the stated model", () => {
    expect(tool.execute({ ...example.input, outerRadiusMeters: 0.05 }).ok).toBe(
      false,
    );
  });
});
