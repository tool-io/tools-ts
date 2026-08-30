import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateReactorConversion, example } from "./tool.js";

describe("engineering/reactor-conversion", () => {
  it("matches its worked example", () => {
    expect(calculateReactorConversion(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, inletMolesPerSecond: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an input outside the stated model", () => {
    expect(
      tool.execute({ ...example.input, outletMolesPerSecond: 11 }).ok,
    ).toBe(false);
  });
  it("matches an independently calculated reference", () => {
    expect(tool.execute(example.input)).toMatchObject({
      ok: true,
      output: { conversionFraction: 0.7 },
    });
  });
});
