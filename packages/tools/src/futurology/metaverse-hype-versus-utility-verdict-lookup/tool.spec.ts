import { describe, expect, it } from "vitest";
import {
  assessMetaverseHypeVersusUtility,
  metaverseVerdictExample,
  runMetaverseVerdict,
} from "./tool.js";

describe("metaverse hype versus utility verdict lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runMetaverseVerdict(metaverseVerdictExample.input)).toEqual({
      ok: true,
      output: metaverseVerdictExample.output,
    });
  });

  it("classifies a hype-led position", () => {
    expect(
      assessMetaverseHypeVersusUtility({
        crossPlatformInteroperabilityPercent: 20,
        taskCompletionImprovementPercent: 30,
        thirtyDayRetentionPercent: 20,
        utilityThresholdPercent: 50,
      }).verdict,
    ).toBe("hypeLed");
  });

  it("classifies a mixed position", () => {
    expect(
      assessMetaverseHypeVersusUtility({
        crossPlatformInteroperabilityPercent: 50,
        taskCompletionImprovementPercent: 50,
        thirtyDayRetentionPercent: 50,
        utilityThresholdPercent: 50,
      }).verdict,
    ).toBe("mixed");
  });

  it("rejects a value above 100", () => {
    expect(
      runMetaverseVerdict({
        crossPlatformInteroperabilityPercent: 101,
        taskCompletionImprovementPercent: 50,
        thirtyDayRetentionPercent: 50,
        utilityThresholdPercent: 50,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "crossPlatformInteroperabilityPercent",
          },
        ],
      },
      ok: false,
    });
  });
});
