import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly symbolCost: number;
  readonly referenceCost: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symbolCost: { type: "number" },
    referenceCost: { type: "number" },
  },
  required: ["symbolCost", "referenceCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Return only one supplied symbol code cost minus its explicit reference; not source-wide expected redundancy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { symbolCost, referenceCost } = request;
  const compute = (): Output => {
    return { signedGap: symbolCost - referenceCost };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { symbolCost: 5, referenceCost: 3 },
  output: { signedGap: 2 },
} satisfies ToolExample<Input, Output>;
export const symbolCodeCostReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/symbol-code-cost-reference-gap",
    title: "Symbol Code Cost Reference Gap Tool",
    description:
      "Return only one supplied symbol code cost minus its explicit reference; not source-wide expected redundancy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        symbolCost: { type: "number" },
        referenceCost: { type: "number" },
      },
      required: ["symbolCost", "referenceCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "symbolCost",
          label: "Symbol Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceCost",
          label: "Reference Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = symbolCodeCostReferenceGapTool.execute;
export default symbolCodeCostReferenceGapTool;
