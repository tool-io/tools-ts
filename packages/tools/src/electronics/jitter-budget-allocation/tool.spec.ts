import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateJitterBudgetAllocation, example } from "./tool.js";

describe("electronics/jitter-budget-allocation", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateJitterBudgetAllocation(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, totalBudgetSeconds: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      totalBudgetSeconds: 0,
      usedRmsSeconds: 3e-12,
    });
    expect(result).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_value", field: "usedRmsSeconds" }] },
    });
  });
});
