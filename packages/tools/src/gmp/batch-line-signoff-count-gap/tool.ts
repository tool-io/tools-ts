import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredSignoffs: number;
  readonly suppliedSignoffs: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredSignoffs: { type: "integer", minimum: 0 },
    suppliedSignoffs: { type: "integer", minimum: 0 },
  },
  required: ["requiredSignoffs", "suppliedSignoffs"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "integer" } },
  required: ["gap"],
} as const;
/** Compare explicit batch-record signoff counts without certifying GMP compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredSignoffs, suppliedSignoffs } = request;
  const compute = (): Output => {
    H.integer(requiredSignoffs, 0);
    H.integer(suppliedSignoffs, 0);
    return { gap: suppliedSignoffs - requiredSignoffs };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredSignoffs: 8, suppliedSignoffs: 6 },
  output: { gap: -2 },
} satisfies ToolExample<Input, Output>;
export const batchLineSignoffCountGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/batch-line-signoff-count-gap",
    title: "Batch Line Signoff Count Gap Tool",
    description:
      "Compare explicit batch-record signoff counts without certifying GMP compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredSignoffs: { type: "integer", minimum: 0 },
        suppliedSignoffs: { type: "integer", minimum: 0 },
      },
      required: ["requiredSignoffs", "suppliedSignoffs"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "integer" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "requiredSignoffs",
          label: "Required Signoffs",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedSignoffs",
          label: "Supplied Signoffs",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = batchLineSignoffCountGapTool.execute;
export default batchLineSignoffCountGapTool;
