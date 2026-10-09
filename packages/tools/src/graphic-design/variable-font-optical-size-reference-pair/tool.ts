import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opticalSizeAxisValue: number;
  readonly suppliedReferenceAxisValue: number;
};
export type Output = { readonly axisValueDifference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opticalSizeAxisValue: { type: "number" },
    suppliedReferenceAxisValue: { type: "number" },
  },
  required: ["opticalSizeAxisValue", "suppliedReferenceAxisValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { axisValueDifference: { type: "number" } },
  required: ["axisValueDifference"],
} as const;
/** Compare an explicit variable-font optical-size axis coordinate with a supplied reference without selecting font-specific bounds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opticalSizeAxisValue, suppliedReferenceAxisValue } = request;
  const compute = (): Output => {
    return {
      axisValueDifference: opticalSizeAxisValue - suppliedReferenceAxisValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { opticalSizeAxisValue: 14, suppliedReferenceAxisValue: 12 },
  output: { axisValueDifference: 2 },
} satisfies ToolExample<Input, Output>;
export const variableFontOpticalSizeReferencePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "graphic-design/variable-font-optical-size-reference-pair",
      title: "Variable Font Optical Size Reference Pair Tool",
      description:
        "Compare an explicit variable-font optical-size axis coordinate with a supplied reference without selecting font-specific bounds.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opticalSizeAxisValue: { type: "number" },
          suppliedReferenceAxisValue: { type: "number" },
        },
        required: ["opticalSizeAxisValue", "suppliedReferenceAxisValue"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { axisValueDifference: { type: "number" } },
        required: ["axisValueDifference"],
      },
      ports: {
        inputs: [
          {
            id: "opticalSizeAxisValue",
            label: "Optical Size Axis Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedReferenceAxisValue",
            label: "Supplied Reference Axis Value",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "axisValueDifference",
            label: "Axis Value Difference",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = variableFontOpticalSizeReferencePairTool.execute;
export default variableFontOpticalSizeReferencePairTool;
