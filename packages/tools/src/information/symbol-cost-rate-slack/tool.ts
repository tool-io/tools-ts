import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly symbolCost: number;
  readonly suppliedRate: number;
};
export type Output = { readonly slack: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symbolCost: { type: "number" },
    suppliedRate: { type: "number" },
  },
  required: ["symbolCost", "suppliedRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slack: { type: "number" } },
  required: ["slack"],
} as const;
/** Compare one supplied symbol cost with an explicit compatible rate budget. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { symbolCost, suppliedRate } = request;
  const compute = (): Output => {
    return { slack: suppliedRate - symbolCost };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { symbolCost: 3, suppliedRate: 5 },
  output: { slack: 2 },
} satisfies ToolExample<Input, Output>;
export const symbolCostRateSlackTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "information/symbol-cost-rate-slack",
      title: "Symbol Cost Rate Slack Tool",
      description:
        "Compare one supplied symbol cost with an explicit compatible rate budget.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          symbolCost: { type: "number" },
          suppliedRate: { type: "number" },
        },
        required: ["symbolCost", "suppliedRate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { slack: { type: "number" } },
        required: ["slack"],
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
            id: "suppliedRate",
            label: "Supplied Rate",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "slack", label: "Slack", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  },
);
export const run = symbolCostRateSlackTool.execute;
export default symbolCostRateSlackTool;
