import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateCompositeWallThermalResistance,
  example,
} from "./tool.js";

describe("engineering/composite-wall-thermal-resistance", () => {
  it("matches its worked example", () => {
    expect(calculateCompositeWallThermalResistance(example.input)).toEqual(
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
      tool.execute({ ...example.input, firstThicknessMeters: Number.NaN }).ok,
    ).toBe(false);
  });
});
