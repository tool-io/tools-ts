import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly membership: readonly boolean[] };
export type Output = { readonly included: boolean; readonly trueCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    membership: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["membership"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { included: { type: "boolean" }, trueCount: { type: "integer" } },
  required: ["included", "trueCount"],
} as const;
/** Evaluate membership in the symmetric difference of an explicitly supplied finite tuple of set-membership bits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { membership } = request;
  const compute = (): Output => {
    const trueCount = membership.filter(Boolean).length;
    return { included: trueCount % 2 === 1, trueCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { membership: [true, false, true, true] },
  output: { included: true, trueCount: 3 },
} satisfies ToolExample<Input, Output>;
export const symmetricDifferenceParityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/symmetric-difference-parity",
    title: "Symmetric Difference Parity Tool",
    description:
      "Evaluate membership in the symmetric difference of an explicitly supplied finite tuple of set-membership bits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        membership: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["membership"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        included: { type: "boolean" },
        trueCount: { type: "integer" },
      },
      required: ["included", "trueCount"],
    },
    ports: {
      inputs: [
        {
          id: "membership",
          label: "Membership",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "included", label: "Included", valueType: { type: "boolean" } },
        {
          id: "trueCount",
          label: "True Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = symmetricDifferenceParityTool.execute;
export default symmetricDifferenceParityTool;
