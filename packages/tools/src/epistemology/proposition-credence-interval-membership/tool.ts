import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly credence: number;
  readonly lower: number;
  readonly upper: number;
  readonly includeLower: boolean;
  readonly includeUpper: boolean;
};
export type Output = { readonly inside: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    credence: { type: "number", minimum: 0, maximum: 1 },
    lower: { type: "number", minimum: 0, maximum: 1 },
    upper: { type: "number", minimum: 0, maximum: 1 },
    includeLower: { type: "boolean" },
    includeUpper: { type: "boolean" },
  },
  required: ["credence", "lower", "upper", "includeLower", "includeUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inside: { type: "boolean" } },
  required: ["inside"],
} as const;
/** Test a stated credence against an explicit interval with caller-selected endpoint inclusion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { credence, lower, upper, includeLower, includeUpper } = request;
  const compute = (): Output => {
    (H.domain(credence >= 0 && credence <= 1, "credence"), credence);
    (H.domain(lower >= 0 && lower <= 1, "lower"), lower);
    (H.domain(upper >= 0 && upper <= 1, "upper"), upper);
    H.domain(lower <= upper, "lower");
    return {
      inside:
        (credence > lower || (includeLower && credence === lower)) &&
        (credence < upper || (includeUpper && credence === upper)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    credence: 0.6,
    lower: 0.4,
    upper: 0.8,
    includeLower: true,
    includeUpper: false,
  },
  output: { inside: true },
} satisfies ToolExample<Input, Output>;
export const propositionCredenceIntervalMembershipTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["epistemology", "philosophy"],
        keywords: ["epistemology", "philosophy"],
      },
      id: "epistemology/proposition-credence-interval-membership",
      title: "Proposition Credence Interval Membership",
      description:
        "Test a stated credence against an explicit interval with caller-selected endpoint inclusion.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          credence: { type: "number", minimum: 0, maximum: 1 },
          lower: { type: "number", minimum: 0, maximum: 1 },
          upper: { type: "number", minimum: 0, maximum: 1 },
          includeLower: { type: "boolean" },
          includeUpper: { type: "boolean" },
        },
        required: [
          "credence",
          "lower",
          "upper",
          "includeLower",
          "includeUpper",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { inside: { type: "boolean" } },
        required: ["inside"],
      },
      ports: {
        inputs: [
          {
            id: "credence",
            label: "Credence",
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
            id: "includeLower",
            label: "Include Lower",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "includeUpper",
            label: "Include Upper",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "inside", label: "Inside", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = propositionCredenceIntervalMembershipTool.execute;
export default propositionCredenceIntervalMembershipTool;
