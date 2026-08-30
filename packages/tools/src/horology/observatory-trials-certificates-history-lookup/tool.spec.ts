import { describe, expect, it } from "vitest";
import {
  lookupObservatoryTrialHistory,
  observatoryTrialHistoryExample,
  runObservatoryTrialHistory,
} from "./tool.js";

describe("observatory trials and certificates history lookup", () => {
  it("reproduces the canonical Kew timeline example", () => {
    expect(
      runObservatoryTrialHistory(observatoryTrialHistoryExample.input),
    ).toEqual({ ok: true, output: observatoryTrialHistoryExample.output });
  });

  it("covers Kew watch-trial records", () => {
    expect(
      lookupObservatoryTrialHistory({ historyFocus: "kewWatches" })
        .verifiedStatement,
    ).toContain("daily-rate");
  });

  it("covers the Neuchâtel competition", () => {
    expect(
      lookupObservatoryTrialHistory({ historyFocus: "neuchatelTrials" })
        .keyDate,
    ).toBe("1945–1967");
  });

  it("distinguishes a Bulletin de Marche from modern certification", () => {
    expect(
      lookupObservatoryTrialHistory({ historyFocus: "scopeCaution" })
        .verifiedStatement,
    ).toContain("not be treated as interchangeable");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(
      runObservatoryTrialHistory({ historyFocus: "Geneva" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "historyFocus" }] },
      ok: false,
    });
  });
});
