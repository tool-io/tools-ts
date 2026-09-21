import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstInput: number;
  readonly secondInput: number;
  readonly firstYield: number;
  readonly secondYield: number;
  readonly outputPrice: number;
  readonly inputPrice: number;
};
export type Output = {
  readonly marginalYield: number;
  readonly marginalValue: number;
  readonly marginalNet: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstInput: { type: "number" },
    secondInput: { type: "number" },
    firstYield: { type: "number" },
    secondYield: { type: "number" },
    outputPrice: { type: "number", minimum: 0 },
    inputPrice: { type: "number", minimum: 0 },
  },
  required: [
    "firstInput",
    "secondInput",
    "firstYield",
    "secondYield",
    "outputPrice",
    "inputPrice",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marginalYield: { type: "number" },
    marginalValue: { type: "number" },
    marginalNet: { type: "number" },
  },
  required: ["marginalYield", "marginalValue", "marginalNet"],
} as const;
/** Observed finite-difference response, not a fitted optimum or fertilizer recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstInput,
    secondInput,
    firstYield,
    secondYield,
    outputPrice,
    inputPrice,
  } = request;
  const compute = (): Output => {
    H.domain(secondInput > firstInput && outputPrice >= 0 && inputPrice >= 0);
    return {
      marginalYield: (secondYield - firstYield) / (secondInput - firstInput),
      marginalValue:
        ((secondYield - firstYield) * outputPrice) / (secondInput - firstInput),
      marginalNet:
        ((secondYield - firstYield) * outputPrice) /
          (secondInput - firstInput) -
        inputPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstInput: 10,
    secondInput: 20,
    firstYield: 100,
    secondYield: 130,
    outputPrice: 2,
    inputPrice: 4,
  },
  output: { marginalYield: 3, marginalValue: 6, marginalNet: 2 },
} satisfies ToolExample<Input, Output>;
export const fertilizerMarginalResponseOneStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/fertilizer-marginal-response-one-step",
    title: "Fertilizer Marginal Response One Step Tool",
    description:
      "Observed finite-difference response, not a fitted optimum or fertilizer recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstInput: { type: "number" },
        secondInput: { type: "number" },
        firstYield: { type: "number" },
        secondYield: { type: "number" },
        outputPrice: { type: "number", minimum: 0 },
        inputPrice: { type: "number", minimum: 0 },
      },
      required: [
        "firstInput",
        "secondInput",
        "firstYield",
        "secondYield",
        "outputPrice",
        "inputPrice",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marginalYield: { type: "number" },
        marginalValue: { type: "number" },
        marginalNet: { type: "number" },
      },
      required: ["marginalYield", "marginalValue", "marginalNet"],
    },
    ports: {
      inputs: [
        {
          id: "firstInput",
          label: "First Input",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondInput",
          label: "Second Input",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstYield",
          label: "First Yield",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondYield",
          label: "Second Yield",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outputPrice",
          label: "Output Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputPrice",
          label: "Input Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "marginalYield",
          label: "Marginal Yield",
          valueType: { type: "number" },
        },
        {
          id: "marginalValue",
          label: "Marginal Value",
          valueType: { type: "number" },
        },
        {
          id: "marginalNet",
          label: "Marginal Net",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fertilizerMarginalResponseOneStepTool.execute;
export default fertilizerMarginalResponseOneStepTool;
