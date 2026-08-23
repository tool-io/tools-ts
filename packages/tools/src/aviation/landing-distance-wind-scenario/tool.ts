import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LandingDistanceWindScenarioInput = {
  readonly baseDistanceM: number;
  readonly distanceChangePercentPerKnot: number;
  readonly windComponentKt: number;
};

export type LandingDistanceWindScenarioOutput = {
  readonly scenarioDistanceM: number;
};

export const landingDistanceWindScenarioExample = {
  input: {
    baseDistanceM: 1000,
    distanceChangePercentPerKnot: 1,
    windComponentKt: 10,
  },
  output: { scenarioDistanceM: 900 },
} satisfies ToolExample<
  LandingDistanceWindScenarioInput,
  LandingDistanceWindScenarioOutput
>;

export const landingDistanceWindScenarioTool = createSimpleTool({
  id: "aviation/landing-distance-wind-scenario",
  title: "Landing Distance Wind Scenario Calculator",
  description:
    "Apply a user-supplied per-knot wind adjustment to a base distance for scenario comparison, not approved aircraft performance.",
  inputs: [
    {
      description:
        "Scenario adjustment magnitude per knot; obtain an applicable value from approved data.",
      id: "distanceChangePercentPerKnot",
      label: "Distance change per knot",
      kind: "number",
      maximum: 10,
      minimum: 0,
      unit: "%/kt",
    },
    {
      id: "baseDistanceM",
      label: "Base distance",
      kind: "number",
      unit: "m",
    },
    {
      description:
        "Signed wind component; positive is headwind and negative is tailwind.",
      id: "windComponentKt",
      label: "Wind component",
      kind: "number",
      maximum: 30,
      minimum: -20,
      unit: "kt",
    },
  ],
  outputs: [
    {
      id: "scenarioDistanceM",
      label: "Scenario distance",
      kind: "number",
      unit: "m",
    },
  ],
  calculate: (input) => {
    const baseDistanceM = input.baseDistanceM as number;
    if (baseDistanceM <= 0)
      simpleError(
        "baseDistanceM",
        "The base distance must be greater than zero.",
      );
    const factor =
      1 -
      ((input.distanceChangePercentPerKnot as number) / 100) *
        (input.windComponentKt as number);
    if (factor <= 0)
      simpleError(
        "distanceChangePercentPerKnot",
        "The selected scenario adjustment must leave a positive distance.",
      );
    return { scenarioDistanceM: baseDistanceM * factor };
  },
});
export const runLandingDistanceWindScenario =
  landingDistanceWindScenarioTool.execute;
export default landingDistanceWindScenarioTool;
