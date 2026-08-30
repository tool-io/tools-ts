import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateSolarCellMaxPower, example } from "./tool.js";

describe("electronics/solar-cell-max-power", () => {
  it("matches the exact fill-factor power", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateSolarCellMaxPower(example.input)).toEqual(example.output);
  });
  it("publishes a valid contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("handles zero fill factor and rejects factors above one", () => {
    expect(tool.execute({ ...example.input, fillFactor: 0 })).toEqual({
      ok: true,
      output: { maximumPowerW: 0 },
    });
    expect(tool.execute({ ...example.input, fillFactor: 1.1 }).ok).toBe(false);
    expect(tool.execute({ ...example.input, fillFactor: Number.NaN }).ok).toBe(
      false,
    );
    expect(tool.execute({}).ok).toBe(false);
  });
});
