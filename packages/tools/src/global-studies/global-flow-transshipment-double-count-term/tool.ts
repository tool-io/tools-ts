import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossFlow: number;
  readonly suppliedDoubleCount: number;
};
export type Output = { readonly adjustedFlow: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossFlow: { type: "number", minimum: 0 },
    suppliedDoubleCount: { type: "number", minimum: 0 },
  },
  required: ["grossFlow", "suppliedDoubleCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { adjustedFlow: { type: "number" } },
  required: ["adjustedFlow"],
} as const;
/** Remove an explicitly supplied transshipment double-count amount from gross flow without identifying shipment pathways. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossFlow, suppliedDoubleCount } = request;
  const compute = (): Output => {
    H.domain(grossFlow >= 0, "grossFlow");
    H.domain(suppliedDoubleCount >= 0, "suppliedDoubleCount");
    return { adjustedFlow: grossFlow - suppliedDoubleCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossFlow: 100, suppliedDoubleCount: 20 },
  output: { adjustedFlow: 80 },
} satisfies ToolExample<Input, Output>;
export const globalFlowTransshipmentDoubleCountTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/global-flow-transshipment-double-count-term",
      title: "Global Flow Transshipment Double Count Term Tool",
      description:
        "Remove an explicitly supplied transshipment double-count amount from gross flow without identifying shipment pathways.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossFlow: { type: "number", minimum: 0 },
          suppliedDoubleCount: { type: "number", minimum: 0 },
        },
        required: ["grossFlow", "suppliedDoubleCount"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { adjustedFlow: { type: "number" } },
        required: ["adjustedFlow"],
      },
      ports: {
        inputs: [
          {
            id: "grossFlow",
            label: "Gross Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedDoubleCount",
            label: "Supplied Double Count",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "adjustedFlow",
            label: "Adjusted Flow",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = globalFlowTransshipmentDoubleCountTermTool.execute;
export default globalFlowTransshipmentDoubleCountTermTool;
