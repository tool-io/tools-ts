import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantizedCode: number;
  readonly zeroPoint: number;
  readonly minimumCode: number;
  readonly maximumCode: number;
};
export type Output = {
  readonly centeredCode: number;
  readonly isZeroCode: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantizedCode: { type: "integer" },
    zeroPoint: { type: "integer" },
    minimumCode: { type: "integer" },
    maximumCode: { type: "integer" },
  },
  required: ["quantizedCode", "zeroPoint", "minimumCode", "maximumCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centeredCode: { type: "integer" },
    isZeroCode: { type: "boolean" },
  },
  required: ["centeredCode", "isZeroCode"],
} as const;
/** Subtract an explicit quantization zero point from an in-range integer weight code without estimating scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantizedCode, zeroPoint, minimumCode, maximumCode } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(minimumCode) &&
        minimumCode >= -Number.MAX_SAFE_INTEGER &&
        minimumCode <= Number.MAX_SAFE_INTEGER,
      "minimumCode",
    ),
      minimumCode);
    (H.domain(
      Number.isSafeInteger(maximumCode) &&
        maximumCode >= minimumCode &&
        maximumCode <= Number.MAX_SAFE_INTEGER,
      "maximumCode",
    ),
      maximumCode);
    (H.domain(
      Number.isSafeInteger(quantizedCode) &&
        quantizedCode >= minimumCode &&
        quantizedCode <= maximumCode,
      "quantizedCode",
    ),
      quantizedCode);
    (H.domain(
      Number.isSafeInteger(zeroPoint) &&
        zeroPoint >= minimumCode &&
        zeroPoint <= maximumCode,
      "zeroPoint",
    ),
      zeroPoint);
    return {
      centeredCode: Number(BigInt(quantizedCode) - BigInt(zeroPoint)),
      isZeroCode: quantizedCode === zeroPoint,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    quantizedCode: 130,
    zeroPoint: 128,
    minimumCode: 0,
    maximumCode: 255,
  },
  output: { centeredCode: 2, isZeroCode: false },
} satisfies ToolExample<Input, Output>;
export const quantizedWeightZeroPointCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: [
        "artificial-intelligence",
        "artificial intelligence",
        "computer science",
      ],
      keywords: ["artificial intelligence", "computer science"],
    },
    id: "artificial-intelligence/quantized-weight-zero-point-code",
    title: "Quantized Weight Zero Point Code",
    description:
      "Subtract an explicit quantization zero point from an in-range integer weight code without estimating scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantizedCode: { type: "integer" },
        zeroPoint: { type: "integer" },
        minimumCode: { type: "integer" },
        maximumCode: { type: "integer" },
      },
      required: ["quantizedCode", "zeroPoint", "minimumCode", "maximumCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centeredCode: { type: "integer" },
        isZeroCode: { type: "boolean" },
      },
      required: ["centeredCode", "isZeroCode"],
    },
    ports: {
      inputs: [
        {
          id: "quantizedCode",
          label: "Quantized Code",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "zeroPoint",
          label: "Zero Point",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minimumCode",
          label: "Minimum Code",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "maximumCode",
          label: "Maximum Code",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "centeredCode",
          label: "Centered Code",
          valueType: { type: "integer" },
        },
        {
          id: "isZeroCode",
          label: "Is Zero Code",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = quantizedWeightZeroPointCodeTool.execute;
export default quantizedWeightZeroPointCodeTool;
