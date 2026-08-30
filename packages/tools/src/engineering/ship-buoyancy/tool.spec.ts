import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateShipBuoyancy, example } from "./tool.js";

describe("engineering/ship-buoyancy", () => {
  it("matches its worked example", () => {
    expect(calculateShipBuoyancy(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, fluidDensityKgPerM3: Number.NaN }).ok,
    ).toBe(false);
  });
  it("matches an independently calculated reference", () => {
    expect(tool.execute(example.input)).toMatchObject({
      ok: true,
      output: { buoyantNewtons: 1005525 },
    });
  });
});
