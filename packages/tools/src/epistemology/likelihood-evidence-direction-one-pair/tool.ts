import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly likelihoodIfTrue: number;
  readonly likelihoodIfFalse: number;
};
export type Output = {
  readonly likelihoodRatio: number;
  readonly direction: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    likelihoodIfTrue: { type: "number", minimum: 0, maximum: 1 },
    likelihoodIfFalse: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["likelihoodIfTrue", "likelihoodIfFalse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    likelihoodRatio: { type: "number" },
    direction: { type: "string", maxLength: 8192 },
  },
  required: ["likelihoodRatio", "direction"],
} as const;
/** Binary likelihood evidence direction for two explicitly supplied hypotheses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { likelihoodIfTrue, likelihoodIfFalse } = request;
  const compute = (): Output => {
    H.probability(likelihoodIfTrue);
    H.domain(likelihoodIfFalse > 0 && likelihoodIfFalse <= 1);
    return {
      likelihoodRatio: likelihoodIfTrue / likelihoodIfFalse,
      direction:
        likelihoodIfTrue > likelihoodIfFalse
          ? "supports"
          : likelihoodIfTrue < likelihoodIfFalse
            ? "opposes"
            : "neutral",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { likelihoodIfTrue: 0.8, likelihoodIfFalse: 0.2 },
  output: { likelihoodRatio: 4, direction: "supports" },
} satisfies ToolExample<Input, Output>;
export const likelihoodEvidenceDirectionOnePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/likelihood-evidence-direction-one-pair",
    title: "Likelihood Evidence Direction One Pair Tool",
    description:
      "Binary likelihood evidence direction for two explicitly supplied hypotheses.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        likelihoodIfTrue: { type: "number", minimum: 0, maximum: 1 },
        likelihoodIfFalse: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["likelihoodIfTrue", "likelihoodIfFalse"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        likelihoodRatio: { type: "number" },
        direction: { type: "string", maxLength: 8192 },
      },
      required: ["likelihoodRatio", "direction"],
    },
    ports: {
      inputs: [
        {
          id: "likelihoodIfTrue",
          label: "Likelihood If True",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "likelihoodIfFalse",
          label: "Likelihood If False",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "likelihoodRatio",
          label: "Likelihood Ratio",
          valueType: { type: "number" },
        },
        { id: "direction", label: "Direction", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = likelihoodEvidenceDirectionOnePairTool.execute;
export default likelihoodEvidenceDirectionOnePairTool;
