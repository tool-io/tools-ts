import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateStrainGaugeBridgeOutput, example } from "./tool.js";

describe("electronics/strain-gauge-bridge-output", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateStrainGaugeBridgeOutput(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, excitationVoltageV: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      excitationVoltageV: 5,
      gaugeFactor: 2,
      strain: -1,
    });
    expect(result).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_value", field: "strain" }] },
    });
  });
});
