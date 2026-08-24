import { describe, expect, it } from "vitest";
import {
  calculateLcshStringFormattednessChecker,
  lcshStringFormattednessCheckerExample,
  runLcshStringFormattednessChecker,
} from "./tool.js";

describe("archival-studies/lcsh-string-formattedness-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLcshStringFormattednessChecker(
        lcshStringFormattednessCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: lcshStringFormattednessCheckerExample.output,
    });
  });

  it("flags spaced separators and lowercase segments", () => {
    const result = calculateLcshStringFormattednessChecker({
      heading: "World politics -- 1989 --congresses",
    });
    expect(result.wellFormed).toBe(false);
    expect(result.issues).toContain("space adjacent to double hyphen");
    expect(result.subdivisionCount).toBe(2);
  });

  it("rejects empty headings", () => {
    expect(runLcshStringFormattednessChecker({ heading: "  " }).ok).toBe(false);
  });
});
