import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly jointProbability: number;
  readonly conditionProbability: number;
};
export type Output = {
  readonly label: string;
  readonly conditional: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jointProbability: { type: "number", minimum: 0, maximum: 1 },
    conditionProbability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["jointProbability", "conditionProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    conditional: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["label", "conditional", "defined"],
} as const;
/** Calculate conditional probability zero case label from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { jointProbability, conditionProbability } = request;
  const compute = (): Output => {
    H.probability(jointProbability);
    H.probability(conditionProbability);
    H.domain(jointProbability <= conditionProbability);
    return {
      label:
        conditionProbability === 0 ? "undefined-zero-condition" : "defined",
      conditional:
        conditionProbability === 0
          ? 0
          : jointProbability / conditionProbability,
      defined: conditionProbability > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { jointProbability: 0, conditionProbability: 0 },
  output: { label: "undefined-zero-condition", conditional: 0, defined: false },
} satisfies ToolExample<Input, Output>;
export const conditionalProbabilityZeroCaseLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "probability/conditional-probability-zero-case-label",
      title: "Conditional Probability Zero Case Label Tool",
      description:
        "Calculate conditional probability zero case label from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          jointProbability: { type: "number", minimum: 0, maximum: 1 },
          conditionProbability: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["jointProbability", "conditionProbability"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string", maxLength: 8192 },
          conditional: { type: "number" },
          defined: { type: "boolean" },
        },
        required: ["label", "conditional", "defined"],
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
            id: "conditionProbability",
            label: "Condition Probability",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
          {
            id: "conditional",
            label: "Conditional",
            valueType: { type: "number" },
          },
          { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = conditionalProbabilityZeroCaseLabelTool.execute;
export default conditionalProbabilityZeroCaseLabelTool;
