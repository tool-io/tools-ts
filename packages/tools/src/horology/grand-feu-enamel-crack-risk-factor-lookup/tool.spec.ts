import { describe, expect, it } from "vitest";
import {
  grandFeuRiskExample,
  lookupGrandFeuCrackRisk,
  runGrandFeuRisk,
} from "./tool.js";

describe("Grand Feu enamel crack-risk factor lookup", () => {
  it("reproduces the canonical repeated-firing risk", () => {
    expect(runGrandFeuRisk(grandFeuRiskExample.input)).toEqual({
      ok: true,
      output: grandFeuRiskExample.output,
    });
  });

  it("identifies differential thermal stress", () => {
    expect(
      lookupGrandFeuCrackRisk({ riskFocus: "thermalStress" }).riskStatement,
    ).toContain("Differential expansion");
  });

  it("requires inspection after each cycle", () => {
    expect(
      lookupGrandFeuCrackRisk({ riskFocus: "inspection" }).riskStatement,
    ).toContain("after each thermal cycle");
  });

  it("keeps color process-specific", () => {
    expect(
      lookupGrandFeuCrackRisk({ riskFocus: "colorDependence" }).riskStatement,
    ).toContain("respond differently to heat");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runGrandFeuRisk({ riskFocus: "price" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "riskFocus" }] },
      ok: false,
    });
  });
});
