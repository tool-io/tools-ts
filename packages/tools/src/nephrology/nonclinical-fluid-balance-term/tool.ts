import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputs: readonly number[];
  readonly outputs: readonly number[];
};
export type Output = {
  readonly totalInput: number;
  readonly totalOutput: number;
  readonly balance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputs: { type: "array", maxItems: 256, items: { type: "number" } },
    outputs: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["inputs", "outputs"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalInput: { type: "number" },
    totalOutput: { type: "number" },
    balance: { type: "number" },
  },
  required: ["totalInput", "totalOutput", "balance"],
} as const;
/** Subtract explicitly supplied compatible bench-fluid outputs from inputs; no patient management guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputs, outputs } = request;
  const compute = (): Output => {
    H.domain([...inputs, ...outputs].every((x) => x >= 0));
    return {
      totalInput: inputs.reduce((a, b) => a + b, 0),
      totalOutput: outputs.reduce((a, b) => a + b, 0),
      balance:
        inputs.reduce((a, b) => a + b, 0) - outputs.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inputs: [100, 50], outputs: [80, 20] },
  output: { totalInput: 150, totalOutput: 100, balance: 50 },
} satisfies ToolExample<Input, Output>;
export const nonclinicalFluidBalanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nephrology/nonclinical-fluid-balance-term",
    title: "Nonclinical Fluid Balance Term Tool",
    description:
      "Subtract explicitly supplied compatible bench-fluid outputs from inputs; no patient management guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputs: { type: "array", maxItems: 256, items: { type: "number" } },
        outputs: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["inputs", "outputs"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalInput: { type: "number" },
        totalOutput: { type: "number" },
        balance: { type: "number" },
      },
      required: ["totalInput", "totalOutput", "balance"],
    },
    ports: {
      inputs: [
        {
          id: "inputs",
          label: "Inputs",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "outputs",
          label: "Outputs",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "totalInput",
          label: "Total Input",
          valueType: { type: "number" },
        },
        {
          id: "totalOutput",
          label: "Total Output",
          valueType: { type: "number" },
        },
        { id: "balance", label: "Balance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = nonclinicalFluidBalanceTermTool.execute;
export default nonclinicalFluidBalanceTermTool;
