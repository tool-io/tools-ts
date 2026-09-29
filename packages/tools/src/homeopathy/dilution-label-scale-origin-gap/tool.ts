import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labelStep: number;
  readonly sourceOrigin: number;
  readonly targetOrigin: number;
  readonly suppliedStepsPerSourceStep: number;
};
export type Output = { readonly targetStep: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labelStep: { type: "integer" },
    sourceOrigin: { type: "integer" },
    targetOrigin: { type: "integer" },
    suppliedStepsPerSourceStep: { type: "integer", minimum: 1 },
  },
  required: [
    "labelStep",
    "sourceOrigin",
    "targetOrigin",
    "suppliedStepsPerSourceStep",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetStep: { type: "integer" } },
  required: ["targetStep"],
} as const;
/** Relabel caller-defined integer notation indices; not a concentration, dose or potency-effect conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labelStep, sourceOrigin, targetOrigin, suppliedStepsPerSourceStep } =
    request;
  const compute = (): Output => {
    H.integer(suppliedStepsPerSourceStep, 1);
    return {
      targetStep: Number(
        (BigInt(labelStep) - BigInt(sourceOrigin)) *
          BigInt(suppliedStepsPerSourceStep) +
          BigInt(targetOrigin),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    labelStep: 12,
    sourceOrigin: 1,
    targetOrigin: 0,
    suppliedStepsPerSourceStep: 2,
  },
  output: { targetStep: 22 },
} satisfies ToolExample<Input, Output>;
export const dilutionLabelScaleOriginGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "homeopathy/dilution-label-scale-origin-gap",
    title: "Dilution Label Scale Origin Gap Tool",
    description:
      "Relabel caller-defined integer notation indices; not a concentration, dose or potency-effect conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labelStep: { type: "integer" },
        sourceOrigin: { type: "integer" },
        targetOrigin: { type: "integer" },
        suppliedStepsPerSourceStep: { type: "integer", minimum: 1 },
      },
      required: [
        "labelStep",
        "sourceOrigin",
        "targetOrigin",
        "suppliedStepsPerSourceStep",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { targetStep: { type: "integer" } },
      required: ["targetStep"],
    },
    ports: {
      inputs: [
        {
          id: "labelStep",
          label: "Label Step",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sourceOrigin",
          label: "Source Origin",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetOrigin",
          label: "Target Origin",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedStepsPerSourceStep",
          label: "Supplied Steps Per Source Step",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "targetStep",
          label: "Target Step",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = dilutionLabelScaleOriginGapTool.execute;
export default dilutionLabelScaleOriginGapTool;
