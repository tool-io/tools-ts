import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OverburdenGradientInput = {
  readonly averageBulkDensityKgPerCubicMetre?: number;
  readonly gravityMetresPerSecondSquared?: number;
};

export type OverburdenGradientOutput = {
  readonly overburdenStressGradientKilopascalsPerMetre: number;
  readonly overburdenStressGradientPaPerMetre: number;
};

export const calculateOverburdenGradient = (
  input: OverburdenGradientInput,
): OverburdenGradientOutput => {
  const density = input.averageBulkDensityKgPerCubicMetre ?? 2300;
  const gravity = input.gravityMetresPerSecondSquared ?? 9.80665;
  if (!(density > 0))
    return simpleError(
      "averageBulkDensityKgPerCubicMetre",
      "Bulk density must be greater than zero.",
      "invalid_density",
    );
  if (!(gravity > 0))
    return simpleError(
      "gravityMetresPerSecondSquared",
      "Gravity must be greater than zero.",
      "invalid_gravity",
    );
  const overburdenStressGradientPaPerMetre = density * gravity;
  return {
    overburdenStressGradientPaPerMetre,
    overburdenStressGradientKilopascalsPerMetre:
      overburdenStressGradientPaPerMetre / 1000,
  };
};

export const overburdenGradientExample = {
  input: {
    averageBulkDensityKgPerCubicMetre: 2300,
    gravityMetresPerSecondSquared: 9.80665,
  },
  output: {
    overburdenStressGradientPaPerMetre: 22555.295,
    overburdenStressGradientKilopascalsPerMetre: 22.555294999999997,
  },
} satisfies ToolExample<OverburdenGradientInput, OverburdenGradientOutput>;

export const overburdenGradientTool = createSimpleTool({
  id: "geology/overburden-gradient",
  title: "Overburden Gradient Calculator",
  description:
    "Compute the vertical overburden stress gradient Sv = rho_bulk * g from average bulk density.",
  inputs: [
    {
      default: 2300,
      description:
        "Average bulk density of the overlying column in kilograms per cubic metre.",
      id: "averageBulkDensityKgPerCubicMetre",
      kind: "number",
      label: "Bulk density",
    },
    {
      default: 9.80665,
      description: "Gravitational acceleration in metres per second squared.",
      id: "gravityMetresPerSecondSquared",
      kind: "number",
      label: "Gravity",
    },
  ],
  outputs: [
    {
      description: "Overburden stress gradient in pascals per metre.",
      id: "overburdenStressGradientPaPerMetre",
      kind: "number",
      label: "Overburden gradient",
    },
    {
      description: "Overburden stress gradient in kilopascals per metre.",
      id: "overburdenStressGradientKilopascalsPerMetre",
      kind: "number",
      label: "Overburden gradient",
    },
  ],
  calculate: (input) =>
    calculateOverburdenGradient(input as unknown as OverburdenGradientInput),
});

export const runOverburdenGradient = overburdenGradientTool.execute;
export default overburdenGradientTool;
