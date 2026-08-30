import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateDrywallJointCompoundCoverage,
  example,
} from "./tool.js";

describe("construction/drywall-joint-compound-coverage", () => {
  it("matches its worked example", () => {
    expect(calculateDrywallJointCompoundCoverage(example.input)).toEqual(
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
      tool.execute({ ...example.input, compoundLiters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative compoundLiters", () => {
    expect(tool.execute({ ...example.input, compoundLiters: -1 }).ok).toBe(
      false,
    );
  });
});
