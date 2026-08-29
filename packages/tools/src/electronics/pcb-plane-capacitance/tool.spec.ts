import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePcbPlaneCapacitance, example } from "./tool.js";

describe("electronics/pcb-plane-capacitance", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculatePcbPlaneCapacitance(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, overlapAreaSquareMeters: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      overlapAreaSquareMeters: 0.01,
      dielectricThicknessMeters: 0.001,
      relativePermittivity: 5e-324,
    });
    expect(result).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_value", field: "relativePermittivity" }],
      },
    });
  });
});
