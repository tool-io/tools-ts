import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateQuantumDotPhotoluminescenceQuantumYield,
  example,
} from "./tool.js";

describe("semiconductor/quantum-dot-photoluminescence-quantum-yield", () => {
  it("matches its worked example", () => {
    expect(
      calculateQuantumDotPhotoluminescenceQuantumYield(example.input),
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
    expect(
      tool.execute({ ...example.input, emittedPhotons: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative emittedPhotons", () => {
    expect(tool.execute({ ...example.input, emittedPhotons: -1 }).ok).toBe(
      false,
    );
  });
});
