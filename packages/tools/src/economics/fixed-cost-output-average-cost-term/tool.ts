import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fixedCost: number;
  readonly outputQuantity: number;
};
export type Output = { readonly fixedCostPerOutput: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fixedCost: { type: "number", minimum: 0 },
    outputQuantity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["fixedCost", "outputQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fixedCostPerOutput: { type: "number" } },
  required: ["fixedCostPerOutput"],
} as const;
/** Allocate explicit fixed cost over a positive supplied output quantity without estimating total production cost. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fixedCost, outputQuantity } = request;
  const compute = (): Output => {
    H.domain(fixedCost >= 0, "fixedCost");
    (H.domain(
      Number.isFinite(outputQuantity) && outputQuantity > 0,
      "outputQuantity",
    ),
      outputQuantity);
    return { fixedCostPerOutput: fixedCost / outputQuantity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fixedCost: 1200, outputQuantity: 300 },
  output: { fixedCostPerOutput: 4 },
} satisfies ToolExample<Input, Output>;
export const fixedCostOutputAverageCostTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["economics"],
      keywords: ["economics"],
    },
    id: "economics/fixed-cost-output-average-cost-term",
    title: "Fixed Cost Output Average Cost Term",
    description:
      "Allocate explicit fixed cost over a positive supplied output quantity without estimating total production cost.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fixedCost: { type: "number", minimum: 0 },
        outputQuantity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["fixedCost", "outputQuantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fixedCostPerOutput: { type: "number" } },
      required: ["fixedCostPerOutput"],
    },
    ports: {
      inputs: [
        {
          id: "fixedCost",
          label: "Fixed Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outputQuantity",
          label: "Output Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fixedCostPerOutput",
          label: "Fixed Cost Per Output",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fixedCostOutputAverageCostTermTool.execute;
export default fixedCostOutputAverageCostTermTool;
