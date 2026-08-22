import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LandingWeightInput = {
  readonly fuelBurnLb: number;
  readonly takeoffWeightLb: number;
};

export type LandingWeightOutput = {
  readonly landingWeightLb: number;
};

export const landingWeightExample = {
  input: { fuelBurnLb: 300, takeoffWeightLb: 2400 },
  output: { landingWeightLb: 2100 },
} satisfies ToolExample<LandingWeightInput, LandingWeightOutput>;

export const calculateLandingWeight = (
  input: LandingWeightInput,
): LandingWeightOutput => {
  if (input.fuelBurnLb < 0 || input.fuelBurnLb > input.takeoffWeightLb)
    simpleError(
      "fuelBurnLb",
      "The trip fuel must be non-negative and not exceed the takeoff weight.",
      "invalid_fuel_burn",
    );
  return { landingWeightLb: input.takeoffWeightLb - input.fuelBurnLb };
};

export const landingWeightTool = createSimpleTool({
  calculate: (input) =>
    calculateLandingWeight(input as unknown as LandingWeightInput),
  description:
    "Compute the landing weight by subtracting trip fuel from the takeoff weight.",
  id: "aviation/landing-weight",
  inputs: [
    {
      description: "Takeoff weight of the aircraft.",
      id: "takeoffWeightLb",
      kind: "number",
      label: "Takeoff weight",
      unit: "lb",
    },
    {
      description: "Fuel burned during the flight.",
      id: "fuelBurnLb",
      kind: "number",
      label: "Trip fuel",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description: "Weight at touchdown.",
      format: "weight-lb",
      id: "landingWeightLb",
      kind: "number",
      label: "Landing weight",
      unit: "lb",
    },
  ],
  title: "Landing Weight Calculator",
});
export const runLandingWeight = landingWeightTool.execute;
export default landingWeightTool;
