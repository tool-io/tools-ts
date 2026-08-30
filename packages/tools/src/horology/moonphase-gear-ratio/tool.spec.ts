import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateMoonphaseGearRatio, example } from "./tool.js";

describe("horology/moonphase-gear-ratio", () => {
  it("matches its worked example", () => {
    expect(calculateMoonphaseGearRatio(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("gives a 29.5-day display cycle for 59 teeth advanced twice daily", () => {
    expect(tool.execute({ discTeeth: 59, advancesPerDay: 2 })).toEqual({
      ok: true,
      output: { displayCycleDays: 29.5 },
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, discTeeth: Number.NaN }).ok).toBe(
      false,
    );
  });
});
