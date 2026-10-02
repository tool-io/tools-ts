import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contentPerSourceVolume: number;
  readonly suppliedSourceVolumesPerTarget: number;
  readonly dissolvedTerm: number;
  readonly includeDissolved: boolean;
};
export type Output = { readonly targetContent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contentPerSourceVolume: { type: "number" },
    suppliedSourceVolumesPerTarget: { type: "number", exclusiveMinimum: 0 },
    dissolvedTerm: { type: "number" },
    includeDissolved: { type: "boolean" },
  },
  required: [
    "contentPerSourceVolume",
    "suppliedSourceVolumesPerTarget",
    "dissolvedTerm",
    "includeDissolved",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetContent: { type: "number" } },
  required: ["targetContent"],
} as const;
/** Rescale supplied oxygen-content components between explicit volume bases without estimating physiological constants. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    contentPerSourceVolume,
    suppliedSourceVolumesPerTarget,
    dissolvedTerm,
    includeDissolved,
  } = request;
  const compute = (): Output => {
    H.positive(suppliedSourceVolumesPerTarget);
    return {
      targetContent:
        (contentPerSourceVolume + (includeDissolved ? dissolvedTerm : 0)) *
        suppliedSourceVolumesPerTarget,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    contentPerSourceVolume: 10,
    suppliedSourceVolumesPerTarget: 10,
    dissolvedTerm: 0.2,
    includeDissolved: true,
  },
  output: { targetContent: 102 },
} satisfies ToolExample<Input, Output>;
export const oxygenContentBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/oxygen-content-basis-factor",
    title: "Oxygen Content Basis Factor Tool",
    description:
      "Rescale supplied oxygen-content components between explicit volume bases without estimating physiological constants.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contentPerSourceVolume: { type: "number" },
        suppliedSourceVolumesPerTarget: { type: "number", exclusiveMinimum: 0 },
        dissolvedTerm: { type: "number" },
        includeDissolved: { type: "boolean" },
      },
      required: [
        "contentPerSourceVolume",
        "suppliedSourceVolumesPerTarget",
        "dissolvedTerm",
        "includeDissolved",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { targetContent: { type: "number" } },
      required: ["targetContent"],
    },
    ports: {
      inputs: [
        {
          id: "contentPerSourceVolume",
          label: "Content Per Source Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSourceVolumesPerTarget",
          label: "Supplied Source Volumes Per Target",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dissolvedTerm",
          label: "Dissolved Term",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeDissolved",
          label: "Include Dissolved",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "targetContent",
          label: "Target Content",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = oxygenContentBasisFactorTool.execute;
export default oxygenContentBasisFactorTool;
