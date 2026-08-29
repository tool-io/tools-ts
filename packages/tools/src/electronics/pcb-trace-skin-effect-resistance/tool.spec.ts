import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculatePcbTraceSkinEffectResistance,
  example,
} from "./tool.js";

describe("electronics/pcb-trace-skin-effect-resistance", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculatePcbTraceSkinEffectResistance(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, resistivityOhmMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      resistivityOhmMeters: 0.5,
      relativePermeability: 1,
      frequencyHz: 1000000000,
      traceLengthMeters: 0.1,
      traceWidthMeters: 0.0002,
      traceThicknessMeters: 0.000035,
    });
    expect(result).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_value", field: "frequencyHz" }] },
    });
  });
});
