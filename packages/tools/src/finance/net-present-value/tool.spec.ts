import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateNetPresentValue,
  netPresentValueExample,
  netPresentValueTool,
} from "./tool.js";

describe("Net Present Value", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = netPresentValueTool.execute(netPresentValueExample.input);
    expect(result).toEqual({ ok: true, output: netPresentValueExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(netPresentValueTool.id).toBe("finance/net-present-value");
    expect(validateToolContract(netPresentValueTool)).toEqual([]);
  });

  it("sums undiscounted flows at a zero rate", () => {
    const result = calculateNetPresentValue({
      cashFlows: [-100, 40, 60],
      discountRatePercent: 0,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.netPresentValue).toBe(0);
  });

  it("rejects malformed probes", () => {
    expect(calculateNetPresentValue(null).ok).toBe(false);
    expect(calculateNetPresentValue({})).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(
      calculateNetPresentValue({
        cashFlows: [],
        discountRatePercent: 5,
      }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateNetPresentValue({
        cashFlows: [-100, Number.NaN],
        discountRatePercent: 5,
      }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateNetPresentValue({
        cashFlows: [-100],
        discountRatePercent: -150,
      }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateNetPresentValue({ cashFlows: [1], extra: true }),
    ).toMatchObject({ error: { code: "invalid_input" } });
  });
});
