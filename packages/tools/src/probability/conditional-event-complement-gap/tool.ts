import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly jointProbability: number;
  readonly conditioningProbability: number;
  readonly suppliedComplement: number;
};
export type Output = {
  readonly conditionalProbability: number;
  readonly impliedComplement: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jointProbability: { type: "number", minimum: 0, maximum: 1 },
    conditioningProbability: {
      type: "number",
      exclusiveMinimum: 0,
      minimum: 0,
      maximum: 1,
    },
    suppliedComplement: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "jointProbability",
    "conditioningProbability",
    "suppliedComplement",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditionalProbability: { type: "number" },
    impliedComplement: { type: "number" },
    gap: { type: "number" },
  },
  required: ["conditionalProbability", "impliedComplement", "gap"],
} as const;
/** Calculate conditional event complement gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { jointProbability, conditioningProbability, suppliedComplement } =
    request;
  const compute = (): Output => {
    H.probability(jointProbability);
    H.probability(conditioningProbability);
    H.positive(conditioningProbability);
    H.domain(jointProbability <= conditioningProbability);
    H.probability(suppliedComplement);
    return {
      conditionalProbability: jointProbability / conditioningProbability,
      impliedComplement: 1 - jointProbability / conditioningProbability,
      gap:
        suppliedComplement - (1 - jointProbability / conditioningProbability),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    jointProbability: 0.2,
    conditioningProbability: 0.5,
    suppliedComplement: 0.7,
  },
  output: {
    conditionalProbability: 0.4,
    impliedComplement: 0.6,
    gap: 0.09999999999999998,
  },
} satisfies ToolExample<Input, Output>;
export const conditionalEventComplementGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/conditional-event-complement-gap",
    title: "Conditional Event Complement Gap Tool",
    description:
      "Calculate conditional event complement gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        jointProbability: { type: "number", minimum: 0, maximum: 1 },
        conditioningProbability: {
          type: "number",
          exclusiveMinimum: 0,
          minimum: 0,
          maximum: 1,
        },
        suppliedComplement: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "jointProbability",
        "conditioningProbability",
        "suppliedComplement",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conditionalProbability: { type: "number" },
        impliedComplement: { type: "number" },
        gap: { type: "number" },
      },
      required: ["conditionalProbability", "impliedComplement", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "jointProbability",
          label: "Joint Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "conditioningProbability",
          label: "Conditioning Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedComplement",
          label: "Supplied Complement",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "conditionalProbability",
          label: "Conditional Probability",
          valueType: { type: "number" },
        },
        {
          id: "impliedComplement",
          label: "Implied Complement",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = conditionalEventComplementGapTool.execute;
export default conditionalEventComplementGapTool;
