import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePerovskiteToleranceFactor, example } from "./tool.js";

describe("semiconductor/perovskite-tolerance-factor", () => {
  it("matches its worked example", () => {
    expect(calculatePerovskiteToleranceFactor(example.input)).toEqual(
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
      tool.execute({ ...example.input, aRadiusPicometers: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative aRadiusPicometers", () => {
    expect(tool.execute({ ...example.input, aRadiusPicometers: -1 }).ok).toBe(
      false,
    );
  });
});
