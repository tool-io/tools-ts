import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outputPriceIndex: number;
  readonly inputPriceIndex: number;
};
export type Output = {
  readonly parityRatio: number;
  readonly parityPercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outputPriceIndex: { type: "number", minimum: 0 },
    inputPriceIndex: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["outputPriceIndex", "inputPriceIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parityRatio: { type: "number" },
    parityPercent: { type: "number" },
  },
  required: ["parityRatio", "parityPercent"],
} as const;
/** Compare output and input price indices that use compatible explicit base-period conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outputPriceIndex, inputPriceIndex } = request;
  const compute = (): Output => {
    H.domain(outputPriceIndex >= 0, "outputPriceIndex");
    (H.domain(inputPriceIndex > 0, "inputPriceIndex"), inputPriceIndex);
    return {
      parityRatio: outputPriceIndex / inputPriceIndex,
      parityPercent: (100 * outputPriceIndex) / inputPriceIndex,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outputPriceIndex: 120, inputPriceIndex: 150 },
  output: { parityRatio: 0.8, parityPercent: 80 },
} satisfies ToolExample<Input, Output>;
export const outputPriceInputParityRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "agricultural-economics",
        "agricultural economics",
        "agriculture",
      ],
      keywords: ["agricultural economics", "agriculture"],
    },
    id: "agricultural-economics/output-price-input-parity-ratio",
    title: "Output Price Input Parity Ratio",
    description:
      "Compare output and input price indices that use compatible explicit base-period conventions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outputPriceIndex: { type: "number", minimum: 0 },
        inputPriceIndex: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["outputPriceIndex", "inputPriceIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parityRatio: { type: "number" },
        parityPercent: { type: "number" },
      },
      required: ["parityRatio", "parityPercent"],
    },
    ports: {
      inputs: [
        {
          id: "outputPriceIndex",
          label: "Output Price Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputPriceIndex",
          label: "Input Price Index",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "parityRatio",
          label: "Parity Ratio",
          valueType: { type: "number" },
        },
        {
          id: "parityPercent",
          label: "Parity Percent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = outputPriceInputParityRatioTool.execute;
export default outputPriceInputParityRatioTool;
