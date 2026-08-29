import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculatePcbImpedanceMismatchReflection,
  example,
} from "./tool.js";

describe("electronics/pcb-impedance-mismatch-reflection", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculatePcbImpedanceMismatchReflection(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({
        ...example.input,
        characteristicImpedanceOhms: Number.NaN,
      }).ok,
    ).toBe(false);
  });
  it("preserves finite results at extreme input scales", () => {
    const result = tool.execute({
      ...example.input,
      ...{ characteristicImpedanceOhms: 1e308, loadImpedanceOhms: 1e308 },
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.reflectionCoefficient).toBe(0);
  });
});
