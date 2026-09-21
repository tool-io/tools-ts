import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly predators: number;
  readonly prey: number;
  readonly predatorEffort: number;
  readonly preyEffort: number;
};
export type Output = {
  readonly rawRatio: number;
  readonly effortAdjustedRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predators: { type: "integer", minimum: 0 },
    prey: { type: "integer", minimum: 1 },
    predatorEffort: { type: "number", exclusiveMinimum: 0 },
    preyEffort: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["predators", "prey", "predatorEffort", "preyEffort"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawRatio: { type: "number" },
    effortAdjustedRatio: { type: "number" },
  },
  required: ["rawRatio", "effortAdjustedRatio"],
} as const;
/** Calculate predator prey sample count ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { predators, prey, predatorEffort, preyEffort } = request;
  const compute = (): Output => {
    H.integer(predators, 0);
    H.integer(prey, 1);
    H.positive(predatorEffort);
    H.positive(preyEffort);
    return {
      rawRatio: predators / prey,
      effortAdjustedRatio: (predators * preyEffort) / (prey * predatorEffort),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { predators: 20, prey: 100, predatorEffort: 2, preyEffort: 4 },
  output: { rawRatio: 0.2, effortAdjustedRatio: 0.4 },
} satisfies ToolExample<Input, Output>;
export const predatorPreySampleCountRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/predator-prey-sample-count-ratio",
    title: "Predator Prey Sample Count Ratio Tool",
    description:
      "Calculate predator prey sample count ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predators: { type: "integer", minimum: 0 },
        prey: { type: "integer", minimum: 1 },
        predatorEffort: { type: "number", exclusiveMinimum: 0 },
        preyEffort: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["predators", "prey", "predatorEffort", "preyEffort"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawRatio: { type: "number" },
        effortAdjustedRatio: { type: "number" },
      },
      required: ["rawRatio", "effortAdjustedRatio"],
    },
    ports: {
      inputs: [
        {
          id: "predators",
          label: "Predators",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "prey",
          label: "Prey",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "predatorEffort",
          label: "Predator Effort",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "preyEffort",
          label: "Prey Effort",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rawRatio", label: "Raw Ratio", valueType: { type: "number" } },
        {
          id: "effortAdjustedRatio",
          label: "Effort Adjusted Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = predatorPreySampleCountRatioTool.execute;
export default predatorPreySampleCountRatioTool;
