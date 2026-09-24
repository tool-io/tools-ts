import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly largestElement: number;
  readonly subsetSize: number;
};
export type Output = { readonly leadingRankDecimal: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    largestElement: { type: "integer", minimum: 0 },
    subsetSize: { type: "integer", minimum: 1, maximum: 256 },
  },
  required: ["largestElement", "subsetSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { leadingRankDecimal: { type: "string", maxLength: 8192 } },
  required: ["leadingRankDecimal"],
} as const;
/** Return the leading colex combinatorial-number-system term choose(maxElement,subsetSize) for a zero-based subset. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { largestElement, subsetSize } = request;
  const compute = (): Output => {
    H.integer(largestElement, 0);
    H.integer(subsetSize, 1, 256);
    H.domain(largestElement >= subsetSize - 1);
    let result = 1n;
    const n = BigInt(largestElement),
      k = BigInt(subsetSize);
    if (n < k) result = 0n;
    else for (let i = 1n; i <= k; i++) result = (result * (n - k + i)) / i;
    return { leadingRankDecimal: result.toString() };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { largestElement: 5, subsetSize: 3 },
  output: { leadingRankDecimal: "10" },
} satisfies ToolExample<Input, Output>;
export const subsetColexLeadingRankTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/subset-colex-leading-rank",
    title: "Subset Colex Leading Rank Tool",
    description:
      "Return the leading colex combinatorial-number-system term choose(maxElement,subsetSize) for a zero-based subset.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        largestElement: { type: "integer", minimum: 0 },
        subsetSize: { type: "integer", minimum: 1, maximum: 256 },
      },
      required: ["largestElement", "subsetSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { leadingRankDecimal: { type: "string", maxLength: 8192 } },
      required: ["leadingRankDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "largestElement",
          label: "Largest Element",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "subsetSize",
          label: "Subset Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "leadingRankDecimal",
          label: "Leading Rank Decimal",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = subsetColexLeadingRankTool.execute;
export default subsetColexLeadingRankTool;
