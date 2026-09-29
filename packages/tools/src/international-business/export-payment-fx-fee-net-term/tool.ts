import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly foreignReceipt: number;
  readonly foreignFixedFee: number;
  readonly domesticPerForeign: number;
  readonly percentFee: number;
  readonly domesticFee: number;
};
export type Output = {
  readonly convertedGross: number;
  readonly domesticNet: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    foreignReceipt: { type: "number" },
    foreignFixedFee: { type: "number", minimum: 0 },
    domesticPerForeign: { type: "number", exclusiveMinimum: 0 },
    percentFee: { type: "number", minimum: 0, maximum: 1 },
    domesticFee: { type: "number", minimum: 0 },
  },
  required: [
    "foreignReceipt",
    "foreignFixedFee",
    "domesticPerForeign",
    "percentFee",
    "domesticFee",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedGross: { type: "number" },
    domesticNet: { type: "number" },
  },
  required: ["convertedGross", "domesticNet"],
} as const;
/** Calculate export payment fx fee net term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    foreignReceipt,
    foreignFixedFee,
    domesticPerForeign,
    percentFee,
    domesticFee,
  } = request;
  const compute = (): Output => {
    H.domain(
      foreignReceipt >= foreignFixedFee &&
        foreignFixedFee >= 0 &&
        domesticFee >= 0,
    );
    H.positive(domesticPerForeign);
    H.probability(percentFee);
    return {
      convertedGross: (foreignReceipt - foreignFixedFee) * domesticPerForeign,
      domesticNet:
        (foreignReceipt - foreignFixedFee) *
          domesticPerForeign *
          (1 - percentFee) -
        domesticFee,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    foreignReceipt: 10000,
    foreignFixedFee: 50,
    domesticPerForeign: 1.2,
    percentFee: 0.01,
    domesticFee: 20,
  },
  output: { convertedGross: 11940, domesticNet: 11800.6 },
} satisfies ToolExample<Input, Output>;
export const exportPaymentFxFeeNetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/export-payment-fx-fee-net-term",
    title: "Export Payment Fx Fee Net Term Tool",
    description:
      "Calculate export payment fx fee net term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        foreignReceipt: { type: "number" },
        foreignFixedFee: { type: "number", minimum: 0 },
        domesticPerForeign: { type: "number", exclusiveMinimum: 0 },
        percentFee: { type: "number", minimum: 0, maximum: 1 },
        domesticFee: { type: "number", minimum: 0 },
      },
      required: [
        "foreignReceipt",
        "foreignFixedFee",
        "domesticPerForeign",
        "percentFee",
        "domesticFee",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedGross: { type: "number" },
        domesticNet: { type: "number" },
      },
      required: ["convertedGross", "domesticNet"],
    },
    ports: {
      inputs: [
        {
          id: "foreignReceipt",
          label: "Foreign Receipt",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "foreignFixedFee",
          label: "Foreign Fixed Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "domesticPerForeign",
          label: "Domestic Per Foreign",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "percentFee",
          label: "Percent Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "domesticFee",
          label: "Domestic Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedGross",
          label: "Converted Gross",
          valueType: { type: "number" },
        },
        {
          id: "domesticNet",
          label: "Domestic Net",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exportPaymentFxFeeNetTermTool.execute;
export default exportPaymentFxFeeNetTermTool;
