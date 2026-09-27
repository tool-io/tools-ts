import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly budget: number;
  readonly needWeight: number;
  readonly totalWeight: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    budget: { type: "number", minimum: 0 },
    needWeight: { type: "number", minimum: 0 },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["budget", "needWeight", "totalWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate need weighted allocation one share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { budget, needWeight, totalWeight } = request;
  const compute = (): Output => {
    H.domain(budget >= 0 && needWeight >= 0);
    H.positive(totalWeight);
    H.domain(needWeight <= totalWeight);
    return { share: (budget * needWeight) / totalWeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { budget: 100, needWeight: 3, totalWeight: 10 },
  output: { share: 30 },
} satisfies ToolExample<Input, Output>;
export const needWeightedAllocationOneShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/need-weighted-allocation-one-share",
    title: "Need Weighted Allocation One Share Tool",
    description:
      "Calculate need weighted allocation one share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        budget: { type: "number", minimum: 0 },
        needWeight: { type: "number", minimum: 0 },
        totalWeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["budget", "needWeight", "totalWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "budget",
          label: "Budget",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "needWeight",
          label: "Need Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = needWeightedAllocationOneShareTool.execute;
export default needWeightedAllocationOneShareTool;
