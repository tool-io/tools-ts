import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly suppliedMinimum: number;
  readonly suppressEquality: boolean;
};
export type Output = { readonly suppressed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    suppliedMinimum: { type: "integer", minimum: 0 },
    suppressEquality: { type: "boolean" },
  },
  required: ["count", "suppliedMinimum", "suppressEquality"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { suppressed: { type: "boolean" } },
  required: ["suppressed"],
} as const;
/** Apply an explicit reporting threshold; this flag alone does not establish disclosure protection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, suppliedMinimum, suppressEquality } = request;
  const compute = (): Output => {
    H.integer(count, 0);
    H.integer(suppliedMinimum, 0);
    return {
      suppressed: suppressEquality
        ? count <= suppliedMinimum
        : count < suppliedMinimum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 5, suppliedMinimum: 5, suppressEquality: true },
  output: { suppressed: true },
} satisfies ToolExample<Input, Output>;
export const representationCountSuppressionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/representation-count-suppression-flag",
    title: "Representation Count Suppression Flag Tool",
    description:
      "Apply an explicit reporting threshold; this flag alone does not establish disclosure protection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        suppliedMinimum: { type: "integer", minimum: 0 },
        suppressEquality: { type: "boolean" },
      },
      required: ["count", "suppliedMinimum", "suppressEquality"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { suppressed: { type: "boolean" } },
      required: ["suppressed"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedMinimum",
          label: "Supplied Minimum",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppressEquality",
          label: "Suppress Equality",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "suppressed",
          label: "Suppressed",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = representationCountSuppressionFlagTool.execute;
export default representationCountSuppressionFlagTool;
