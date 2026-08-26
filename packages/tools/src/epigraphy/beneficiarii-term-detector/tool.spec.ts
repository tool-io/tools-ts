import { describe, expect, it } from "vitest";
import {
  beneficiariiTermDetectorExample,
  calculateBeneficiariiTermDetector,
  runBeneficiariiTermDetector,
} from "./tool.js";

describe("epigraphy/beneficiarii-term-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBeneficiariiTermDetector(beneficiariiTermDetectorExample.input),
    ).toEqual({ ok: true, output: beneficiariiTermDetectorExample.output });
  });

  it("counts multiple declined forms", () => {
    const result = calculateBeneficiariiTermDetector({
      text: "beneficiarii tribuni et beneficiario eius",
    });
    expect(result.found).toBe(true);
    expect(result.occurrenceCount).toBe(2);
    expect(result.firstForm).toBe("beneficiarii");
  });

  it("reports absence in ordinary career inscriptions", () => {
    expect(
      calculateBeneficiariiTermDetector({ text: "eques alae veteranus" }),
    ).toEqual({ found: false, occurrenceCount: 0, firstForm: "" });
    expect(
      calculateBeneficiariiTermDetector({ text: "nonbeneficiarius" }).found,
    ).toBe(false);
  });

  it("rejects blank text", () => {
    expect(runBeneficiariiTermDetector({ text: "" }).ok).toBe(false);
  });
});
