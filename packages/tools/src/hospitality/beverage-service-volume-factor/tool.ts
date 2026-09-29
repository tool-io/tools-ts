import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly servings: number;
  readonly volumePerServing: number;
  readonly lossFraction: number;
};
export type Output = {
  readonly preparedVolume: number;
  readonly deliveredVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    servings: { type: "integer", minimum: 0 },
    volumePerServing: { type: "number", minimum: 0 },
    lossFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["servings", "volumePerServing", "lossFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preparedVolume: { type: "number" },
    deliveredVolume: { type: "number" },
  },
  required: ["preparedVolume", "deliveredVolume"],
} as const;
/** Calculate beverage service volume factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { servings, volumePerServing, lossFraction } = request;
  const compute = (): Output => {
    H.integer(servings, 0);
    H.domain(volumePerServing >= 0 && lossFraction >= 0 && lossFraction < 1);
    return {
      preparedVolume: (servings * volumePerServing) / (1 - lossFraction),
      deliveredVolume: servings * volumePerServing,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { servings: 8, volumePerServing: 0.25, lossFraction: 0.2 },
  output: { preparedVolume: 2.5, deliveredVolume: 2 },
} satisfies ToolExample<Input, Output>;
export const beverageServiceVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/beverage-service-volume-factor",
    title: "Beverage Service Volume Factor Tool",
    description:
      "Calculate beverage service volume factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        servings: { type: "integer", minimum: 0 },
        volumePerServing: { type: "number", minimum: 0 },
        lossFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["servings", "volumePerServing", "lossFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preparedVolume: { type: "number" },
        deliveredVolume: { type: "number" },
      },
      required: ["preparedVolume", "deliveredVolume"],
    },
    ports: {
      inputs: [
        {
          id: "servings",
          label: "Servings",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "volumePerServing",
          label: "Volume Per Serving",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lossFraction",
          label: "Loss Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "preparedVolume",
          label: "Prepared Volume",
          valueType: { type: "number" },
        },
        {
          id: "deliveredVolume",
          label: "Delivered Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = beverageServiceVolumeFactorTool.execute;
export default beverageServiceVolumeFactorTool;
