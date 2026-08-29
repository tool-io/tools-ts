import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateSampleAndHoldAcquisitionTime,
  example,
} from "./tool.js";

describe("electronics/sample-and-hold-acquisition-time", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateSampleAndHoldAcquisitionTime(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, sourceResistanceOhms: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      sourceResistanceOhms: 1000,
      switchResistanceOhms: 100,
      holdCapacitanceFarads: 1e-9,
      remainingErrorFraction: 0,
    });
    expect(result).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_value", field: "remainingErrorFraction" }],
      },
    });
  });
});
