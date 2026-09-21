import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputs: readonly number[];
  readonly outputs: readonly number[];
  readonly includedInputs: readonly boolean[];
  readonly includedOutputs: readonly boolean[];
};
export type Output = {
  readonly inputTotal: number;
  readonly outputTotal: number;
  readonly balance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputs: { type: "array", maxItems: 256, items: { type: "number" } },
    outputs: { type: "array", maxItems: 256, items: { type: "number" } },
    includedInputs: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    includedOutputs: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["inputs", "outputs", "includedInputs", "includedOutputs"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputTotal: { type: "number" },
    outputTotal: { type: "number" },
    balance: { type: "number" },
  },
  required: ["inputTotal", "outputTotal", "balance"],
} as const;
/** Sum explicitly included nutrient ledger terms without soil or crop recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputs, outputs, includedInputs, includedOutputs } = request;
  const compute = (): Output => {
    H.sameLength(inputs, includedInputs);
    H.sameLength(outputs, includedOutputs);
    H.domain([...inputs, ...outputs].every((x) => x >= 0));
    return {
      inputTotal: inputs.reduce(
        (s, x, i) => s + (includedInputs[i] ? x : 0),
        0,
      ),
      outputTotal: outputs.reduce(
        (s, x, i) => s + (includedOutputs[i] ? x : 0),
        0,
      ),
      balance:
        inputs.reduce((s, x, i) => s + (includedInputs[i] ? x : 0), 0) -
        outputs.reduce((s, x, i) => s + (includedOutputs[i] ? x : 0), 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inputs: [10, 5],
    outputs: [8],
    includedInputs: [true, false],
    includedOutputs: [true],
  },
  output: { inputTotal: 10, outputTotal: 8, balance: 2 },
} satisfies ToolExample<Input, Output>;
export const nutrientBalanceBoundaryTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrochemistry/nutrient-balance-boundary-term",
    title: "Nutrient Balance Boundary Term Tool",
    description:
      "Sum explicitly included nutrient ledger terms without soil or crop recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputs: { type: "array", maxItems: 256, items: { type: "number" } },
        outputs: { type: "array", maxItems: 256, items: { type: "number" } },
        includedInputs: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        includedOutputs: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["inputs", "outputs", "includedInputs", "includedOutputs"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputTotal: { type: "number" },
        outputTotal: { type: "number" },
        balance: { type: "number" },
      },
      required: ["inputTotal", "outputTotal", "balance"],
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
        {
          id: "includedInputs",
          label: "Included Inputs",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "includedOutputs",
          label: "Included Outputs",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "inputTotal",
          label: "Input Total",
          valueType: { type: "number" },
        },
        {
          id: "outputTotal",
          label: "Output Total",
          valueType: { type: "number" },
        },
        { id: "balance", label: "Balance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = nutrientBalanceBoundaryTermTool.execute;
export default nutrientBalanceBoundaryTermTool;
