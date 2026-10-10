import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftLength: number;
  readonly rightLength: number;
};
export type Output = {
  readonly leftMinusRight: number;
  readonly absoluteDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftLength: { type: "number", minimum: 0 },
    rightLength: { type: "number", minimum: 0 },
  },
  required: ["leftLength", "rightLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftMinusRight: { type: "number" },
    absoluteDifference: { type: "number" },
  },
  required: ["leftMinusRight", "absoluteDifference"],
} as const;
/** Compare explicitly measured same-method limb lengths without assigning a clinical significance threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftLength, rightLength } = request;
  const compute = (): Output => {
    H.domain(leftLength >= 0 && rightLength >= 0, "leftLength");
    return {
      leftMinusRight: leftLength - rightLength,
      absoluteDifference: Math.abs(leftLength - rightLength),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftLength: 85, rightLength: 83 },
  output: { leftMinusRight: 2, absoluteDifference: 2 },
} satisfies ToolExample<Input, Output>;
export const limbSideLengthDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["orthopedics", "health and medicine"],
      keywords: ["orthopedics", "health and medicine"],
    },
    id: "orthopedics/limb-side-length-difference",
    title: "Limb Side Length Difference",
    description:
      "Compare explicitly measured same-method limb lengths without assigning a clinical significance threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftLength: { type: "number", minimum: 0 },
        rightLength: { type: "number", minimum: 0 },
      },
      required: ["leftLength", "rightLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftMinusRight: { type: "number" },
        absoluteDifference: { type: "number" },
      },
      required: ["leftMinusRight", "absoluteDifference"],
    },
    ports: {
      inputs: [
        {
          id: "leftLength",
          label: "Left Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightLength",
          label: "Right Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "leftMinusRight",
          label: "Left Minus Right",
          valueType: { type: "number" },
        },
        {
          id: "absoluteDifference",
          label: "Absolute Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = limbSideLengthDifferenceTool.execute;
export default limbSideLengthDifferenceTool;
