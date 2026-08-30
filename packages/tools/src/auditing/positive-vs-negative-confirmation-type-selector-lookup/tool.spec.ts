import { describe, expect, it } from "vitest";
import {
  confirmationTypeSelectorExample,
  runConfirmationTypeSelector,
  selectConfirmationType,
} from "./tool.js";

describe("positive versus negative confirmation selector", () => {
  it("reproduces its canonical example", () => {
    expect(
      runConfirmationTypeSelector(confirmationTypeSelectorExample.input),
    ).toEqual({
      ok: true,
      output: confirmationTypeSelectorExample.output,
    });
  });

  it("selects positive confirmation for a disputed balance", () => {
    expect(
      selectConfirmationType({
        controlEffective: true,
        disputedBalance: true,
        highRisk: false,
        smallBalance: false,
      }),
    ).toEqual({ method: "positive", rationale: "high_risk_or_dispute" });
  });

  it("prioritizes ineffective control over small balance", () => {
    expect(
      selectConfirmationType({
        controlEffective: false,
        disputedBalance: false,
        highRisk: false,
        smallBalance: true,
      }).rationale,
    ).toBe("ineffective_control");
  });

  it("rejects a non-boolean risk fact", () => {
    expect(
      runConfirmationTypeSelector({
        controlEffective: true,
        disputedBalance: false,
        highRisk: 1,
        smallBalance: false,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "highRisk" }] },
      ok: false,
    });
  });
});
