import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly t: number };
export type Output = {
  readonly leftNegative: boolean;
  readonly rightNegative: boolean;
  readonly extrapolated: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { t: { type: "number" } },
  required: ["t"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftNegative: { type: "boolean" },
    rightNegative: { type: "boolean" },
    extrapolated: { type: "boolean" },
  },
  required: ["leftNegative", "rightNegative", "extrapolated"],
} as const;
/** Compute interpolant extrapolated weight sign from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { t } = input;
  const compute = (): Output => {
    return {
      leftNegative: t > 1,
      rightNegative: t < 0,
      extrapolated: t < 0 || t > 1,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { t: 2 },
  output: { leftNegative: true, rightNegative: false, extrapolated: true },
} satisfies ToolExample<Input, Output>;
export const interpolantExtrapolatedWeightSignTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "interpolation/interpolant-extrapolated-weight-sign",
  title: "Interpolant Extrapolated Weight Sign Tool",
  description:
    "Compute interpolant extrapolated weight sign from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      { id: "t", label: "T", required: true, valueType: { type: "number" } },
    ],
    outputs: [
      {
        id: "leftNegative",
        label: "Left Negative",
        valueType: { type: "boolean" },
      },
      {
        id: "rightNegative",
        label: "Right Negative",
        valueType: { type: "boolean" },
      },
      {
        id: "extrapolated",
        label: "Extrapolated",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = interpolantExtrapolatedWeightSignTool.execute;
export default interpolantExtrapolatedWeightSignTool;
