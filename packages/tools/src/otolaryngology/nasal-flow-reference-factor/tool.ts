import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredFlow: number;
  readonly suppliedReferenceFlow: number;
  readonly scale: number;
};
export type Output = {
  readonly ratio: number;
  readonly scaledDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredFlow: { type: "number" },
    suppliedReferenceFlow: { type: "number" },
    scale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredFlow", "suppliedReferenceFlow", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratio: { type: "number" },
    scaledDifference: { type: "number" },
  },
  required: ["ratio", "scaledDifference"],
} as const;
/** Compare supplied signed research flow with an explicit reference without clinical nasal airflow assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredFlow, suppliedReferenceFlow, scale } = request;
  const compute = (): Output => {
    H.domain(suppliedReferenceFlow !== 0);
    H.positive(scale);
    return {
      ratio: measuredFlow / suppliedReferenceFlow,
      scaledDifference: (measuredFlow - suppliedReferenceFlow) * scale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredFlow: 10, suppliedReferenceFlow: 5, scale: 2 },
  output: { ratio: 2, scaledDifference: 10 },
} satisfies ToolExample<Input, Output>;
export const nasalFlowReferenceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "otolaryngology/nasal-flow-reference-factor",
    title: "Nasal Flow Reference Factor Tool",
    description:
      "Compare supplied signed research flow with an explicit reference without clinical nasal airflow assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredFlow: { type: "number" },
        suppliedReferenceFlow: { type: "number" },
        scale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredFlow", "suppliedReferenceFlow", "scale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratio: { type: "number" },
        scaledDifference: { type: "number" },
      },
      required: ["ratio", "scaledDifference"],
    },
    ports: {
      inputs: [
        {
          id: "measuredFlow",
          label: "Measured Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceFlow",
          label: "Supplied Reference Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "scaledDifference",
          label: "Scaled Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nasalFlowReferenceFactorTool.execute;
export default nasalFlowReferenceFactorTool;
