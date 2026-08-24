import { describe, expect, it } from "vitest";
import {
  calculateFormatObsolescenceScoreRater,
  formatObsolescenceScoreRaterExample,
  runFormatObsolescenceScoreRater,
} from "./tool.js";

describe("archival-studies/format-obsolescence-score-rater", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFormatObsolescenceScoreRater(
        formatObsolescenceScoreRaterExample.input,
      ),
    ).toEqual({ ok: true, output: formatObsolescenceScoreRaterExample.output });
  });

  it("rates a moderately aged proprietary format as moderate", () => {
    const result = calculateFormatObsolescenceScoreRater({
      yearsSinceRelease: 12,
      proprietary: true,
    });
    expect(result.riskScore).toBe(44);
    expect(result.riskTier).toBe("moderate");
  });

  it("rejects negative format ages", () => {
    expect(runFormatObsolescenceScoreRater({ yearsSinceRelease: -1 }).ok).toBe(
      false,
    );
  });
});
