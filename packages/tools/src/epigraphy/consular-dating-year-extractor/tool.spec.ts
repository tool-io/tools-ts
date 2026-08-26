import { describe, expect, it } from "vitest";
import {
  calculateConsularDatingYearExtractor,
  consularDatingYearExtractorExample,
  runConsularDatingYearExtractor,
} from "./tool.js";

describe("epigraphy/consular-dating-year-extractor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runConsularDatingYearExtractor(consularDatingYearExtractorExample.input),
    ).toEqual({ ok: true, output: consularDatingYearExtractorExample.output });
  });

  it("handles an undotted single-consul formula", () => {
    const result = calculateConsularDatingYearExtractor({
      text: "T·FLAVIO·SABINO COS",
    });
    expect(result.hasConsularMark).toBe(true);
    expect(result.markForm).toBe("COS");
    expect(result.consulCount).toBe(1);
    expect(result.consuls).toEqual(["T·FLAVIO·SABINO"]);
  });

  it("reports absence of the mark without error", () => {
    const result = calculateConsularDatingYearExtractor({
      text: "DIS MANIBVS SACRVM",
    });
    expect(result.hasConsularMark).toBe(false);
    expect(result.consuls).toEqual([]);
  });

  it("rejects empty input", () => {
    expect(runConsularDatingYearExtractor({ text: "   " }).ok).toBe(false);
  });
});
