import { describe, expect, it } from "vitest";
import {
  calculateTitulatureOrderChecker,
  titulatureOrderCheckerExample,
  runTitulatureOrderChecker,
} from "./tool.js";

describe("epigraphy/titulature-order-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTitulatureOrderChecker(titulatureOrderCheckerExample.input),
    ).toEqual({ ok: true, output: titulatureOrderCheckerExample.output });
  });

  it("flags a reversed tribunician and consular order only in standard mode", () => {
    const standard = calculateTitulatureOrderChecker({
      elements: ["COS", "TR P", "PP"],
    });
    expect(standard.violations).toEqual(["tribPotestas must precede consul."]);
    expect(standard.isOrdered).toBe(false);
    expect(
      calculateTitulatureOrderChecker({
        elements: ["cos", "tr p", "pp"],
        strictness: "minimal",
      }).isOrdered,
    ).toBe(true);
  });

  it("requires imperator first and pater patriae last", () => {
    expect(
      [
        ...calculateTitulatureOrderChecker({ elements: ["PP", "IMP"] })
          .violations,
      ].sort(),
    ).toEqual(["imperator must come first.", "paterPatriae must come last."]);
  });

  it("rejects empty or unrecognized element lists", () => {
    expect(runTitulatureOrderChecker({ elements: [] }).ok).toBe(false);
    expect(runTitulatureOrderChecker({ elements: ["XYZ"] }).ok).toBe(false);
  });
});
