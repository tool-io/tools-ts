import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateKuechenHaengeschrankMontagehoehe,
  example,
} from "./tool.js";

describe("carpentry/kuechen-haengeschrank-montagehoehe", () => {
  it("matches its worked example", () => {
    expect(calculateKuechenHaengeschrankMontagehoehe(example.input)).toEqual(
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
      tool.execute({
        ...example.input,
        countertopHeightMillimeters: Number.NaN,
      }).ok,
    ).toBe(false);
  });
  it("rejects a negative countertopHeightMillimeters", () => {
    expect(
      tool.execute({ ...example.input, countertopHeightMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
