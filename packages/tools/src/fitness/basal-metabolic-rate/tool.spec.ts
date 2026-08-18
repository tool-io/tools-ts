import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateBasalMetabolicRate,
  basalMetabolicRateExample,
  basalMetabolicRateTool,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateBasalMetabolicRate>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Basal Metabolic Rate", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = basalMetabolicRateTool.execute(basalMetabolicRateExample.input);
    expect(result).toEqual({ ok: true, output: basalMetabolicRateExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(basalMetabolicRateTool.id).toBe("fitness/basal-metabolic-rate");
    expect(validateToolContract(basalMetabolicRateTool)).toEqual([]);
  });

  it("applies the sex offset per the Mifflin-St Jeor equation", () => {
    const female = calculateBasalMetabolicRate({
      ageYears: 30,
      heightCm: 180,
      sex: "female",
      weightKg: 70,
    });
    expect(female.ok).toBe(true);
    if (female.ok) expect(female.output.caloriesPerDay).toBe(1514);
  });

  it("handles fractional weights with exact arithmetic", () => {
    const result = calculateBasalMetabolicRate({
      ageYears: 25,
      heightCm: 170,
      sex: "male",
      weightKg: 65.5,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.caloriesPerDay).toBe(1597.5);
  });

  it("rejects malformed probes", () => {
    expect(calculateBasalMetabolicRate(null).ok).toBe(false);
    expect(
      issueCodes(calculateBasalMetabolicRate({})),
    ).toEqual([
      "age_years_required",
      "weight_kg_required",
      "height_cm_required",
    ]);
    expect(
      issueCodes(calculateBasalMetabolicRate({ ageYears: 1 })),
    ).toEqual([
      "weight_kg_required",
      "height_cm_required",
      "age_years_out_of_range",
    ]);
    expect(
      issueCodes(
        calculateBasalMetabolicRate({
          ageYears: 30.5,
          heightCm: 180,
          sex: "male",
          weightKg: 70,
        }),
      ),
    ).toEqual(["age_years_invalid"]);
    expect(
      issueCodes(
        calculateBasalMetabolicRate({
          ageYears: 30,
          heightCm: -1,
          sex: "other",
          weightKg: 70,
        }),
      ),
    ).toEqual(["sex_invalid", "height_cm_invalid"]);
  });
});
