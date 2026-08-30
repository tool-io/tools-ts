import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateVaractorCapacitanceVsVoltage,
  example,
} from "./tool.js";

describe("semiconductor/varactor-capacitance-vs-voltage", () => {
  it("matches its worked example", () => {
    expect(calculateVaractorCapacitanceVsVoltage(example.input)).toEqual(
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
      tool.execute({ ...example.input, zeroBiasFarads: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative zeroBiasFarads", () => {
    expect(tool.execute({ ...example.input, zeroBiasFarads: -1 }).ok).toBe(
      false,
    );
  });
});
