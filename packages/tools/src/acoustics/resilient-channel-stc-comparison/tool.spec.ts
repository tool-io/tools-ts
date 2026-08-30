import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateResilientChannelStcImprovementBenefitLookup,
  example,
} from "./tool.js";

describe("acoustics/resilient-channel-stc-comparison", () => {
  it("executes its canonical example exactly", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });

  it("preserves a negative caller-supplied STC change", () => {
    const benefit = example.input.benefits[0];
    expect(
      calculateResilientChannelStcImprovementBenefitLookup({
        benefits: [
          { ...benefit, baselineStc: 50, withResilientChannelStc: 48 },
        ],
        queryBenefitId: benefit.benefitId,
      }),
    ).toMatchObject({
      benefitClassification: "does-not-improve",
      stcImprovementPoints: -2,
    });
  });

  it("rejects an identifier absent from the supplied records", () => {
    expect(
      tool.execute({ ...example.input, queryBenefitId: "missing" }),
    ).toMatchObject({
      error: {
        issues: [{ code: "benefit_not_found", field: "queryBenefitId" }],
      },
      ok: false,
    });
  });
});
