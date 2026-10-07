import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly response: number;
  readonly anchor: number;
  readonly comparisonReference: number;
};
export type Output = {
  readonly responseMinusAnchor: number;
  readonly responseMinusReference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    response: { type: "number" },
    anchor: { type: "number" },
    comparisonReference: { type: "number" },
  },
  required: ["response", "anchor", "comparisonReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseMinusAnchor: { type: "number" },
    responseMinusReference: { type: "number" },
  },
  required: ["responseMinusAnchor", "responseMinusReference"],
} as const;
/** Describe two signed deviations in a recorded anchoring task without estimating a causal anchoring effect. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { response, anchor, comparisonReference } = request;
  const compute = (): Output => {
    return {
      responseMinusAnchor: response - anchor,
      responseMinusReference: response - comparisonReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { response: 70, anchor: 50, comparisonReference: 60 },
  output: { responseMinusAnchor: 20, responseMinusReference: 10 },
} satisfies ToolExample<Input, Output>;
export const anchoringReferenceDeviationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["behavioral-economics", "behavioral economics", "economics"],
      keywords: ["behavioral economics", "economics"],
    },
    id: "behavioral-economics/anchoring-reference-deviation",
    title: "Anchoring Reference Deviation",
    description:
      "Describe two signed deviations in a recorded anchoring task without estimating a causal anchoring effect.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        response: { type: "number" },
        anchor: { type: "number" },
        comparisonReference: { type: "number" },
      },
      required: ["response", "anchor", "comparisonReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseMinusAnchor: { type: "number" },
        responseMinusReference: { type: "number" },
      },
      required: ["responseMinusAnchor", "responseMinusReference"],
    },
    ports: {
      inputs: [
        {
          id: "response",
          label: "Response",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "anchor",
          label: "Anchor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "comparisonReference",
          label: "Comparison Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "responseMinusAnchor",
          label: "Response Minus Anchor",
          valueType: { type: "number" },
        },
        {
          id: "responseMinusReference",
          label: "Response Minus Reference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = anchoringReferenceDeviationTool.execute;
export default anchoringReferenceDeviationTool;
