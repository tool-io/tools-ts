import { describe, expect, it } from "vitest";
import {
  landingDistanceWindScenarioExample,
  runLandingDistanceWindScenario,
} from "./tool.js";

describe("landing distance wind scenario calculator", () => {
  it("reproduces its canonical example", () => {
    expect(
      runLandingDistanceWindScenario(landingDistanceWindScenarioExample.input),
    ).toEqual({ ok: true, output: landingDistanceWindScenarioExample.output });
  });
  it("lengthens the scenario for a tailwind", () => {
    expect(
      runLandingDistanceWindScenario({
        baseDistanceM: 1000,
        distanceChangePercentPerKnot: 1,
        windComponentKt: -10,
      }),
    ).toEqual({ ok: true, output: { scenarioDistanceM: 1100 } });
  });
  it("rejects a non-positive resulting distance", () => {
    expect(
      runLandingDistanceWindScenario({
        baseDistanceM: 1000,
        distanceChangePercentPerKnot: 10,
        windComponentKt: 10,
      }).ok,
    ).toBe(false);
  });
});
