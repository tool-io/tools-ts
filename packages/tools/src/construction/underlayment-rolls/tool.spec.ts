import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateUnderlaymentRolls, example } from "./tool.js";

describe("construction/underlayment-rolls", () => {
  it("matches the canonical example and direct calculation", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateUnderlaymentRolls(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and malformed inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, floorAreaM2: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects an invalid domain boundary", () => {
    expect(
      tool.execute({ ...example.input, effectiveCoveragePerRollM2: 0 }).ok,
    ).toBe(false);
  });
  it("handles a zero boundary", () => {
    expect(tool.execute({ ...example.input, floorAreaM2: 0 })).toEqual({
      ok: true,
      output: { rollCount: 0 },
    });
  });
});
