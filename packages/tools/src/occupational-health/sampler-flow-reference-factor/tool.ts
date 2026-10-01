import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredFlow: number;
  readonly referenceFlow: number;
};
export type Output = { readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredFlow: { type: "number", minimum: 0 },
    referenceFlow: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredFlow", "referenceFlow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "number" } },
  required: ["factor"],
} as const;
/** Compare explicit bench sampler flows without certifying exposure sampling validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredFlow, referenceFlow } = request;
  const compute = (): Output => {
    H.domain(measuredFlow >= 0);
    H.positive(referenceFlow);
    return { factor: measuredFlow / referenceFlow };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredFlow: 2, referenceFlow: 2.5 },
  output: { factor: 0.8 },
} satisfies ToolExample<Input, Output>;
export const samplerFlowReferenceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/sampler-flow-reference-factor",
    title: "Sampler Flow Reference Factor Tool",
    description:
      "Compare explicit bench sampler flows without certifying exposure sampling validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredFlow: { type: "number", minimum: 0 },
        referenceFlow: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredFlow", "referenceFlow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { factor: { type: "number" } },
      required: ["factor"],
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
          id: "referenceFlow",
          label: "Reference Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = samplerFlowReferenceFactorTool.execute;
export default samplerFlowReferenceFactorTool;
