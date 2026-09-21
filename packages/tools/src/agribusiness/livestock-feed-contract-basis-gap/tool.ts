import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localPrice: number;
  readonly referencePrice: number;
  readonly contractedBasis: number;
  readonly quantity: number;
};
export type Output = {
  readonly observedBasis: number;
  readonly basisGap: number;
  readonly valueGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localPrice: { type: "number" },
    referencePrice: { type: "number" },
    contractedBasis: { type: "number" },
    quantity: { type: "number", minimum: 0 },
  },
  required: ["localPrice", "referencePrice", "contractedBasis", "quantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedBasis: { type: "number" },
    basisGap: { type: "number" },
    valueGap: { type: "number" },
  },
  required: ["observedBasis", "basisGap", "valueGap"],
} as const;
/** Calculate livestock feed contract basis gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { localPrice, referencePrice, contractedBasis, quantity } = request;
  const compute = (): Output => {
    H.domain(quantity >= 0);
    return {
      observedBasis: localPrice - referencePrice,
      basisGap: localPrice - referencePrice - contractedBasis,
      valueGap: (localPrice - referencePrice - contractedBasis) * quantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    localPrice: 220,
    referencePrice: 200,
    contractedBasis: 15,
    quantity: 10,
  },
  output: { observedBasis: 20, basisGap: 5, valueGap: 50 },
} satisfies ToolExample<Input, Output>;
export const livestockFeedContractBasisGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/livestock-feed-contract-basis-gap",
    title: "Livestock Feed Contract Basis Gap Tool",
    description:
      "Calculate livestock feed contract basis gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localPrice: { type: "number" },
        referencePrice: { type: "number" },
        contractedBasis: { type: "number" },
        quantity: { type: "number", minimum: 0 },
      },
      required: ["localPrice", "referencePrice", "contractedBasis", "quantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedBasis: { type: "number" },
        basisGap: { type: "number" },
        valueGap: { type: "number" },
      },
      required: ["observedBasis", "basisGap", "valueGap"],
    },
    ports: {
      inputs: [
        {
          id: "localPrice",
          label: "Local Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePrice",
          label: "Reference Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contractedBasis",
          label: "Contracted Basis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedBasis",
          label: "Observed Basis",
          valueType: { type: "number" },
        },
        { id: "basisGap", label: "Basis Gap", valueType: { type: "number" } },
        { id: "valueGap", label: "Value Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = livestockFeedContractBasisGapTool.execute;
export default livestockFeedContractBasisGapTool;
