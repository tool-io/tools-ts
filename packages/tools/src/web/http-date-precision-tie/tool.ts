import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEpochSeconds: number;
  readonly secondEpochSeconds: number;
};
export type Output = {
  readonly sameHttpSecond: boolean;
  readonly differenceDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEpochSeconds: { type: "integer" },
    secondEpochSeconds: { type: "integer" },
  },
  required: ["firstEpochSeconds", "secondEpochSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameHttpSecond: { type: "boolean" },
    differenceDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["sameHttpSecond", "differenceDecimal"],
} as const;
/** Compare already-normalized whole-second HTTP date values, without parsing obsolete date formats. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstEpochSeconds, secondEpochSeconds } = request;
  const compute = (): Output => {
    return {
      sameHttpSecond: firstEpochSeconds === secondEpochSeconds,
      differenceDecimal: (
        BigInt(secondEpochSeconds) - BigInt(firstEpochSeconds)
      ).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstEpochSeconds: 100, secondEpochSeconds: 100 },
  output: { sameHttpSecond: true, differenceDecimal: "0" },
} satisfies ToolExample<Input, Output>;
export const httpDatePrecisionTieTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/http-date-precision-tie",
    title: "HTTP Date Precision Tie Tool",
    description:
      "Compare already-normalized whole-second HTTP date values, without parsing obsolete date formats.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEpochSeconds: { type: "integer" },
        secondEpochSeconds: { type: "integer" },
      },
      required: ["firstEpochSeconds", "secondEpochSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameHttpSecond: { type: "boolean" },
        differenceDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["sameHttpSecond", "differenceDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "firstEpochSeconds",
          label: "First Epoch Seconds",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondEpochSeconds",
          label: "Second Epoch Seconds",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "sameHttpSecond",
          label: "Same Http Second",
          valueType: { type: "boolean" },
        },
        {
          id: "differenceDecimal",
          label: "Difference Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = httpDatePrecisionTieTool.execute;
export default httpDatePrecisionTieTool;
