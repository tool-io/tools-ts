import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateSalesTax,
  salesTaxExample,
  salesTaxTool,
} from "./tool.js";

describe("Sales Tax", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = salesTaxTool.execute(salesTaxExample.input);
    expect(result).toEqual({ ok: true, output: salesTaxExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(salesTaxTool.id).toBe("finance/sales-tax");
    expect(validateToolContract(salesTaxTool)).toEqual([]);
  });

  it("adds and extracts symmetrically", () => {
    const added = calculateSalesTax({
      direction: "add",
      ratePercent: 20,
      value: 50,
    });
    expect(added.ok).toBe(true);
    if (added.ok) {
      expect(added.output.net).toBe(50);
      expect(added.output.tax).toBe(10);
      expect(added.output.gross).toBe(60);
    }
    const extracted = calculateSalesTax({
      direction: "extract",
      ratePercent: 20,
      value: 60,
    });
    expect(extracted.ok).toBe(true);
    if (extracted.ok) {
      expect(extracted.output.net).toBe(50);
      expect(extracted.output.tax).toBeCloseTo(10, 10);
      expect(extracted.output.gross).toBe(60);
    }
  });

  it("treats a zero rate as identity", () => {
    const result = calculateSalesTax({
      direction: "extract",
      ratePercent: 0,
      value: 42,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.net).toBe(42);
      expect(result.output.tax).toBe(0);
    }
  });

  it("rejects malformed probes", () => {
    expect(calculateSalesTax(null).ok).toBe(false);
    expect(calculateSalesTax({})).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(
      calculateSalesTax({ direction: "both", ratePercent: 5, value: 10 }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateSalesTax({ direction: "add", ratePercent: -3, value: 10 }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateSalesTax({ direction: "add", ratePercent: 5, extra: 1, value: 10 }),
    ).toMatchObject({ error: { code: "invalid_input" } });
  });
});
