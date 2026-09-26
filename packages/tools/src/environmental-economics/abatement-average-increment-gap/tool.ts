import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly averageCost: number;
  readonly marginalCost: number;
  readonly averageBasis: string;
  readonly marginalBasis: string;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    averageCost: { type: "number" },
    marginalCost: { type: "number" },
    averageBasis: { type: "string", maxLength: 8192 },
    marginalBasis: { type: "string", maxLength: 8192 },
  },
  required: ["averageCost", "marginalCost", "averageBasis", "marginalBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Compare supplied average and marginal abatement costs on an identical explicit quantity basis without recommending policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { averageCost, marginalCost, averageBasis, marginalBasis } = request;
  const compute = (): Output => {
    H.domain(averageBasis.length > 0 && averageBasis === marginalBasis);
    return { gap: marginalCost - averageCost };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    averageCost: 20,
    marginalCost: 30,
    averageBasis: "USD/tonne",
    marginalBasis: "USD/tonne",
  },
  output: { gap: 10 },
} satisfies ToolExample<Input, Output>;
export const abatementAverageIncrementGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/abatement-average-increment-gap",
    title: "Abatement Average Increment Gap Tool",
    description:
      "Compare supplied average and marginal abatement costs on an identical explicit quantity basis without recommending policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        averageCost: { type: "number" },
        marginalCost: { type: "number" },
        averageBasis: { type: "string", maxLength: 8192 },
        marginalBasis: { type: "string", maxLength: 8192 },
      },
      required: [
        "averageCost",
        "marginalCost",
        "averageBasis",
        "marginalBasis",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "averageCost",
          label: "Average Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "marginalCost",
          label: "Marginal Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "averageBasis",
          label: "Average Basis",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "marginalBasis",
          label: "Marginal Basis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = abatementAverageIncrementGapTool.execute;
export default abatementAverageIncrementGapTool;
