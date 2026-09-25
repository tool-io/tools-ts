import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly occupiedFraction: number;
  readonly colonizationRate: number;
  readonly extinctionRate: number;
  readonly step: number;
};
export type Output = {
  readonly colonizationFlux: number;
  readonly extinctionFlux: number;
  readonly nextFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupiedFraction: { type: "number", minimum: 0, maximum: 1 },
    colonizationRate: { type: "number", minimum: 0 },
    extinctionRate: { type: "number", minimum: 0 },
    step: { type: "number", minimum: 0 },
  },
  required: ["occupiedFraction", "colonizationRate", "extinctionRate", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    colonizationFlux: { type: "number" },
    extinctionFlux: { type: "number" },
    nextFraction: { type: "number" },
  },
  required: ["colonizationFlux", "extinctionFlux", "nextFraction"],
} as const;
/** Explicit Euler step of the Levins colonization-extinction model; out-of-range next fractions expose an excessive supplied time step. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occupiedFraction, colonizationRate, extinctionRate, step } = request;
  const compute = (): Output => {
    H.probability(occupiedFraction);
    H.domain(colonizationRate >= 0 && extinctionRate >= 0 && step >= 0);
    return {
      colonizationFlux:
        colonizationRate * occupiedFraction * (1 - occupiedFraction),
      extinctionFlux: extinctionRate * occupiedFraction,
      nextFraction:
        occupiedFraction +
        step *
          (colonizationRate * occupiedFraction * (1 - occupiedFraction) -
            extinctionRate * occupiedFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    occupiedFraction: 0.5,
    colonizationRate: 0.4,
    extinctionRate: 0.1,
    step: 1,
  },
  output: { colonizationFlux: 0.1, extinctionFlux: 0.05, nextFraction: 0.55 },
} satisfies ToolExample<Input, Output>;
export const patchColonizationExtinctionOneStepTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ecology/patch-colonization-extinction-one-step-term",
      title: "Patch Colonization Extinction One Step Term Tool",
      description:
        "Explicit Euler step of the Levins colonization-extinction model; out-of-range next fractions expose an excessive supplied time step.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          occupiedFraction: { type: "number", minimum: 0, maximum: 1 },
          colonizationRate: { type: "number", minimum: 0 },
          extinctionRate: { type: "number", minimum: 0 },
          step: { type: "number", minimum: 0 },
        },
        required: [
          "occupiedFraction",
          "colonizationRate",
          "extinctionRate",
          "step",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          colonizationFlux: { type: "number" },
          extinctionFlux: { type: "number" },
          nextFraction: { type: "number" },
        },
        required: ["colonizationFlux", "extinctionFlux", "nextFraction"],
      },
      ports: {
        inputs: [
          {
            id: "occupiedFraction",
            label: "Occupied Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "colonizationRate",
            label: "Colonization Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "extinctionRate",
            label: "Extinction Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "step",
            label: "Step",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "colonizationFlux",
            label: "Colonization Flux",
            valueType: { type: "number" },
          },
          {
            id: "extinctionFlux",
            label: "Extinction Flux",
            valueType: { type: "number" },
          },
          {
            id: "nextFraction",
            label: "Next Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = patchColonizationExtinctionOneStepTermTool.execute;
export default patchColonizationExtinctionOneStepTermTool;
