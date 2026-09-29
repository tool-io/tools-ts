import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly costs: readonly number[];
  readonly lineTerms: readonly string[];
  readonly requestedTerm: string;
  readonly totalCost: number;
};
export type Output = { readonly matchedCost: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    costs: { type: "array", maxItems: 256, items: { type: "number" } },
    lineTerms: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedTerm: { type: "string", maxLength: 8192 },
    totalCost: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["costs", "lineTerms", "requestedTerm", "totalCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matchedCost: { type: "number" }, share: { type: "number" } },
  required: ["matchedCost", "share"],
} as const;
/** Sum caller-classified cost lines for one supplied freight term without interpreting Incoterms obligations or editions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { costs, lineTerms, requestedTerm, totalCost } = request;
  const compute = (): Output => {
    H.sameLength(costs, lineTerms);
    H.domain(costs.every((x) => x >= 0));
    H.positive(totalCost);
    const matchedCost = costs.reduce(
      (a, b, i) => a + (lineTerms[i] === requestedTerm ? b : 0),
      0,
    );
    return { matchedCost, share: matchedCost / totalCost };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    costs: [10, 20, 30],
    lineTerms: ["A", "B", "A"],
    requestedTerm: "A",
    totalCost: 100,
  },
  output: { matchedCost: 40, share: 0.4 },
} satisfies ToolExample<Input, Output>;
export const incotermCostLineShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/incoterm-cost-line-share",
    title: "Incoterm Cost Line Share Tool",
    description:
      "Sum caller-classified cost lines for one supplied freight term without interpreting Incoterms obligations or editions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        costs: { type: "array", maxItems: 256, items: { type: "number" } },
        lineTerms: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requestedTerm: { type: "string", maxLength: 8192 },
        totalCost: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["costs", "lineTerms", "requestedTerm", "totalCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matchedCost: { type: "number" },
        share: { type: "number" },
      },
      required: ["matchedCost", "share"],
    },
    ports: {
      inputs: [
        {
          id: "costs",
          label: "Costs",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "lineTerms",
          label: "Line Terms",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requestedTerm",
          label: "Requested Term",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "totalCost",
          label: "Total Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "matchedCost",
          label: "Matched Cost",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = incotermCostLineShareTool.execute;
export default incotermCostLineShareTool;
