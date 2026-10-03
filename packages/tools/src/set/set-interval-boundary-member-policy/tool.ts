import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly value: number;
  readonly lower: number;
  readonly upper: number;
  readonly lowerClosed: boolean;
  readonly upperClosed: boolean;
};
export type Output = { readonly member: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    lowerClosed: { type: "boolean" },
    upperClosed: { type: "boolean" },
  },
  required: ["value", "lower", "upper", "lowerClosed", "upperClosed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { member: { type: "boolean" } },
  required: ["member"],
} as const;
/** Compute set interval boundary member policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value, lower, upper, lowerClosed, upperClosed } = input;
  const compute = (): Output => {
    domain(lower <= upper);
    return {
      member:
        (value > lower || (lowerClosed && value === lower)) &&
        (value < upper || (upperClosed && value === upper)),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    value: 2,
    lower: 2,
    upper: 5,
    lowerClosed: true,
    upperClosed: false,
  },
  output: { member: true },
} satisfies ToolExample<Input, Output>;
export const setIntervalBoundaryMemberPolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/set-interval-boundary-member-policy",
  title: "Set Interval Boundary Member Policy Tool",
  description:
    "Compute set interval boundary member policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "lower",
        label: "Lower",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "upper",
        label: "Upper",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "lowerClosed",
        label: "Lower Closed",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "upperClosed",
        label: "Upper Closed",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "member", label: "Member", valueType: { type: "boolean" } },
    ],
  },
});
export const run = setIntervalBoundaryMemberPolicyTool.execute;
export default setIntervalBoundaryMemberPolicyTool;
