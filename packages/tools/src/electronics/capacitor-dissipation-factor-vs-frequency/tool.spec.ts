import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateCapacitorDissipationFactorVsFrequency,
  example,
} from "./tool.js";

describe("electronics/capacitor-dissipation-factor-vs-frequency", () => {
  it("matches its worked example", () => {
    expect(
      calculateCapacitorDissipationFactorVsFrequency(example.input),
    ).toEqual(example.output);
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
    expect(tool.execute({ ...example.input, frequencyHz: Number.NaN }).ok).toBe(
      false,
    );
  });
});
