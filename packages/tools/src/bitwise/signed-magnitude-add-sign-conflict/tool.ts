import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly leftSign: boolean;
  readonly leftMagnitude: string;
  readonly rightSign: boolean;
  readonly rightMagnitude: string;
};
export type Output = {
  readonly conflict: boolean;
  readonly cancel: boolean;
  readonly dominantSign: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftSign: { type: "boolean" },
    leftMagnitude: { type: "string", maxLength: 8192 },
    rightSign: { type: "boolean" },
    rightMagnitude: { type: "string", maxLength: 8192 },
  },
  required: ["leftSign", "leftMagnitude", "rightSign", "rightMagnitude"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conflict: { type: "boolean" },
    cancel: { type: "boolean" },
    dominantSign: { type: "boolean" },
  },
  required: ["conflict", "cancel", "dominantSign"],
} as const;
/** Compute signed magnitude add sign conflict from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { leftSign, leftMagnitude, rightSign, rightMagnitude } = input;
  const compute = (): Output => {
    const a = decimal(leftMagnitude),
      b = decimal(rightMagnitude);
    domain(a >= 0n && b >= 0n);
    const conflict = leftSign !== rightSign && a !== 0n && b !== 0n;
    return {
      conflict,
      cancel: conflict && a === b,
      dominantSign: a === b ? false : a > b ? leftSign : rightSign,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    leftSign: true,
    leftMagnitude: "5",
    rightSign: false,
    rightMagnitude: "3",
  },
  output: { conflict: true, cancel: false, dominantSign: true },
} satisfies ToolExample<Input, Output>;
export const signedMagnitudeAddSignConflictTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "bitwise/signed-magnitude-add-sign-conflict",
  title: "Signed Magnitude Add Sign Conflict Tool",
  description:
    "Compute signed magnitude add sign conflict from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "leftSign",
        label: "Left Sign",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "leftMagnitude",
        label: "Left Magnitude",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "rightSign",
        label: "Right Sign",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "rightMagnitude",
        label: "Right Magnitude",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "conflict", label: "Conflict", valueType: { type: "boolean" } },
      { id: "cancel", label: "Cancel", valueType: { type: "boolean" } },
      {
        id: "dominantSign",
        label: "Dominant Sign",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = signedMagnitudeAddSignConflictTool.execute;
export default signedMagnitudeAddSignConflictTool;
