import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly captureLength: number;
  readonly captureRadius: number;
  readonly earlierRadius: number;
  readonly interceptLength: number;
};
export type Output = { readonly earlierLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    captureLength: { type: "number" },
    captureRadius: { type: "number", exclusiveMinimum: 0 },
    earlierRadius: { type: "number", minimum: 0 },
    interceptLength: { type: "number", minimum: 0 },
  },
  required: [
    "captureLength",
    "captureRadius",
    "earlierRadius",
    "interceptLength",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { earlierLength: { type: "number" } },
  required: ["earlierLength"],
} as const;
/** One Fraser-Lee linear body-length/otolith-radius back-calculation with an explicitly supplied intercept. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { captureLength, captureRadius, earlierRadius, interceptLength } =
    request;
  const compute = (): Output => {
    H.positive(captureRadius);
    H.domain(
      earlierRadius >= 0 &&
        earlierRadius <= captureRadius &&
        captureLength >= interceptLength &&
        interceptLength >= 0,
    );
    return {
      earlierLength:
        interceptLength +
        ((captureLength - interceptLength) * earlierRadius) / captureRadius,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    captureLength: 200,
    captureRadius: 10,
    earlierRadius: 4,
    interceptLength: 20,
  },
  output: { earlierLength: 92 },
} satisfies ToolExample<Input, Output>;
export const otolithRadiusFishLengthBackCalcTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ichthyology/otolith-radius-fish-length-back-calc-term",
      title: "Otolith Radius Fish Length Back Calc Term Tool",
      description:
        "One Fraser-Lee linear body-length/otolith-radius back-calculation with an explicitly supplied intercept.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          captureLength: { type: "number" },
          captureRadius: { type: "number", exclusiveMinimum: 0 },
          earlierRadius: { type: "number", minimum: 0 },
          interceptLength: { type: "number", minimum: 0 },
        },
        required: [
          "captureLength",
          "captureRadius",
          "earlierRadius",
          "interceptLength",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { earlierLength: { type: "number" } },
        required: ["earlierLength"],
      },
      ports: {
        inputs: [
          {
            id: "captureLength",
            label: "Capture Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "captureRadius",
            label: "Capture Radius",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "earlierRadius",
            label: "Earlier Radius",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "interceptLength",
            label: "Intercept Length",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "earlierLength",
            label: "Earlier Length",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = otolithRadiusFishLengthBackCalcTermTool.execute;
export default otolithRadiusFishLengthBackCalcTermTool;
