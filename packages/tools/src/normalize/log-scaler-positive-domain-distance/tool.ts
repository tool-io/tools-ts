import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: number; readonly lowerBoundary: number };
export type Output = { readonly distance: number; readonly valid: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" }, lowerBoundary: { type: "number" } },
  required: ["value", "lowerBoundary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" }, valid: { type: "boolean" } },
  required: ["distance", "valid"],
} as const;
/** Calculate log scaler positive domain distance from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { value, lowerBoundary } = input;
  const compute = (): Output => {
    return { distance: value - lowerBoundary, valid: value > lowerBoundary };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 3, lowerBoundary: 1 },
  output: { distance: 2, valid: true },
} satisfies ToolExample<Input, Output>;
export const logScalerPositiveDomainDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/log-scaler-positive-domain-distance",
    title: "Log Scaler Positive Domain Distance Tool",
    description:
      "Calculate log scaler positive domain distance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        lowerBoundary: { type: "number" },
      },
      required: ["value", "lowerBoundary"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distance: { type: "number" }, valid: { type: "boolean" } },
      required: ["distance", "valid"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerBoundary",
          label: "Lower Boundary",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = logScalerPositiveDomainDistanceTool.execute;
export default logScalerPositiveDomainDistanceTool;
