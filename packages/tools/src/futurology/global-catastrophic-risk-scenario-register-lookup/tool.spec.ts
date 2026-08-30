import { describe, expect, it } from "vitest";
import {
  buildCatastrophicRiskRegisterEntry,
  catastrophicRiskRegisterExample,
  runCatastrophicRiskRegister,
} from "./tool.js";

describe("global catastrophic risk scenario register lookup", () => {
  it("reproduces its canonical example", () => {
    expect(
      runCatastrophicRiskRegister(catastrophicRiskRegisterExample.input),
    ).toEqual({
      ok: true,
      output: catastrophicRiskRegisterExample.output,
    });
  });

  it("normalizes a scenario name into an ID", () => {
    expect(
      buildCatastrophicRiskRegisterEntry({
        riskCategory: "systemic",
        scenarioName: " Grid / Failure! ",
        timeHorizon: "later",
      }).scenarioId,
    ).toBe("grid-failure");
  });

  it("keeps the caller category and horizon", () => {
    expect(
      buildCatastrophicRiskRegisterEntry({
        riskCategory: "other",
        scenarioName: "Event",
        timeHorizon: "near",
      }).registerEntry,
    ).toBe("event | category=other | horizon=near");
  });

  it("rejects a scenario name with no letters or numbers", () => {
    expect(
      runCatastrophicRiskRegister({
        riskCategory: "other",
        scenarioName: "---",
        timeHorizon: "near",
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_scenario_name", field: "scenarioName" }],
      },
      ok: false,
    });
  });
});
