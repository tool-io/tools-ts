import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateTrenchMosfetSpecificOnResistance,
  example,
} from "./tool.js";

describe("semiconductor/trench-mosfet-specific-on-resistance", () => {
  it("matches its worked example", () => {
    expect(calculateTrenchMosfetSpecificOnResistance(example.input)).toEqual(
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
    expect(tool.execute({ ...example.input, onOhms: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects a negative onOhms", () => {
    expect(tool.execute({ ...example.input, onOhms: -1 }).ok).toBe(false);
  });
});
