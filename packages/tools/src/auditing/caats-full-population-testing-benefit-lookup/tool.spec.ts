import { describe, expect, it } from "vitest";
import {
  caatsFullPopulationExample,
  checkCaatsFullPopulationReadiness,
  runCaatsFullPopulation,
} from "./tool.js";

describe("CAATS full population testing readiness", () => {
  it("reproduces its canonical example", () => {
    expect(runCaatsFullPopulation(caatsFullPopulationExample.input)).toEqual({
      ok: true,
      output: caatsFullPopulationExample.output,
    });
  });

  it("accepts all full-population controls", () => {
    expect(
      checkCaatsFullPopulationReadiness({
        auditorReviewed: true,
        exceptionsResolved: true,
        populationComplete: true,
        queryParametersComplete: true,
        resultsReconciled: true,
      }).populationTestingReady,
    ).toBe(true);
  });

  it("lists every missing control", () => {
    expect(
      checkCaatsFullPopulationReadiness({
        auditorReviewed: false,
        exceptionsResolved: false,
        populationComplete: false,
        queryParametersComplete: true,
        resultsReconciled: true,
      }).missingControls,
    ).toEqual(["complete population", "resolved exceptions", "auditor review"]);
  });

  it("rejects a malformed control flag", () => {
    expect(
      runCaatsFullPopulation({
        auditorReviewed: 1,
        exceptionsResolved: true,
        populationComplete: true,
        queryParametersComplete: true,
        resultsReconciled: true,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "auditorReviewed" }] },
      ok: false,
    });
  });
});
