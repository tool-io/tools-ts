import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly age: number;
  readonly lower: number;
  readonly upper: number;
  readonly upperInclusive: boolean;
};
export type Output = { readonly member: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    age: { type: "number", minimum: 0 },
    lower: { type: "number", minimum: 0 },
    upper: { type: "number" },
    upperInclusive: { type: "boolean" },
  },
  required: ["age", "lower", "upper", "upperInclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { member: { type: "boolean" } },
  required: ["member"],
} as const;
/** Calculate age set explicit boundary membership from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { age, lower, upper, upperInclusive } = request;
  const compute = (): Output => {
    H.domain(age >= 0 && lower >= 0 && upper > lower);
    return {
      member: age >= lower && (upperInclusive ? age <= upper : age < upper),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { age: 18, lower: 18, upper: 25, upperInclusive: false },
  output: { member: true },
} satisfies ToolExample<Input, Output>;
export const ageSetExplicitBoundaryMembershipTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/age-set-explicit-boundary-membership",
    title: "Age Set Explicit Boundary Membership Tool",
    description:
      "Calculate age set explicit boundary membership from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        age: { type: "number", minimum: 0 },
        lower: { type: "number", minimum: 0 },
        upper: { type: "number" },
        upperInclusive: { type: "boolean" },
      },
      required: ["age", "lower", "upper", "upperInclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { member: { type: "boolean" } },
      required: ["member"],
    },
    ports: {
      inputs: [
        {
          id: "age",
          label: "Age",
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
          id: "upperInclusive",
          label: "Upper Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "member", label: "Member", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = ageSetExplicitBoundaryMembershipTool.execute;
export default ageSetExplicitBoundaryMembershipTool;
